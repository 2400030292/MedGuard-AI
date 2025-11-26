import { Role, DrugStandard, Supplier, Translations } from './types';

// Fallback configuration for Firebase if not injected
export const FIREBASE_CONFIG = typeof (window as any).__firebase_config !== 'undefined' 
  ? JSON.parse((window as any).__firebase_config) 
  : null;

export const APP_ID = typeof (window as any).__app_id !== 'undefined' 
  ? (window as any).__app_id 
  : 'mediguard-demo';

export const ROLES: Record<string, Role> = {
  ADMIN: { id: 'admin', label: 'Administrator', color: 'bg-purple-600', access: ['all'], pin: '1111' },
  PHARMACIST: { id: 'pharmacy', label: 'Pharmacist', color: 'bg-emerald-600', access: ['dashboard', 'verify', 'library', 'chat', 'quarantine'], pin: '2222' },
  QUALITY: { id: 'quality', label: 'Quality Officer', color: 'bg-blue-600', access: ['dashboard', 'verify', 'suppliers', 'passport', 'quarantine'], pin: '3333' },
  NURSE: { id: 'nurse', label: 'Head Nurse', color: 'bg-pink-600', access: ['verify', 'library'], pin: '4444' }, 
  DOCTOR: { id: 'doctor', label: 'Doctor', color: 'bg-cyan-600', access: ['library', 'passport'], pin: '5555' } 
};

export const DRUG_STANDARDS: DrugStandard[] = [
  { id: 'RX-001', name: 'Paracetamol 500mg', manufacturer: 'MediCorp', type: 'Analgesic', pharmacy: 'Central Pharmacy', location: 'Aisle 4, Shelf B', stock: 'High' },
  { id: 'RX-002', name: 'Amoxicillin 250mg', manufacturer: 'BioLife', type: 'Antibiotic', pharmacy: 'ER Storage', location: 'Cabinet 2, Bin 5', stock: 'Medium' },
  { id: 'RX-003', name: 'Metformin 500mg', manufacturer: 'GlucoCare', type: 'Antidiabetic', pharmacy: 'Central Pharmacy', location: 'Aisle 2, Shelf A', stock: 'High' },
  { id: 'RX-004', name: 'Atorvastatin 10mg', manufacturer: 'HeartWell', type: 'Cardiovascular', pharmacy: 'Cardiac Ward Unit', location: 'Crash Cart A', stock: 'Low' },
  { id: 'RX-005', name: 'Azithromycin 500mg', manufacturer: 'Z-Pharma', type: 'Antibiotic', pharmacy: 'Central Pharmacy', location: 'Aisle 4, Shelf C', stock: 'Medium' },
  { id: 'RX-006', name: 'Ibuprofen 400mg', manufacturer: 'PainRelief Inc', type: 'NSAID', pharmacy: 'General Ward B', location: 'Nurse Station 1', stock: 'High' },
  { id: 'RX-007', name: 'Cetirizine 10mg', manufacturer: 'AllergyX', type: 'Antihistamine', pharmacy: 'OPD Pharmacy', location: 'Counter 3', stock: 'High' },
  { id: 'RX-008', name: 'Pantoprazole 40mg', manufacturer: 'GastroCure', type: 'Proton Pump Inhibitor', pharmacy: 'Central Pharmacy', location: 'Aisle 3, Shelf D', stock: 'Medium' },
  { id: 'RX-009', name: 'Amlodipine 5mg', manufacturer: 'CardioFix', type: 'Calcium Channel Blocker', pharmacy: 'ICU Supply', location: 'Cabinet 1', stock: 'Low' },
  { id: 'RX-010', name: 'Losartan 50mg', manufacturer: 'BP-Control', type: 'ARB', pharmacy: 'Central Pharmacy', location: 'Aisle 2, Shelf B', stock: 'Medium' },
  { id: 'RX-011', name: 'Omeprazole 20mg', manufacturer: 'GastroHealth', type: 'Proton Pump Inhibitor', pharmacy: 'OPD Pharmacy', location: 'Counter 1', stock: 'High' },
  { id: 'RX-012', name: 'Simvastatin 20mg', manufacturer: 'LipidLower', type: 'Statin', pharmacy: 'Central Pharmacy', location: 'Aisle 2, Shelf C', stock: 'Medium' },
  { id: 'RX-013', name: 'Lisinopril 10mg', manufacturer: 'AceInhib', type: 'ACE Inhibitor', pharmacy: 'Cardiac Ward Unit', location: 'Storage Room B', stock: 'Medium' },
  { id: 'RX-014', name: 'Levothyroxine 50mcg', manufacturer: 'ThyroCare', type: 'Hormone', pharmacy: 'Central Pharmacy', location: 'Aisle 5, Shelf A', stock: 'High' },
  { id: 'RX-015', name: 'Aspirin 75mg', manufacturer: 'Bayer (Generic)', type: 'Antiplatelet', pharmacy: 'ER Storage', location: 'Emergency Rack 1', stock: 'High' }
];

export const DRUG_PASSPORT_DATA = {
  id: "DMP-8829901",
  batch: "BATCH-882",
  product: "Amoxicillin 500mg",
  timeline: [
    { date: "2024-01-10", event: "Manufacturing", loc: "Mumbai, IN", status: "verified", hash: "0x8f...2a1" },
    { date: "2024-01-12", event: "Quality Check (Composition)", loc: "Lab A", status: "verified", hash: "0x1d...b92" },
    { date: "2024-01-15", event: "Shipping (Cold Chain)", loc: "Transit", status: "verified", temp: "4°C", hash: "0x4c...e31" },
    { date: "2024-01-18", event: "Hospital Received", loc: "City Hospital", status: "pending", hash: "---" }
  ]
};

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Apex Pharma', score: 92, status: 'Trusted', breakdown: { onTime: 19, compliance: 38, rejected: 25, docs: 10 }, history: [88, 89, 90, 91, 92, 92] },
  { id: 2, name: 'Global Med', score: 85, status: 'Safe', breakdown: { onTime: 18, compliance: 35, rejected: 24, docs: 8 }, history: [82, 83, 84, 85, 84, 85] },
  { id: 3, name: 'Budget Bio', score: 55, status: 'Risky', breakdown: { onTime: 10, compliance: 20, rejected: 15, docs: 10 }, history: [60, 58, 55, 52, 54, 55] }
];

export const TRANSLATIONS: Record<string, Translations> = {
  en: {
    appTitle: "MediGuard AI",
    tagline: "Hospital Verification OS",
    dashboard: "Dashboard",
    verifyBatch: "Verify Batch",
    supplierRatings: "Supplier Ratings",
    standardsLibrary: "Knowledge Base",
    quarantineTitle: "Quarantine Manager",
    passport: "Medicine Passport",
    loginTitle: "Secure Login Portal",
    welcome: "Welcome back,",
    chatAssistant: "AI Assistant",
    adminLogTitle: "Live Staff Activity Log (Admin View)",
    qcDashboard: "Quality Control Dashboard",
    realTimeOverview: "Real-time inventory compliance.",
    verifyNewBatch: "Verify New Batch",
    trustScore: "Trust Score",
    batchesPending: "Batches Pending",
    fakeDetected: "Fake Detected",
    quarantined: "Quarantined",
    activeSuppliers: "Active Suppliers",
    liveAlerts: "Live Alerts",
    riskHeatmap: "Risk Heatmap",
    complianceTrend: "Compliance Trends (6 Months)",
    aiStudio: "AI Verification Studio",
    analyzeCert: "Multi-modal verification: Docs, Photos, QR, or Manual Entry.",
    docAnalysis: "Docs (COA)",
    visualDetection: "Visual AI",
    qrScan: "Barcode/QR",
    manualEntry: "Manual Input",
    uploadText: "Upload PDF / Scan",
    uploadImageText: "Upload Packaging",
    dragDrop: "Drag & drop file here or click to upload",
    useCamera: "Use Device Camera",
    simulationMode: "Simulation Mode",
    cameraDenied: "Camera access was denied. Using simulated view.",
    captureScan: "Capture & Scan",
    analysisLog: "Rule-Based Analysis Log",
    regulatoryCheck: "Regulatory Compliance",
    supplierIntel: "Supplier Scorecard",
    supplierDesc: "Weighted scoring based on delivery, compliance, and document accuracy.",
    supplierTable: { name: "Supplier", score: "Trust Score", status: "Status", breakdown: "Breakdown", action: "Action" },
    libraryTitle: "Hospital Medicine Directory",
    libraryDesc: "Locate genuine medicines, their stock status, and precise shelf location.",
    searchPlaceholder: "Search for medicine (e.g., Metformin)...",
    categories: "Categories",
    status: { online: "Online & Secure", networkActive: "Auto-Alerts Active" },
    actions: { scanAnother: "Verify Another", approveLog: "Approve & Log", quarantine: "Move to Quarantine", cancel: "Cancel", viewScore: "Scorecard", viewPackaging: "Locate", viewPassport: "View Passport" },
    manualForm: { batch: "Batch Number", expiry: "Expiry Date", mfg: "Mfg Date", submit: "Validate Batch" },
    quarantine: {
        desc: "Manage rejected, expired, or recalled batches.",
        table: { batch: "Batch ID", name: "Product", reason: "Reason", status: "Status", action: "Actions" },
        actions: { destroy: "Destroy", return: "Return to Vendor", retest: "Re-Test" }
    }
  },
  hi: { appTitle: "मेडीगार्ड एआई", dashboard: "डैशबोर्ड", verifyBatch: "सत्यापन", supplierRatings: "आपूर्तिकर्ता", standardsLibrary: "ज्ञान कोष", quarantineTitle: "क्वारंटाइन", passport: "पासपोर्ट", loginTitle: "लॉगिन", adminLogTitle: "स्टाफ गतिविधि" },
  te: { appTitle: "మెడిగార్డ్ AI", dashboard: "డ్యాష్‌బోర్డ్", verifyBatch: "ధృవీకరణ", supplierRatings: "సప్లయర్లు", standardsLibrary: "నాలెడ్జ్ బేస్", quarantineTitle: "క్వారంటైన్", passport: "పాస్‌పోర్ట్", loginTitle: "లాగిన్", adminLogTitle: "కార్యాచరణ లాగ్" },
  ta: { appTitle: "மெடிகார்ட் AI", dashboard: "டாஷ்போர்டு", verifyBatch: "சரிபார்ப்பு", supplierRatings: "சப்ளையர்கள்", standardsLibrary: "அறிவுத் தளம்", quarantineTitle: "தனிமைப்படுத்தல்", passport: "பாஸ்போர்ட்", loginTitle: "உள்நுழை", adminLogTitle: "செயல்பாடு பதிவு" },
  ml: { appTitle: "മെഡിഗാർഡ് AI", dashboard: "ഡാഷ്‌ബോർഡ്", verifyBatch: "പരിശോധന", supplierRatings: "വിതരണക്കാർ", standardsLibrary: "വിജ്ഞാന ബേസ്", quarantineTitle: "ക്വാറന്റൈൻ", passport: "പാസ്‌പോർട്ട്", loginTitle: "ലോഗിൻ", adminLogTitle: "ലോഗ്" },
  kn: { appTitle: "ಮೆಡಿಗಾರ್ಡ್ AI", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", verifyBatch: "ಪರಿಶೀಲನೆ", supplierRatings: "ಪೂರೈಕೆದಾರರು", standardsLibrary: "ಜ್ಞಾನ ಕೋಶ", quarantineTitle: "ಕ್ವಾರೆಂಟೈನ್", passport: "ಪಾಸ್‌ಪೋರ್ಟ್", loginTitle: "ಲಾಗಿನ್", adminLogTitle: "ಚಟುವಟಿಕೆ ಲಾಗ್" }
};