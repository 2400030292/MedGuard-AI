import React from 'react';
import { 
  Eraser, Wifi, WifiOff, FileText, Smartphone, Laptop, 
  Activity, Lock, Users, BarChart3, Bell, XCircle, AlertTriangle 
} from 'lucide-react';
import { Card, Badge, SimpleGraph } from './Common';
import { AuditLog, Notification, ConnectionStatus } from '../types';

interface DashboardProps {
  t: any;
  notifications: Notification[];
  quarantineCount: number;
  chartType: 'line' | 'bar';
  setChartType: (type: 'line' | 'bar') => void;
  role: string;
  auditLogs: AuditLog[];
  connectionStatus: ConnectionStatus;
  handleClearSystem: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  t, notifications, quarantineCount, chartType, setChartType, role, 
  auditLogs, connectionStatus, handleClearSystem 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t.qcDashboard}</h1>
          <p className="text-slate-500">{t.realTimeOverview}</p>
        </div>
        <div className="flex items-center gap-3">
            {role === 'admin' && (
                <button 
                    onClick={handleClearSystem}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-bold border border-red-200"
                >
                    <Eraser size={14}/> Reset System
                </button>
            )}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${connectionStatus === 'live' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {connectionStatus === 'live' ? <Wifi size={14}/> : <WifiOff size={14}/>}
                {connectionStatus === 'live' ? 'Live Sync' : 'Offline'}
            </div>
        </div>
      </div>

      {role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-blue-600"/> {t.adminLogTitle || "Live Staff Activity Log"}</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Real-Time</span>
            </div>
            <div className="overflow-x-auto max-h-64 custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100 sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Batch</th>
                            <th className="px-6 py-3">Device</th>
                            <th className="px-6 py-3">Result</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {auditLogs.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">System is clean. No activity logged.</td></tr>
                        ) : auditLogs.map((log, idx) => (
                            <tr key={log.id || idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 font-mono text-slate-500">{log.time}</td>
                                <td className="px-6 py-3 font-medium text-slate-800">{log.user}</td>
                                <td className="px-6 py-3"><span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">{log.role}</span></td>
                                <td className="px-6 py-3 text-slate-600">{log.action}</td>
                                <td className="px-6 py-3 font-mono text-xs">{log.batch}</td>
                                <td className="px-6 py-3 flex items-center gap-1 text-slate-500">
                                    {log.device?.includes('Mobile') ? <Smartphone size={14}/> : <Laptop size={14}/>}
                                    {log.device}
                                </td>
                                <td className="px-6 py-3"><Badge status={log.result} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title={t.trustScore} value="88/100" subtext="Top 10% Hospitals" icon={Activity} color="bg-emerald-500" />
        <Card title={t.batchesPending} value="12" subtext="Requires Action" icon={FileText} color="bg-amber-500" />
        <Card title={t.quarantined} value={quarantineCount} subtext="High Risk Items" icon={Lock} color="bg-purple-500" />
        <Card title={t.activeSuppliers} value="24" subtext="+2 this month" icon={Users} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-center mb-6">
                <div><h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity className="text-blue-500" size={20} />{t.complianceTrend}</h3><p className="text-xs text-slate-500">Passed vs Failed Batches (6 Mo)</p></div>
                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    <button onClick={() => setChartType('line')} className={`p-1.5 rounded ${chartType === 'line' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><Activity size={16}/></button>
                    <button onClick={() => setChartType('bar')} className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><BarChart3 size={16}/></button>
                </div>
            </div>
            <div className="relative h-64"><SimpleGraph data={[120, 135, 125, 145, 160, 155]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} color="#3b82f6" height={220} type={chartType} /></div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><Bell className="text-amber-500" size={16} />{t.liveAlerts}</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <div className="divide-y divide-slate-50 max-h-48 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">No recent alerts. System optimal.</div>
                    ) : notifications.map((alert) => (
                    <div key={alert.id} className="p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors animate-fade-in">
                        <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${alert.type === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{alert.type === 'CRITICAL' ? <XCircle size={14} /> : <AlertTriangle size={14} />}</div>
                        <div><p className="text-xs font-medium text-slate-800 leading-tight">{alert.category && <span className="font-bold uppercase text-[10px] opacity-70 mr-1">{alert.category}:</span>}{alert.msg}</p><p className="text-[10px] text-slate-400 mt-1">{alert.time}</p></div>
                    </div>
                    ))}
                </div>
            </div>
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">{t.riskHeatmap}</h3>
                <div className="space-y-3">
                    {[{ label: 'Antibiotics', val: 98, color: 'bg-green-500', text: 'Safe' }, { label: 'Pain Killers', val: 65, color: 'bg-amber-400', text: 'Medium Risk' }, { label: 'Insulin', val: 30, color: 'bg-red-500', text: 'High Risk' }].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1"><span className="text-slate-600">{item.label}</span><span className={`font-semibold ${item.val > 80 ? 'text-green-600' : item.val > 50 ? 'text-amber-500' : 'text-red-500'}`}>{item.text}</span></div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};