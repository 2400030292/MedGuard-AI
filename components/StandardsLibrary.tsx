import React, { useState, useEffect } from 'react';
import { Search, MapPin, Map } from 'lucide-react';
import { DrugStandard } from '../types';

interface StandardsLibraryProps {
  t: any;
  DRUG_STANDARDS: DrugStandard[];
  onLogSearch: (term: string, count: number) => void;
}

export const StandardsLibrary: React.FC<StandardsLibraryProps> = ({ t, DRUG_STANDARDS, onLogSearch }) => {
    const [searchMode, setSearchMode] = useState<'local' | 'fda'>('local'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [fdaResults, setFdaResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounced Logging for Search Activity
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim().length >= 3) {
                const count = searchMode === 'local' 
                    ? DRUG_STANDARDS.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).length 
                    : fdaResults.length;
                
                onLogSearch(searchTerm, count);
            }
        }, 2000); // Wait 2 seconds after typing stops to log the search intent

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, searchMode, fdaResults, DRUG_STANDARDS, onLogSearch]);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (searchMode === 'local' || term.length < 3) return;
        setLoading(true);
        try {
            const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${term}"&limit=5`);
            const data = await response.json();
            if (data.results) {
                setFdaResults(data.results.map((item: any, idx: number) => ({
                    id: item.id || `FDA-${idx}`,
                    name: item.openfda?.brand_name?.[0] || 'Unknown',
                    dosage: item.active_ingredient?.[0] || 'N/A',
                    manufacturer: item.openfda?.manufacturer_name?.[0] || 'Unknown',
                    type: item.openfda?.product_type?.[0] || 'Drug',
                    chemicalSig: item.openfda?.substance_name?.[0] || 'N/A',
                    isFDA: true
                })));
            }
        } catch (err) { setFdaResults([]); } finally { setLoading(false); }
    };

    const localResults = DRUG_STANDARDS.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div><h2 className="text-2xl font-bold text-slate-800">{t.libraryTitle}</h2><p className="text-slate-500">{t.libraryDesc}</p></div>
                <div className="flex bg-slate-200 rounded-lg p-1 text-sm font-medium">
                    <button onClick={() => { setSearchMode('local'); setSearchTerm(''); }} className={`px-4 py-2 rounded-md transition-all ${searchMode === 'local' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Local DB</button>
                    {/* FDA Search option could be re-enabled here if needed */}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} placeholder={t.searchPlaceholder} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                        <div className="mt-4 space-y-2">{['Analgesics', 'Antibiotics', 'Cardiovascular'].map(cat => (<button key={cat} className="block w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">{cat}</button>))}</div>
                    </div>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading && <div className="col-span-2 py-12 text-center text-slate-500">Searching...</div>}
                    {!loading && (searchMode === 'local' ? localResults : fdaResults).map((drug: any) => (
                        <div key={drug.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div><h3 className="font-bold text-slate-800 text-lg">{drug.name}</h3><p className="text-sm text-slate-500 truncate max-w-[200px]">{drug.type}</p></div>
                                    <span className="text-xs px-2 py-1 rounded font-mono bg-slate-100 text-slate-600">ID: {drug.id}</span>
                                </div>
                                
                                {drug.pharmacy && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin size={14} className="text-blue-600" />
                                        <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Location</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-800">{drug.pharmacy}</p>
                                    <p className="text-xs text-slate-500">{drug.location}</p>
                                </div>
                                )}

                                <div className="space-y-1 text-xs text-slate-600">
                                    <div className="flex justify-between"><span>Stock:</span><span className={`font-bold ${drug.stock === 'High' ? 'text-green-600' : drug.stock === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>{drug.stock}</span></div>
                                    <div className="flex justify-between"><span>Mfg:</span><span>{drug.manufacturer}</span></div>
                                </div>
                            </div>
                            
                            <button className="w-full mt-4 py-2 border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium flex items-center justify-center gap-2"><Map size={14}/> {t.actions.viewPackaging}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};