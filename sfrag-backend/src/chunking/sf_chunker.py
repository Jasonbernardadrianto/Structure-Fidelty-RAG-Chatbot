"""
sf_chunker.py

Structure-Fidelity Chunker.
Memotong dokumen dengan menjaga batasan semantik dan menyuntikkan (enrich)
metadata hierarkis (Bab, Sub-bab, Breadcrumb) ke dalam setiap chunk.
"""

from typing import List, Dict, Any

class StructureFidelityChunker:
    def __init__(self, max_chunk_size: int = 1000):
        self.max_chunk_size = max_chunk_size

    def chunk_sections(self, sections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Mengubah kumpulan seksi hierarkis menjadi chunk-chunk terstruktur.
        Setiap chunk diperkaya dengan konteks silsilah dokumen agar tidak terjadi
        kehilangan konteks saat proses retrieval semantik.
        """
        chunks = []

        for idx, sec in enumerate(sections):
            content = sec["content"]
            breadcrumb = sec["breadcrumb"]
            bab = sec["bab"]
            sub_bab = sec["sub_bab"]

            # Jika konten melebihi batas ukuran, bagi berdasarkan butir/poin logis.
            # Parser menyimpan satu butir ketentuan per baris (baris kosong dibuang), sehingga
            # pemecahan dilakukan per baris agar satu butir tidak pernah terpotong di tengah,
            # dan setiap potongan tetap membawa breadcrumb induknya (Bab > Sub-bab).
            paragraphs = [p for p in content.split('\n') if p.strip()]
            current_buffer = []
            current_len = 0

            for p in paragraphs:
                p_len = len(p)
                if current_len + p_len > self.max_chunk_size and current_buffer:
                    chunk_text = "\n".join(current_buffer)
                    # Enrich dengan breadcrumb dokumen
                    enriched_text = f"Dokumen: Pedoman Pendidikan STIKOM Yos Sudarso 2025\nHierarki: {breadcrumb}\n\n{chunk_text}"
                    chunks.append({
                        "id": f"sfrag_{len(chunks)+1:03d}",
                        "text": enriched_text,
                        "metadata": {
                            "bab": bab,
                            "sub_bab": sub_bab,
                            "breadcrumb": breadcrumb,
                            "type": "structure_fidelity"
                        }
                    })
                    current_buffer = [p]
                    current_len = p_len
                else:
                    current_buffer.append(p)
                    current_len += p_len + 1

            if current_buffer:
                chunk_text = "\n".join(current_buffer)
                enriched_text = f"Dokumen: Pedoman Pendidikan STIKOM Yos Sudarso 2025\nHierarki: {breadcrumb}\n\n{chunk_text}"
                chunks.append({
                    "id": f"sfrag_{len(chunks)+1:03d}",
                    "text": enriched_text,
                    "metadata": {
                        "bab": bab,
                        "sub_bab": sub_bab,
                        "breadcrumb": breadcrumb,
                        "type": "structure_fidelity"
                    }
                })

        return chunks
