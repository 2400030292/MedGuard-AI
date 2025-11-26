import React from 'react';
import { X, Link as LinkIcon, QrCode, Lock } from 'lucide-react';
import { DRUG_PASSPORT_DATA } from '../constants';

interface DigitalPassportProps {
  t: any;
  onClose: () => void;
}

export const DigitalPassport: React.FC<DigitalPassportProps> = ({ t, onClose }) => {
  const data = DRUG_PASSPORT_DATA;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-800">{t.passport || "Medicine Passport"}</h2>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-200">
                <LinkIcon size={10} /> {t.blockchainVerified || "Blockchain Verified"}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-mono">ID: {data.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-8">
          <div className="flex gap-4 items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="bg-white p-3 rounded-lg shadow-sm"><QrCode size={40} className="text-slate-800"/></div>
            <div><h3 className="font-bold text-slate-800">{data.product}</h3><p className="text-sm text-slate-600">Batch: <span className="font-mono font-bold">{data.batch}</span></p></div>
          </div>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
            {data.timeline.map((item, idx) => (
              <div key={idx} className="pl-6 relative">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${item.status === 'verified' ? 'bg-green-500 border-white shadow' : 'bg-slate-200 border-white'}`}></div>
                <div>
                  <div className="flex justify-between items-start"><h4 className="font-bold text-slate-800 text-sm">{item.event}</h4><span className="text-xs text-slate-400 font-mono">{item.date}</span></div>
                  <p className="text-xs text-slate-500 mt-0.5">{item.loc} {item.temp && `• ${item.temp}`}</p>
                  <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 flex items-center gap-2"><Lock size={12} className="text-slate-400" /><code className="text-[10px] text-slate-500 truncate flex-1">{item.hash}</code></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};