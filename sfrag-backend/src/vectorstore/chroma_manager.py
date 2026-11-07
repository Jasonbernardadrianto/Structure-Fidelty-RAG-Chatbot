"""
chroma_manager.py

Pengelola Vector Store ChromaDB lokal.
Menyimpan dan mengindeks embedding untuk koleksi SF-RAG dan Baseline.
"""

import os
import re
from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions

# Matikan telemetri PostHog untuk mencegah error signature mismatch
try:
    from chromadb.telemetry.product.posthog import Posthog
    Posthog.capture = lambda *args, **kwargs: None
except Exception:
    pass

# Daftar stopwords & kata generik akademik untuk menyaring kata umum dari reranker judul sub-bab
INDONESIAN_STOPWORDS = {
    "dan", "yang", "apa", "ini", "itu", "atau", "pada", "dari", "jika", "untuk",
    "dengan", "saya", "kamu", "bisa", "apakah", "bagaimana", "berapa", "adalah",
    "serta", "dalam", "akan", "oleh", "ada", "karena", "tidak", "saat", "agar",
    "saja", "bagi", "dapat", "selama", "lebih", "ambil", "mengambil", "mata",
    "kuliah", "mahasiswa", "semester", "studi", "program", "batas", "maksimal",
    "lama", "syarat", "ketentuan", "khusus", "akademik", "mendapatkan"
}

# Embedding multibahasa default (sentence-transformers, ~470MB, diunduh sekali lalu di-cache)
DEFAULT_EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# Jika model sudah ada di cache lokal HuggingFace, aktifkan mode offline agar tidak hang saat tanpa internet
_hf_cache = os.path.expanduser("~/.cache/huggingface/hub/models--sentence-transformers--paraphrase-multilingual-MiniLM-L12-v2")
if os.path.exists(_hf_cache):
    os.environ.setdefault("HF_HUB_OFFLINE", "1")
    os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

class VectorStoreManager:
    def __init__(self, persist_dir: str = None):
        if persist_dir is None:
            backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            self.persist_dir = os.path.join(backend_dir, "data", "chroma_db")
        else:
            self.persist_dir = persist_dir
        os.makedirs(self.persist_dir, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Embedding multibahasa (mendukung Bahasa Indonesia) via sentence-transformers.
        # Model default all-MiniLM-L6-v2 bawaan ChromaDB hanya dilatih untuk Bahasa Inggris,
        # sehingga kemiripan semantik kalimat Indonesia menjadi kurang akurat.
        # Koleksi SF-RAG dan Baseline memakai embedding yang SAMA agar perbandingan tetap adil.
        # Nama model dapat diganti lewat .env (EMBEDDING_MODEL). Berjalan di CPU tanpa GPU.
        self.embedding_model_name = os.getenv("EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL)
        try:
            self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name=self.embedding_model_name
            )
        except Exception as e:
            print(
                f"[PERINGATAN] Gagal memuat embedding '{self.embedding_model_name}' ({e}). "
                f"Kembali ke DefaultEmbeddingFunction (all-MiniLM-L6-v2, khusus Bahasa Inggris)."
            )
            self.embedding_model_name = "all-MiniLM-L6-v2 (default chromadb)"
            self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        print(f"[INFO] Embedding model aktif: {self.embedding_model_name}")

    def index_chunks(self, collection_name: str, chunks: List[Dict[str, Any]]):
        """Menyimpan chunk teks ke koleksi ChromaDB."""
        # Reset koleksi jika sudah ada untuk memastikan indeks bersih
        try:
            self.client.delete_collection(name=collection_name)
        except Exception:
            pass

        collection = self.client.create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn,
            metadata={"hnsw:space": "cosine"}
        )

        ids = [c["id"] for c in chunks]
        documents = [c["text"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]

        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
        return len(chunks)

    def query(self, collection_name: str, query_text: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Mencari potongan dokumen yang paling relevan dengan query."""
        collection = self.client.get_collection(
            name=collection_name,
            embedding_function=self.embedding_fn
        )

        total_count = collection.count()
        fetch_k = min(total_count, max(top_k * 3, 10))

        results = collection.query(
            query_texts=[query_text],
            n_results=fetch_k
        )

        retrieved_docs = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
            dists = results["distances"][0] if "distances" in results else [0.0] * len(docs)

            query_lower = query_text.lower()
            query_words = set(re.findall(r'\b\w{3,}\b', query_lower)) - INDONESIAN_STOPWORDS

            scored_candidates = []
            for doc, meta, dist in zip(docs, metas, dists):
                base_sim = 1.0 - dist
                score = base_sim

                if meta and meta.get("type") == "structure_fidelity":
                    sub_bab = meta.get("sub_bab", "").lower()
                    bab = meta.get("bab", "").lower()
                    
                    # 1. Kecocokan pada Sub-bab spesifik: bobot prioritas tinggi (+0.40 per kata)
                    sub_matches = sum(1 for w in query_words if w in sub_bab)
                    if sub_matches > 0:
                        score += 0.40 * sub_matches
                    
                    # 2. Kecocokan pada Bab induk: bobot umum (+0.05) hanya untuk kata yang belum ada di sub-bab
                    bab_matches = sum(1 for w in query_words if w in bab and w not in sub_bab)
                    if bab_matches > 0:
                        score += 0.05 * bab_matches
                    
                    # 3. Ekstraksi isi dokumen aktual (mengabaikan preamble header 'Dokumen: ... Hierarki: ...')
                    parts = doc.split("\n\n", 1)
                    body_text = parts[1].lower() if len(parts) > 1 else doc.lower()
                    
                    # 4. Frekuensi kata kunci pada isi teks (+0.08 per kemunculan, maks 5)
                    body_matches = sum(body_text.count(w) for w in query_words)
                    score += 0.08 * min(body_matches, 5)

                scored_candidates.append({
                    "text": doc,
                    "metadata": meta,
                    "distance": dist,
                    "similarity": score
                })

            scored_candidates.sort(key=lambda x: x["similarity"], reverse=True)
            retrieved_docs = scored_candidates[:top_k]

        return retrieved_docs
