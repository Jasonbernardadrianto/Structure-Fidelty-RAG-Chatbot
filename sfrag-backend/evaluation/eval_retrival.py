"""
eval_retrival.py

Evaluasi Kuantitatif Retrieval Dokumen: Structure-Fidelity RAG vs Baseline.
Mengukur metrik standar Information Retrieval:
- Hit@1: Apakah chunk ranking 1 memuat informasi relevan
- Hit@3: Apakah top-3 chunk memuat informasi relevan
- MRR (Mean Reciprocal Rank): Kualitas peringkat dokumen yang relevan
- Recall@K: Proporsi kata kunci emas yang berhasil terambil dalam top-K chunk

Hasil disimpan dalam bentuk CSV (result_SF-RAG.csv & result_Baseline.csv) untuk laporan.
"""

import os
import sys
import json
import csv
import statistics

# Pastikan root folder sfrag-backend masuk ke sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from src.pipeline import SFragPipeline

K = 3

def first_hit_rank(chunks, keywords):
    for i, c in enumerate(chunks, 1):
        text = c["text"].lower()
        if any(k.lower() in text for k in keywords):
            return i
    return None

def recall(chunks, keywords):
    joined = " ".join(c["text"].lower() for c in chunks)
    return sum(k.lower() in joined for k in keywords) / len(keywords)

def evaluate(retrieve_fn, data):
    rows = []
    for item in data:
        chunks = retrieve_fn(item["query"], K)
        rank = first_hit_rank(chunks, item["gold_keywords"])
        rows.append({
            "id": item["id"],
            "topic": item.get("topic", "-"),
            "rank": rank if rank is not None else 0,
            "hit1": int(rank == 1),
            "hit3": int(rank is not None and rank <= 3),
            "rr": round(1 / rank, 3) if rank else 0.0,
            "recall": round(recall(chunks, item["gold_keywords"]), 3),
        })
    return rows

def summarize(name, rows):
    n = len(rows)
    hit1 = sum(r['hit1'] for r in rows) / n
    hit3 = sum(r['hit3'] for r in rows) / n
    mrr = statistics.mean(r['rr'] for r in rows)
    rec = statistics.mean(r['recall'] for r in rows)
    print(f"{name:10} | Hit@1: {hit1:.2f} | Hit@3: {hit3:.2f} | MRR: {mrr:.2f} | Recall@{K}: {rec:.2f}")

if __name__ == "__main__":
    dataset_path = os.path.join(os.path.dirname(__file__), "dataset.json")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"File dataset tidak ditemukan: {dataset_path}")

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("Mempersiapkan pipeline & indeks SF-RAG vs Baseline...")
    pipeline = SFragPipeline()
    pipeline.build_indexes()

    def sfrag_retrieve(query, top_k):
        return pipeline.vector_store.query(pipeline.sfrag_collection, query, top_k=top_k)

    def baseline_retrieve(query, top_k):
        return pipeline.vector_store.query(pipeline.baseline_collection, query, top_k=top_k)

    print("=" * 70)
    print("HASIL EVALUASI RETRIEVAL (SF-RAG vs BASELINE)")
    print("=" * 70)

    for name, fn in [("SF-RAG", sfrag_retrieve), ("Baseline", baseline_retrieve)]:
        rows = evaluate(fn, data)
        summarize(name, rows)
        out_csv = os.path.join(os.path.dirname(__file__), f"result_{name}.csv")
        with open(out_csv, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=rows[0].keys())
            w.writeheader()
            w.writerows(rows)
        print(f"Detail tersimpan di: {out_csv}")
    print("=" * 70)
