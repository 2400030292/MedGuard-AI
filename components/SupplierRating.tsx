import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Supplier } from '../types';
import { Badge, SimpleGraph } from './Common';

interface SupplierRatingProps {
  t: any;
  INITIAL_SUPPLIERS: Supplier[];
}

export const SupplierRating: React.FC<SupplierRatingProps> = ({ t, INITIAL_SUPPLIERS }) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div><h2 className="text-2xl font-bold text-slate-800">{t.supplierIntel}</h2><p className="text-slate-500">{t.supplierDesc}</p></div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"><BarChart3 size={18} /> Export</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="p-4 font-semibold text-slate-600">{t.supplierTable.name}</th><th className="p-4 font-semibold text-slate-600">{t.supplierTable.score}</th><th className="p-4 font-semibold text-slate-600">{t.supplierTable.status}</th><th className="p-4 font-semibold text-slate-600">{t.supplierTable.action}</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                {INITIAL_SUPPLIERS.map((s) => (
                    <React.Fragment key={s.id}>
                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedRow(expandedRow === s.id ? null : s.id)}>
                        <td className="p-4 font-medium text-slate-800">{s.name}</td>
                        <td className="p-4"><div className="flex items-center gap-3"><div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s.score > 80 ? 'bg-green-500' : s.score > 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${s.score}%`}}></div></div><span className="text-sm font-bold text-slate-600">{s.score}</span></div></td>
                        <td className="p-4"><Badge status={s.status} /></td>
                        <td className="p-4"><button className="text-blue-600 hover:text-blue-800 text-sm font-medium">{t.actions.viewScore}</button></td>
                        </tr>
                        {expandedRow === s.id && (
                            <tr className="bg-slate-50"><td colSpan={4} className="p-4">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                                        {Object.entries(s.breakdown).map(([k, v]) => (
                                            <div key={k} className="bg-white p-3 rounded border border-slate-200"><span className="block text-slate-500 text-xs uppercase">{k}</span><span className="font-bold text-lg text-slate-800">{v}</span></div>
                                        ))}
                                    </div>
                                    <div className="flex-1 bg-white p-4 rounded border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Score History (6 Mo)</h4>
                                        <SimpleGraph data={s.history} labels={['M1', 'M2', 'M3', 'M4', 'M5', 'M6']} color="#64748b" height={80} type="line" />
                                    </div>
                                </div>
                            </td></tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
};