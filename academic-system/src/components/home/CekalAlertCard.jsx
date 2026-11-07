import React from 'react';
import { AlertOctagon, ExternalLink, Phone } from 'lucide-react';

export default function CekalAlertCard({ student }) {
  if (!student.hasFinancialHold) return null;

  return (
    <div className="bg-rose-50/70 border border-rose-200 rounded p-4 shadow-xs text-rose-950">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-rose-100 rounded text-rose-700 shrink-0 mt-0.5">
          <AlertOctagon className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-rose-900 uppercase tracking-wide">
              Informasi Cekal / Blokir Administrasi
            </h4>
            <span className="font-mono text-[11px] bg-rose-200/80 px-2 py-0.5 rounded text-rose-900 font-semibold">
              {student.currentSemesterName}
            </span>
          </div>

          <p className="mt-2 text-rose-800 leading-relaxed">
            {student.financialHoldMessage}
          </p>

          <div className="mt-3 pt-2.5 border-t border-rose-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-rose-700">
              Silakan menyelesaikan blokir Anda ke unit: <strong>Biro Keuangan (Lantai 1)</strong>
            </span>
            <div className="flex items-center space-x-2">
              <a 
                href="#finance" 
                onClick={(e) => { e.preventDefault(); alert("Simulasi membuka portal keuangan universitas."); }}
                className="px-2.5 py-1 bg-rose-700 text-white hover:bg-rose-800 rounded font-medium flex items-center space-x-1"
              >
                <span>Portal Keuangan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
