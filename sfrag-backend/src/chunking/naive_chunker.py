"""
naive_chunker.py

Baseline Fixed-Size Chunker.
Pemotongan teks konvensional berbasis panjang karakter tetap dengan overlap,
tanpa mempertimbangkan batas bab, pasal, atau silsilah dokumen.
"""

from typing import List, Dict, Any

class NaiveFixedChunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, full_text: str) -> List[Dict[str, Any]]:
        chunks = []
        start = 0
        text_len = len(full_text)
        chunk_num = 1

        while start < text_len:
            end = min(start + self.chunk_size, text_len)
            chunk_text = full_text[start:end].strip()

            if chunk_text:
                chunks.append({
                    "id": f"baseline_{chunk_num:03d}",
                    "text": chunk_text,
                    "metadata": {
                        "type": "naive_fixed_size",
                        "start_pos": start,
                        "end_pos": end
                    }
                })
                chunk_num += 1

            start += (self.chunk_size - self.chunk_overlap)

        return chunks
