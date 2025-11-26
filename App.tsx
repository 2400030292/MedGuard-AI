import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, BarChart3, Camera, Users, Database, AlertOctagon, 
  Menu, X, Globe, Bell, LogOut, User, MessageSquare 
} from 'lucide-react';
import { addDoc, collection, serverTimestamp, doc, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { auth, db, initAuth } from './services/firebase';
import { useLiveCollection } from './hooks/useLiveCollection';
import { ROLES, DRUG_STANDARDS, INITIAL_SUPPLIERS, TRANSLATIONS, APP_ID } from './constants';
import { Role, AuditLog, QuarantineItem } from './types';
import { SidebarItem } from './components/Common';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { VerificationStudio } from './components/VerificationStudio';
import { SupplierRating } from './components/SupplierRating';
import { StandardsLibrary } from './components/StandardsLibrary';
import { QuarantineManager } from './components/QuarantineManager';
import { DigitalPassport } from './components/DigitalPassport';
import { ChatAssistant } from './components/ChatAssistant';

export default function App() {
  const [user, setUser] = useState<Role | null>(null); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [authUser, setAuthUser] = useState<any>(null);
  
  const { data: auditLogs, status: auditStatus } = useLiveCollection<AuditLog>('audit_logs', authUser, []);
  const { data: quarantineItems, status: quarantineStatus } = useLiveCollection<QuarantineItem>('quarantine_items', authUser, []);
  
  const [lang, setLang] = useState('en'); 
  const [quarantineCount, setQuarantineCount] = useState(3);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    initAuth();
    if(auth) {
        return onAuthStateChanged(auth, setAuthUser);
    }
  }, []);

  useEffect(() => {
      if(quarantineItems) setQuarantineCount(quarantineItems.length);
  }, [quarantineItems]);

  const handleScanComplete = async (newLog: AuditLog, passed: boolean, forceQuarantine = false) => {
      if (db && authUser) {
          try {
              const colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'audit_logs');
              await addDoc(colRef, {
                  ...newLog,
                  createdAt: serverTimestamp()
              });
          } catch (e) { console.error("Log write failed", e); }
      }

      if (!passed || forceQuarantine) {
          if (db && authUser) {
              try {
                  const colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'quarantine_items');
                  await addDoc(colRef, {
                      batch: newLog.batch,
                      name: "Unknown Product (Scanned)", 
                      reason: forceQuarantine ? "Manual Action" : "Verification Failed",
                      date: new Date().toLocaleDateString(),
                      status: "Pending",
                      officer: newLog.user,
                      createdAt: serverTimestamp()
                  });
                  setNotifications(prev => [{id: Date.now(), type: 'CRITICAL', msg: `Batch ${newLog.batch} moved to Quarantine`, time: 'Just now', category: 'System'}, ...prev]);
              } catch (e) { console.error("Quarantine write failed", e); }
          }
      }
  };

  const handleLogSearch = async (term: string, count: number) => {
    if (db && authUser && user) {
        try {
            const colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'audit_logs');
            await addDoc(colRef, {
                user: user.label,
                role: user.id.charAt(0).toUpperCase() + user.id.slice(1),
                action: 'Database Search',
                batch: term, // Storing term in batch column for consistency with log table
                result: count === 0 ? 'No Results' : `${count} Matches`,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                device: window.innerWidth < 768 ? 'Mobile App' : 'Web Portal',
                createdAt: serverTimestamp()
            });
        } catch (e) { console.error("Search log failed", e); }
    }
  };

  const handleClearSystem = async () => {
    if(!db || !user || user.id !== 'admin') return;
    if(!window.confirm("Are you sure you want to clear ALL system data? This cannot be undone.")) return;
    
    try {
        const batch = writeBatch(db);
        let count = 0;

        auditLogs.forEach((item) => {
            if(item.id) {
                const ref = doc(db, 'artifacts', APP_ID, 'public', 'data', 'audit_logs', item.id);
                batch.delete(ref);
                count++;
            }
        });
        
        quarantineItems.forEach((item) => {
            if(item.id) {
                const ref = doc(db, 'artifacts', APP_ID, 'public', 'data', 'quarantine_items', item.id);
                batch.delete(ref);
                count++;
            }
        });

        if (count > 0) await batch.commit();

        alert("System Cleared.");
    } catch (e) {
        console.error("Clear failed", e);
    }
  };

  const handleLogin = async (role: Role) => {
      setUser(role);
      if (!authUser && auth) {
          try { initAuth(); } catch(e) { console.warn("Manual auth trigger failed", e); }
      }
  };

  const t = useMemo(() => {
    const base = TRANSLATIONS['en'];
    const current = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    return { ...base, ...current, 
        supplierTable: { ...base.supplierTable, ...(current.supplierTable || {}) }, 
        quarantine: { ...base.quarantine, ...(current.quarantine || {}) }
    } as any;
  }, [lang]);

  if (!user) {
    return <LoginScreen onLogin={handleLogin} t={t} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-800"><div className="flex items-center gap-2 text-white"><div className="bg-blue-600 p-2 rounded-lg"><ShieldCheck size={24} /></div><span className="text-xl font-bold tracking-tight">{t.appTitle}</span></div><p className="text-xs text-slate-500 mt-2 ml-1">{t.tagline}</p></div>
        <nav className="flex-1 p-4 space-y-2">
          {(user.access.includes('all') || user.access.includes('dashboard')) && <SidebarItem icon={BarChart3} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />}
          {(user.access.includes('all') || user.access.includes('verify')) && <SidebarItem icon={Camera} label={t.verifyBatch} active={activeTab === 'verify'} onClick={() => setActiveTab('verify')} />}
          {(user.access.includes('all') || user.access.includes('suppliers')) && <SidebarItem icon={Users} label={t.supplierRatings} active={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')} />}
          {(user.access.includes('all') || user.access.includes('library')) && <SidebarItem icon={Database} label={t.standardsLibrary} active={activeTab === 'library'} onClick={() => setActiveTab('library')} />}
          {(user.access.includes('all') || user.access.includes('quarantine')) && <SidebarItem icon={AlertOctagon} label={t.quarantineTitle} active={activeTab === 'quarantine'} onClick={() => setActiveTab('quarantine')} />}
        </nav>
        <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-xl p-4 mb-2">
                <p className="text-xs text-slate-400 mb-1">Logged in as:</p>
                <div className="flex items-center gap-2 text-white font-bold"><User size={14}/> {user.label}</div>
            </div>
            <button onClick={() => setUser(null)} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm"><LogOut size={16}/> Logout</button>
        </div>
      </aside>

      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen relative">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between lg:justify-end shadow-sm">
           <div className="lg:hidden flex items-center gap-2"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button><span className="font-bold text-slate-800">{t.appTitle}</span></div>
           <div className="flex items-center gap-6">
                <div className="relative">
                  <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-50"><Globe size={20} /><span className="uppercase text-sm font-bold">{lang}</span></button>
                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                      {['en', 'hi', 'te', 'ta', 'ml', 'kn'].map(l => (<button key={l} onClick={() => { setLang(l); setIsLangMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 uppercase">{l}</button>))}
                    </div>
                  )}
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="relative cursor-pointer" onClick={() => setActiveTab('dashboard')}><div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div><Bell className="text-slate-500 hover:text-slate-700" size={20} /></div>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">{user.label.substring(0,2).toUpperCase()}</div>
                    <div className="hidden md:block"><p className="text-sm font-medium text-slate-800">{user.label}</p><p className="text-xs text-slate-500">Authenticated</p></div>
                </div>
           </div>
        </header>

        {mobileMenuOpen && (
             <div className="lg:hidden bg-slate-800 text-white p-4 space-y-2 absolute w-full top-16 z-20 shadow-xl">
                 <SidebarItem icon={BarChart3} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setMobileMenuOpen(false)}} />
                 <SidebarItem icon={Camera} label={t.verifyBatch} active={activeTab === 'verify'} onClick={() => {setActiveTab('verify'); setMobileMenuOpen(false)}} />
                 <SidebarItem icon={Users} label={t.supplierRatings} active={activeTab === 'suppliers'} onClick={() => {setActiveTab('suppliers'); setMobileMenuOpen(false)}} />
                 <SidebarItem icon={Database} label={t.standardsLibrary} active={activeTab === 'library'} onClick={() => {setActiveTab('library'); setMobileMenuOpen(false)}} />
                 <SidebarItem icon={AlertOctagon} label={t.quarantineTitle} active={activeTab === 'quarantine'} onClick={() => {setActiveTab('quarantine'); setMobileMenuOpen(false)}} />
             </div>
        )}

        <div className="p-6 lg:p-8 flex-1 overflow-y-auto relative">
            {activeTab === 'dashboard' && <Dashboard t={t} notifications={notifications} quarantineCount={quarantineCount} chartType={chartType} setChartType={setChartType} role={user.id} auditLogs={auditLogs} connectionStatus={auditStatus} handleClearSystem={handleClearSystem} />}
            {activeTab === 'verify' && <VerificationStudio t={t} setNotifications={setNotifications} setQuarantineCount={setQuarantineCount} onShowPassport={() => setShowPassport(true)} onScanComplete={handleScanComplete} userRole={user} authUser={authUser} />}
            {activeTab === 'suppliers' && <SupplierRating t={t} INITIAL_SUPPLIERS={INITIAL_SUPPLIERS} />}
            {activeTab === 'library' && <StandardsLibrary t={t} DRUG_STANDARDS={DRUG_STANDARDS} onLogSearch={handleLogSearch} />}
            {activeTab === 'quarantine' && <QuarantineManager t={t} items={quarantineItems} setItems={() => {}} authUser={authUser} />}
        </div>

        <button 
            onClick={() => setShowChat(!showChat)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-30 flex items-center gap-2"
        >
            <MessageSquare size={24} />
            {showChat ? "" : <span className="font-bold pr-2 hidden md:inline">{t.chatAssistant}</span>}
        </button>

        {showPassport && <DigitalPassport t={t} onClose={() => setShowPassport(false)} />}
        {showChat && <ChatAssistant t={t} onClose={() => setShowChat(false)} />}
      </main>
    </div>
  );
}