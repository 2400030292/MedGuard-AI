import React from 'react';
import { LucideIcon } from 'lucide-react';
import { SidebarItemProps } from '../types';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip
} from 'recharts';

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

interface CardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color: string;
}

export const Card: React.FC<CardProps> = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
      <p className={`text-sm mt-1 ${subtext.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>{subtext}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Trusted: 'bg-green-100 text-green-700 border-green-200',
    Safe: 'bg-blue-100 text-blue-700 border-blue-200',
    Risky: 'bg-red-100 text-red-700 border-red-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Verified: 'bg-teal-100 text-teal-700 border-teal-200',
    Passed: 'bg-teal-100 text-teal-700 border-teal-200',
    Failed: 'bg-rose-100 text-rose-700 border-rose-200',
    Rejected: 'bg-rose-100 text-rose-700 border-rose-200',
    Quarantined: 'bg-purple-100 text-purple-700 border-purple-200',
    "High Risk": 'bg-red-100 text-red-700 border-red-200',
    Review: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  // Check for search match results to style them distinctly
  let styleClass = styles[status];
  if (!styleClass) {
      if (status.includes('Match') || status.includes('Found')) {
          styleClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      } else if (status === 'No Results') {
          styleClass = 'bg-slate-100 text-slate-500 border-slate-200';
      } else {
          styleClass = styles.Pending;
      }
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styleClass}`}>
      {status}
    </span>
  );
};

interface SimpleGraphProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  type?: 'line' | 'bar';
}

export const SimpleGraph: React.FC<SimpleGraphProps> = ({ data, labels, color = '#3b82f6', height = 150, type = 'line' }) => {
  const chartData = data.map((val, i) => ({ name: labels[i] || i, value: val }));

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        {type === 'line' ? (
           <AreaChart data={chartData}>
             <defs>
               <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                 <stop offset="95%" stopColor={color} stopOpacity={0}/>
               </linearGradient>
             </defs>
             <Tooltip 
               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
               cursor={{ stroke: '#e2e8f0' }}
             />
             <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#color-${color})`} strokeWidth={2} />
           </AreaChart>
        ) : (
          <BarChart data={chartData}>
             <Tooltip 
               cursor={{ fill: '#f1f5f9' }}
               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             />
             <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
      <div className="flex justify-between mt-2 text-[10px] text-slate-400 px-2">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  );
};