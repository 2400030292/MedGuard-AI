import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Camera, QrCode, Keyboard, Upload, Video, 
  ScanLine, Eye, FileSearch, CheckCircle, AlertTriangle, Link as LinkIcon, FileCheck, Lock, XCircle 
} from 'lucide-react';
import { Role, AuditLog } from '../types';

interface VerificationStudioProps {
  t: any;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setQuarantineCount: React.Dispatch<React.SetStateAction<number>>;
  onShowPassport: () => void;
  onScanComplete: (newLog: AuditLog, passed: boolean, forceQuarantine?: boolean) => void;
  userRole: Role;
  authUser: any;
}

export const VerificationStudio: React.FC<VerificationStudioProps> = ({ 
  t, setNotifications, setQuarantineCount, onShowPassport, onScanComplete, userRole, authUser 
}) => {
    const [scanState, setScanState] = useState<'idle' | 'camera' | 'scanning' | 'processing' | 'result'>('idle');
    const [mode, setMode] = useState<'doc' | 'image' | 'qr' | 'manual'>('doc'); 
    const [resultData, setResultData] = useState<any>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSimulation, setIsSimulation] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [manualData, setManualData] = useState({ batch: '', expiry: '', mfg: '' });
    const [isDemoFail, setIsDemoFail] = useState(false);
    const [ocrText, setOcrText] = useState('');

    useEffect(() => { return () => { if (cameraStream) cameraStream.getTracks().forEach(track => track.stop()); }; }, [cameraStream]);

    const startCamera = async () => {
        try {
            setScanState('camera');
            setIsSimulation(false);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStream(stream);
            if(videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) { setIsSimulation(true); setScanState('camera'); }
    };

    const stopCamera = () => {
        if (cameraStream) { cameraStream.getTracks().forEach(track => track.stop()); setCameraStream(null); }
        setScanState('idle');
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
            setScanState('scanning');
            startScanSimulation();
        };
        reader.readAsDataURL(file);
    };

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            setPreviewUrl(canvas.toDataURL('image/jpeg'));
            stopCamera();
            setScanState('scanning');
            startScanSimulation();
        }
    };

    const startScanSimulation = () => {
        setTimeout(() => {
            setScanState('processing');
            setOcrText(generateMockOCR(mode));
            
            setTimeout(() => {
                finalizeResult();
            }, 2000);
        }, 2500);
    };

    const generateMockOCR = (mode: string) => {
         if (mode === 'qr') return "ID: 8829901\nBATCH: BATCH-882\nEXP: 2025-12-31";
         if (mode === 'doc') return "CERTIFICATE OF ANALYSIS\n----------------------\nProduct: Amoxicillin 500mg\nBatch No: BATCH-882\nMfg Date: 2024-01-10\nExp Date: 2025-12-31\n\nTESTS:\nAssay: 99.8% (Pass)\npH: 4.5 (Pass)";
         return "LABEL DETECTED\n--------------\nBrand: MediCorp\nContains: Paracetamol\nDosage: 500mg\nBatch: BATCH-882\nExp: 12/2025";
    };

    const finalizeResult = () => {
        setScanState('result');
        
        let passed = true;
        let logs: string[] = [], issues: string[] = [];
        
        if (mode === 'manual') {
            // Handled separately
        } else {
            if (isDemoFail) {
                passed = false;
                issues.push("AI Analysis: Label Hologram Missing.");
                issues.push("Database: Batch ID not found in global registry.");
                logs.push("Spectral Analysis: Failed (Red Flag)");
            } else {
                logs.push("Spectral Analysis: Verified");
                logs.push("AI Pattern Check: 99% Match");
                logs.push("OCR Text Extraction: Success");
            }
        }

        const resultStatus = passed ? 'Passed' : 'Failed';
        setResultData({ status: passed ? 'passed' : 'failed', confidence: passed ? 98.2 : 15.0, logs, issues });
    
        const newLog: AuditLog = {
            user: userRole.label, 
            role: userRole.id.charAt(0).toUpperCase() + userRole.id.slice(1),
            action: mode === 'manual' ? 'Manual Entry' : (mode === 'qr' ? 'QR Scan' : 'Doc Verify'),
            batch: 'SCANNED-BATCH', 
            result: resultStatus,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            device: window.innerWidth < 768 ? 'Mobile App' : 'Web Portal'
        };
        onScanComplete(newLog, passed); 
    };

    const handleManualScan = () => {
        setScanState('scanning');
        setTimeout(() => {
            setScanState('result');
            let passed = true;
            let logs: string[] = [], issues: string[] = [];
            const today = new Date().toISOString().split('T')[0];
            const batchRegex = /^[A-Za-z0-9]{2,}-[0-9]{3,}$/; 

            if (!manualData.batch) { passed = false; issues.push("Batch number is required."); } 
            else if (!batchRegex.test(manualData.batch)) { passed = false; issues.push("Invalid Batch Format (e.g. AB-123)."); }

            if (!manualData.expiry) { passed = false; issues.push("Expiry Date is missing."); } 
            else if (manualData.expiry < today) { passed = false; issues.push(`Batch Expired on ${manualData.expiry}.`); }

            if (manualData.mfg && manualData.mfg > today) { passed = false; issues.push("Invalid Mfg Date: Future date."); }

            logs = [`Batch Check: ${manualData.batch ? 'Done' : 'Missing'}`, `Expiry Check: ${passed ? 'Valid' : 'Failed'}`];
            
            const resultStatus = passed ? 'Passed' : 'Failed';
            setResultData({ status: passed ? 'passed' : 'failed', confidence: passed ? 100 : 0, logs, issues });
            
            const newLog: AuditLog = {
                user: userRole.label, 
                role: userRole.id,
                action: 'Manual Entry',
                batch: manualData.batch || 'MANUAL', 
                result: resultStatus,
                time: new Date().toLocaleTimeString(),
                device: 'Web Portal'
            };
            onScanComplete(newLog, passed);
        }, 1000);
    };

    const handleQuarantine = () => {
        onScanComplete({
            user: userRole.label,
            role: userRole.id,
            action: 'Manual Quarantine',
            batch: manualData.batch || 'SCANNED',
            result: 'Quarantined',
            time: new Date().toLocaleTimeString(),
            device: 'Manual'
        }, false, true);
        setScanState('idle');
        setPreviewUrl(null);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{t.aiStudio}</h2>
          <p className="text-slate-500">{t.analyzeCert}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200">
            {[
                { id: 'doc', icon: FileText, label: t.docAnalysis },
                { id: 'image', icon: Camera, label: t.visualDetection },
                { id: 'qr', icon: QrCode, label: t.qrScan },
                { id: 'manual', icon: Keyboard, label: t.manualEntry }
            ].map(tab => {
                const Icon = tab.icon;
                return (
                    <button 
                      key={tab.id}
                      onClick={() => { setMode(tab.id as any); setScanState('idle'); setResultData(null); setIsDemoFail(false); setPreviewUrl(null); }}
                      className={`py-4 text-xs md:text-sm font-semibold flex justify-center items-center gap-2 transition-colors ${mode === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Icon size={16} /> <span className="hidden md:inline">{tab.label}</span>
                    </button>
                );
            })}
          </div>

          <div className="p-8 min-h-[400px]">
            {scanState === 'idle' && (
              <div className="flex flex-col items-center">
                  {mode === 'manual' ? (
                      <div className="w-full max-w-md space-y-4">
                          <h3 className="text-lg font-bold text-slate-700 mb-4 text-center">Digital Batch Validator</h3>
                          <input type="text" className="w-full p-2 border border-slate-300 rounded outline-none" placeholder="Batch Number (e.g. AB-123)" value={manualData.batch} onChange={e => setManualData({...manualData, batch: e.target.value})} />
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs text-slate-500">Expiry Date</label>
                                <input type="date" className="w-full p-2 border border-slate-300 rounded outline-none" value={manualData.expiry} onChange={e => setManualData({...manualData, expiry: e.target.value})} />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-slate-500">Mfg Date</label>
                                <input type="date" className="w-full p-2 border border-slate-300 rounded outline-none" value={manualData.mfg} onChange={e => setManualData({...manualData, mfg: e.target.value})} />
                              </div>
                          </div>
                          <button onClick={handleManualScan} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 mt-4">{t.manualForm.submit}</button>
                      </div>
                  ) : (
                      <>
                        <div 
                            className="w-full border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e)=>e.preventDefault()}
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Upload size={32} /></div>
                            <h3 className="text-lg font-medium text-slate-900">{mode === 'doc' ? t.uploadText : (mode === 'qr' ? 'Upload QR Image' : t.uploadImageText)}</h3>
                            <p className="text-slate-500 mt-2 text-sm">{t.dragDrop}</p>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*,.pdf" />
                        </div>
                        
                        <div className="flex items-center gap-4 mt-6">
                            <button onClick={startCamera} className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm"><Video size={18} /> {t.useCamera}</button>
                            
                            <label className="flex items-center gap-2 cursor-pointer select-none border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50">
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${isDemoFail ? 'bg-red-500' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isDemoFail ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span className="text-xs font-medium text-slate-600">Fail Mode</span>
                                <input type="checkbox" className="hidden" checked={isDemoFail} onChange={() => setIsDemoFail(!isDemoFail)} />
                            </label>
                        </div>
                      </>
                  )}
              </div>
            )}

            {scanState === 'camera' && (
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden aspect-video mb-6 shadow-xl">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                        <div className="absolute inset-0 border-2 border-white/30 m-8 rounded border-dashed pointer-events-none"></div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={stopCamera} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">{t.actions.cancel}</button>
                        <button onClick={captureImage} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm"><Camera size={18} />{t.captureScan}</button>
                    </div>
                </div>
            )}

            {(scanState === 'scanning' || scanState === 'processing') && (
              <div className="flex flex-col items-center justify-center h-64 relative">
                  {previewUrl ? (
                      <div className="relative w-64 h-48 rounded-lg overflow-hidden shadow-lg border border-slate-200">
                          <img src={previewUrl} alt="Scan Preview" className="w-full h-full object-cover opacity-50" />
                          <div className="absolute inset-0 bg-blue-500/10"></div>
                          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_infinite]"></div>
                          
                          {scanState === 'processing' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                  <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2">
                                      <ScanLine size={16} className="text-blue-600 animate-pulse" />
                                      <span className="text-xs font-bold text-slate-700">Extracting Text...</span>
                                  </div>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className="relative w-24 h-24 mb-6">
                          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center"><Eye className="text-blue-600 animate-pulse" size={32} /></div>
                      </div>
                  )}
                <h3 className="text-lg font-semibold text-slate-800 mt-4">{scanState === 'scanning' ? 'Scanning Image...' : 'Analyzing Data...'}</h3>
              </div>
            )}

            {scanState === 'result' && resultData && (
              <div className="animate-fade-in w-full">
                 {mode !== 'manual' && previewUrl && (
                     <div className="mb-6 flex gap-4">
                         <div className="w-1/3 h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                             <img src={previewUrl} className="w-full h-full object-cover" alt="Scanned" />
                             <span className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] px-2 py-1 w-full">Original Image</span>
                         </div>
                         <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-3 font-mono text-xs text-slate-600 overflow-y-auto h-32 custom-scrollbar">
                             <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1 text-slate-800 font-bold">
                                 <FileSearch size={14}/> Extracted Text (OCR)
                             </div>
                             <pre className="whitespace-pre-wrap">{ocrText}</pre>
                         </div>
                     </div>
                 )}

                <div className={`p-4 rounded-lg flex items-center gap-4 mb-6 ${resultData.status === 'passed' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className={`p-2 rounded-full ${resultData.status === 'passed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{resultData.status === 'passed' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}</div>
                  <div className="flex-1">
                      <h3 className={`text-lg font-bold ${resultData.status === 'passed' ? 'text-green-800' : 'text-red-800'}`}>{resultData.status === 'passed' ? 'Verification Successful' : 'Potential Issue Detected'}</h3>
                      {resultData.status === 'passed' && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded ml-2 font-bold flex w-fit items-center gap-1 mt-1"><LinkIcon size={10}/> Blockchain Verified</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-slate-200 rounded-lg p-4"><h4 className="font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">{t.analysisLog}</h4><div className="space-y-2">{resultData.logs.map((log: string, i: number) => (<div key={i} className="text-xs font-mono text-slate-600 flex gap-2"><span className="text-blue-500">{'>'}</span> {log}</div>))}</div></div>
                  <div className="border border-slate-200 rounded-lg p-4"><h4 className="font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">{t.regulatoryCheck}</h4>{resultData.issues.length > 0 ? (<ul className="space-y-2">{resultData.issues.map((issue: string, i: number) => (<li key={i} className="text-sm text-red-600 flex items-start gap-2"><XCircle size={14} className="mt-0.5 shrink-0"/> {issue}</li>))}</ul>) : (<div className="text-center py-4 text-green-600"><CheckCircle size={40} className="mx-auto mb-2 opacity-50"/><p className="text-sm font-medium">All Checks Passed</p></div>)}</div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => { setScanState('idle'); setPreviewUrl(null); }} className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50">{t.actions.scanAnother}</button>
                    {resultData.status === 'passed' && <button onClick={onShowPassport} className="px-4 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 flex items-center gap-2"><FileCheck size={16} /> {t.actions.viewPassport}</button>}
                    {resultData.status === 'failed' && <button onClick={handleQuarantine} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"><Lock size={16} /> {t.actions.quarantine}</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};