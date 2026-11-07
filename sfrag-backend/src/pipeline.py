"""
pipeline.py

Orkestrator Utama Pipeline SF-RAG vs Baseline.
Mengatur inisialisasi dokumen, proses indexing kedua jalur (SF vs Baseline),
serta menyediakan fungsi query perbandingan.
"""

import os
from src.parser.structure_parser import StructureFidelityParser
from src.chunking.sf_chunker import StructureFidelityChunker
from src.chunking.naive_chunker import NaiveFixedChunker
from src.vectorstore.chroma_manager import VectorStoreManager
from src.generator.gemini_llm import GeminiGenerator

class SFragPipeline:
    def __init__(self, doc_path: str = None):
        if doc_path is None:
            backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            self.doc_path = os.path.join(backend_dir, "data", "processed", "pedoman_pendidikan_sys_2025_structured.md")
        else:
            self.doc_path = doc_path
        self.parser = StructureFidelityParser()
        self.sf_chunker = StructureFidelityChunker(max_chunk_size=800)
        self.naive_chunker = NaiveFixedChunker(chunk_size=500, chunk_overlap=50)
        self.vector_store = VectorStoreManager()
        self.generator = GeminiGenerator()

        self.sfrag_collection = "sfrag_academic_sys"
        self.baseline_collection = "baseline_academic_sys"
        self.is_indexed = False

    def build_indexes(self):
        """Mengeksekusi parsing dan pembuatan vector store untuk kedua jalur."""
        if not os.path.exists(self.doc_path):
            raise FileNotFoundError(f"Dokumen pedoman tidak ditemukan di {self.doc_path}")

        with open(self.doc_path, 'r', encoding='utf-8') as f:
            full_text = f.read()

        # 1. Jalur SF-RAG (Structure-Preserving)
        sections = self.parser.parse_markdown(full_text)
        sf_chunks = self.sf_chunker.chunk_sections(sections)
        sf_count = self.vector_store.index_chunks(self.sfrag_collection, sf_chunks)

        # 2. Jalur Baseline (Naive Fixed-Size)
        baseline_chunks = self.naive_chunker.chunk_text(full_text)
        base_count = self.vector_store.index_chunks(self.baseline_collection, baseline_chunks)

        self.is_indexed = True
        return {
            "sfrag_chunks_indexed": sf_count,
            "baseline_chunks_indexed": base_count,
            "status": "ready"
        }

    def ask(self, query: str, method: str = "sfrag", top_k: int = 4,
            student_context: dict = None, history: list = None) -> dict:
        """
        Menjalankan query melalui jalur SF-RAG atau Baseline.
        student_context: data KHS/profil mahasiswa (dari frontend) yang disisipkan ke prompt.
        history: riwayat percakapan opsional (maks 6 pesan) untuk pertanyaan lanjutan.
        """
        collection_name = self.sfrag_collection if method == "sfrag" else self.baseline_collection
        retrieved = self.vector_store.query(collection_name, query, top_k=top_k)
        
        response = self.generator.generate_response(
            query, retrieved, is_sfrag=(method == "sfrag"),
            student_context=student_context, history=history,
        )
        
        return {
            "query": query,
            "method": method,
            "answer": response["answer"],
            "model": response["model"],
            "is_fallback": response.get("is_fallback", False),
            "fallback_reason": response.get("fallback_reason"),
            "retrieved_contexts": retrieved
        }
