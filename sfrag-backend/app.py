"""
app.py

REST API Server FastAPI untuk melayani Chatbot Akademik & Evaluasi Benchmark.
Menghubungkan frontend React dengan modul SF-RAG backend.
"""

import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

from src.pipeline import SFragPipeline

app = FastAPI(
    title="SF-RAG Academic Assistant API",
    description="Backend Chatbot Akademik Berbasis Structure-Fidelity RAG (STIKOM Yos Sudarso 2025)",
    version="1.0.0"
)

# CORS middleware agar dapat diakses dari Vite Frontend (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = SFragPipeline()

class HistoryMessage(BaseModel):
    role: str  # "user" atau "ai"
    text: str

class ChatRequest(BaseModel):
    query: str
    method: Optional[str] = "sfrag" # "sfrag" atau "baseline"
    top_k: Optional[int] = 4
    # Data akademik mahasiswa (profil, ringkasan IPK, KHS per semester) dari frontend
    student_context: Optional[Dict[str, Any]] = None
    # Riwayat percakapan opsional (maks 6 pesan terakhir), hanya dikirim jika toggle aktif di UI
    history: Optional[List[HistoryMessage]] = None

class EvaluateRequest(BaseModel):
    query: str

@app.on_event("startup")
def startup_event():
    print("Inisialisasi indeks SF-RAG dan Baseline...")
    try:
        res = pipeline.build_indexes()
        print(f"Indeks siap: {res}")
    except Exception as e:
        print(f"Peringatan inisialisasi indeks: {e}")

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SF-RAG Academic API",
        "version": "1.0.0"
    }

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query tidak boleh kosong.")
    
    start_time = time.time()
    history = [h.model_dump() for h in req.history][-6:] if req.history else None
    result = pipeline.ask(
        query=req.query, method=req.method, top_k=req.top_k,
        student_context=req.student_context, history=history,
    )
    elapsed_seconds = round(time.time() - start_time, 3)
    
    return {
        "query": result["query"],
        "method": result["method"],
        "answer": result["answer"],
        "model": result["model"],
        "is_fallback": result["is_fallback"],
        "fallback_reason": result["fallback_reason"],
        "sources": [c.get("metadata", {}).get("breadcrumb", "Dokumen Pedoman") for c in result["retrieved_contexts"]],
        "latency_seconds": elapsed_seconds
    }

@app.post("/api/evaluate")
def evaluate_endpoint(req: EvaluateRequest):
    """
    Membandingkan langsung hasil retrieval & jawaban antara SF-RAG vs Baseline
    untuk keperluan demonstrasi demo UTS dan laporan ilmiah.
    """
    # 1. Jalankan SF-RAG
    t0 = time.time()
    sfrag_res = pipeline.ask(query=req.query, method="sfrag", top_k=2)
    sfrag_time = round(time.time() - t0, 3)

    # 2. Jalankan Baseline
    t1 = time.time()
    base_res = pipeline.ask(query=req.query, method="baseline", top_k=2)
    base_time = round(time.time() - t1, 3)

    return {
        "query": req.query,
        "sfrag": {
            "answer": sfrag_res["answer"],
            "retrieved_contexts": [c["text"][:250] + "..." for c in sfrag_res["retrieved_contexts"]],
            "breadcrumbs": [c.get("metadata", {}).get("breadcrumb", "-") for c in sfrag_res["retrieved_contexts"]],
            "latency": sfrag_time
        },
        "baseline": {
            "answer": base_res["answer"],
            "retrieved_contexts": [c["text"][:250] + "..." for c in base_res["retrieved_contexts"]],
            "latency": base_time
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
