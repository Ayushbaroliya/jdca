import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose, danger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-3 sm:p-5 backdrop-blur-[2px]">
      <div className="w-full max-w-lg bg-white rounded-t-[24px] sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-none jdca-card border-0">
        <div className={`px-5 py-4 border-b flex items-center justify-between ${danger ? 'border-coral-100 bg-coral-50' : 'border-slate-100 bg-slate-50'}`}>
          <h3 className={`text-[16px] font-black ${danger ? 'text-coral' : 'text-slate-900'}`}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors">
            <X size={16} className={danger ? 'text-coral' : 'text-slate-500'} />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
