import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface ChatAssistantProps {
  t: any;
  onClose: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ t, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hello! I am your MediGuard Assistant. Ask me about batch status, supplier scores, or recent recalls.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      let reply = "I'm not sure about that yet. Try asking about 'Batch 882' or 'Suppliers'.";
      const lower = input.toLowerCase();
      if (lower.includes('batch')) reply = "Batch #882 (Amoxicillin) is VERIFIED ✅. Expires: Dec 2025. Blockchain Hash: 0x8f...2a1.";
      if (lower.includes('supplier') || lower.includes('fail')) reply = "Budget Bio Supplies has a rejection rate of 15%. Their trust score is 55/100 (Risky).";
      if (lower.includes('recall')) reply = "⚠️ ALERT: Global recall for batch AB-902 due to chemical impurity. Please check quarantine.";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-40 animate-fade-in flex flex-col h-96">
      <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-bold text-sm">{t.chatAssistant || "AI Assistant"}</span>
        </div>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3 custom-scrollbar">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-xs ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input 
          className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t.chatPlaceholder || "Type query..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><ArrowRight size={16}/></button>
      </div>
    </div>
  );
};