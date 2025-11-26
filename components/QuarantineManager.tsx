import React from 'react';
import { AlertOctagon, CheckCircle, Trash2, RotateCcw, RefreshCw } from 'lucide-react';
import { db } from '../services/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { APP_ID } from '../constants';
import { Badge } from './Common';
import { QuarantineItem } from '../types';

interface QuarantineManagerProps {
  t: any;
  items: QuarantineItem[];
  setItems: React.Dispatch<React.SetStateAction<QuarantineItem[]>>;
  authUser: any;
}

export const QuarantineManager: React.FC<QuarantineManagerProps> = ({ t, items, setItems, authUser }) => {
    const handleAction = async (id: string, action: string) => {
        try {
            if (db && authUser) {
                const docRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'quarantine_items', id);
                await deleteDoc(docRef);
            } else {
               setItems(prev => prev.filter(item => item.id !== id));
            }
            alert(`Action "${action}" executed for Item #${id}. Database Updated.`);
        } catch(err) {
            console.error("Error updating quarantine", err);
        }
    };

    const tq = t.quarantine || {
        desc: "Manage rejected, expired, or recalled batches.",
        table: { batch: "Batch ID", name: "Product", reason: "Reason", status: "Status", action: "Actions" },
        actions: { destroy: "Destroy", return: "Return to Vendor", retest: "Re-Test" }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><AlertOctagon className="text-red-500" /> {t.quarantineTitle}</h2>
                    <p className="text-slate-500">{tq.desc}</p>
                </div>
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-bold border border-red-100">
                    {items.length} Items Pending
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">{tq.table.batch}</th>
                                <th className="px-6 py-3">{tq.table.name}</th>
                                <th className="px-6 py-3">{tq.table.reason}</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">{tq.table.status}</th>
                                <th className="px-6 py-3">{tq.table.action}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        <CheckCircle size={32} className="mx-auto mb-2 text-green-300" />
                                        Quarantine is empty. All clear.
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-800">{item.batch}</td>
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4"><span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded">{item.reason}</span></td>
                                        <td className="px-6 py-4 text-slate-500">{item.date}</td>
                                        <td className="px-6 py-4"><Badge status={item.status} /></td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => handleAction(item.id, 'Destroy')} className="p-2 text-red-600 hover:bg-red-50 rounded" title={tq.actions.destroy}><Trash2 size={16}/></button>
                                            <button onClick={() => handleAction(item.id, 'Return')} className="p-2 text-orange-600 hover:bg-orange-50 rounded" title={tq.actions.return}><RotateCcw size={16}/></button>
                                            <button onClick={() => handleAction(item.id, 'Retest')} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title={tq.actions.retest}><RefreshCw size={16}/></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};