"""
structure_parser.py

Modul ekstraksi struktur dokumen (Structure-Fidelity Parser).
Menganalisis teks dokumen pedoman pendidikan dan mempertahankan pohon hierarki
(Level Dokumen -> Bab -> Sub-bab / Pasal -> Butir / Tabel).
"""

import re
from typing import List, Dict, Any

class StructureFidelityParser:
    def __init__(self):
        # Pola Regex untuk mendeteksi hierarki Bab (## BAB ...) dan Sub-bab (### ... atau A. ...)
        # Catatan: case-sensitive + word boundary (\b) agar kalimat biasa seperti "Bab ini ..." atau
        # butir huruf kecil "a. ..." tidak salah dianggap sebagai header Bab / Sub-bab.
        self.bab_pattern = re.compile(r'^(?:##\s+)?(BAB\s+[IVXLCDM]+\b(?::\s*|\s*-\s*|\s+)?.*)')
        self.sub_pattern = re.compile(r'^(?:###\s+(.+)|([A-Z]\.\s+[A-Z].*))')
        self.pasal_point_pattern = re.compile(r'^(?:[0-9]+\.|\([0-9]+\)|[a-z]\))\s+.*', re.IGNORECASE)

    def parse_markdown(self, markdown_text: str) -> List[Dict[str, Any]]:
        """
        Mem-parsing teks Markdown menjadi node hierarkis berstruktur.
        Setiap node menyimpan konten, silsilah (breadcrumb), dan metadata.
        """
        lines = markdown_text.split('\n')
        sections = []
        
        current_bab = "UMUM"
        current_sub = "PENDAHULUAN"
        current_content_lines = []

        def flush_current_section():
            if current_content_lines:
                text_content = "\n".join(current_content_lines).strip()
                if text_content:
                    sections.append({
                        "bab": current_bab,
                        "sub_bab": current_sub,
                        "breadcrumb": f"{current_bab} > {current_sub}",
                        "content": text_content,
                    })
                current_content_lines.clear()

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue

            # Cek apakah baris adalah Header BAB
            bab_match = self.bab_pattern.match(stripped)
            if bab_match:
                flush_current_section()
                current_bab = stripped.replace('#', '').strip()
                current_sub = "UMUM"
                continue

            # Cek apakah baris adalah Sub-bab (A. Judul, B. Judul, dst)
            sub_match = self.sub_pattern.match(stripped)
            if sub_match:
                flush_current_section()
                current_sub = stripped.replace('#', '').strip()
                continue

            current_content_lines.append(stripped)

        flush_current_section()
        return sections
