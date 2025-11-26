import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Server, AlertTriangle, KeyRound, ArrowRight, ArrowLeft, Globe } from 'lucide-react';
import { Role } from '../types';
import { ROLES } from '../constants';

interface LoginScreenProps {
  onLogin: (role: Role) => void;
  t: any;
  lang: string;
  setLang: (lang: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, t, lang, setLang }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    if (pin === selectedRole.pin) {
        setIsLoading(true);
        setTimeout(() => {
            onLogin(selectedRole);
        }, 1000);
    } else {
        setError('Access Denied: Incorrect PIN');
        setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
         <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
              className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/50 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Globe size={18} />
              <span className="uppercase text-sm font-bold">{lang}</span>
            </button>
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-50 overflow-hidden py-1 animate-fade-in border border-slate-200">
                {['en', 'hi', 'te', 'ta', 'ml', 'kn'].map(l => (
                   <button 
                     key={l} 
                     onClick={() => { setLang(l); setIsLangMenuOpen(false); }} 
                     className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 uppercase ${lang === l ? 'font-bold text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                   >
                     {l}
                   </button>
                ))}
              </div>
            )}
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden z-10 flex flex-col md:flex-row h-[600px]">
        <div className="bg-blue-600 p-12 text-white md:w-1/2 flex flex-col justify-center items-center text-center relative">
          <div className="bg-white/10 absolute inset-0"></div>
          <div className="relative z-10">
            <div className="mx-auto bg-white w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <ShieldCheck className="text-blue-600" size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t.appTitle || "MediGuard AI"}</h1>
            <p className="text-blue-100 text-lg mb-8">Secure Pharmaceutical Verification System</p>
            <div className="flex gap-4 justify-center text-xs font-mono opacity-70">
                <span className="flex items-center gap-1"><Lock size={12}/> End-to-End Encrypted</span>
                <span className="flex items-center gap-1"><Server size={12}/> Cloud Sync</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:w-1/2 bg-slate-50 flex flex-col justify-center relative">
          
          {selectedRole ? (
             <div className="animate-fade-in w-full max-w-xs mx-auto">
                <button 
                    onClick={() => {setSelectedRole(null); setError(''); setPin('')}} 
                    className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="text-center mb-8">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg ${selectedRole.color}`}>
                        <User size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedRole.label}</h2>
                    <p className="text-slate-500 text-sm">Enter Security PIN</p>
                </div>
                
                <form onSubmit={handlePinSubmit} className="space-y-6">
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="password" 
                            value={pin}
                            onChange={(e) => {setPin(e.target.value); setError('')}}
                            className={`w-full pl-10 pr-4 py-3 text-center text-xl tracking-[0.5em] font-bold border-2 rounded-xl focus:outline-none transition-all ${error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                            placeholder="••••"
                            maxLength={4}
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs text-center font-bold flex items-center justify-center gap-1 animate-pulse"><AlertTriangle size={12}/> {error}</p>}
                    
                    <button 
                        type="submit" 
                        disabled={isLoading || pin.length < 4}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg"
                    >
                        {isLoading ? 'Verifying...' : 'Access System'} 
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>
                <p className="text-center text-xs text-slate-400 mt-6">Demo PIN: {selectedRole.pin}</p>
             </div>
          ) : (
             <div className="animate-fade-in h-full flex flex-col justify-center">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-slate-800">{t.loginTitle || "Secure Portal Access"}</h2>
                    <p className="text-slate-500 text-sm mt-1">Select your authorized role to proceed.</p>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1 custom-scrollbar">
                    {Object.values(ROLES).map(role => (
                        <button 
                        key={role.id} 
                        onClick={() => setSelectedRole(role)}
                        className="w-full flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                        >
                        <div className={`p-2 rounded-lg text-white shadow-sm ${role.color}`}>
                            <User size={18} />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-bold text-slate-700 group-hover:text-blue-700 text-sm">{role.label}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{role.access.includes('all') ? 'Full Access' : 'Restricted Access'}</p>
                        </div>
                        <ArrowRight className="text-slate-300 group-hover:text-blue-500" size={16} />
                        </button>
                    ))}
                </div>
                <div className="mt-auto pt-6 border-t border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400">Protected by MediGuard Security Protocol v2.4</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};