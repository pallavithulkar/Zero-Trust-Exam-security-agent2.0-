import { useEffect, useState } from 'react';
import { createEvidenceCapsule, evidenceCapsuleFileName } from '../lib/evidenceCapsule';

export default function AdminView({ 
  vaultData = [], 
  ledgerData = [], 
  watchdogActive = false, 
  watchdogStatus = "IDLE", // "IDLE", "OK", "BREACH"
  watchdogTimeLeft = 10,
  onSimulateTamper,
  onResetDatabase,
  onAddLedgerRow,
  ledgerIntegrity = true,
  onTamperLedger,
  pipelineState = "idle",
  activeSession = null,
  committee1Signed = false,
  committee2Signed = false,
  approvalTime = "",
  phaseStatuses = {},
  logs = []
}) {
  const [activeTab, setActiveTab] = useState("watchdog");
  const [newScoreName, setNewScoreName] = useState("");
  const [newScoreVal, setNewScoreVal] = useState(85);
  
  // Ledger verification states
  const [verificationState, setVerificationState] = useState("UNVERIFIED"); // "UNVERIFIED", "VERIFIED", "COMPROMISED"
  
  // Time-lock states
  const [timeLockMinutes, setTimeLockMinutes] = useState(60);
  const [timeLockSeconds, setTimeLockSeconds] = useState(0);
  const [timeLockState, setTimeLockState] = useState("LOCKED"); // "LOCKED", "RELEASED"

  // View payload modal state
  const [showPayloadModal, setShowPayloadModal] = useState(false);

  // Leak Tracer states
  const [leakTraceStatus, setLeakTraceStatus] = useState("IDLE"); // "IDLE", "SCANNING", "FOUND"
  const [traceLog, setTraceLog] = useState("");

  // Evidence Capsule states
  const [evidenceCapsule, setEvidenceCapsule] = useState(null);
  const [copyState, setCopyState] = useState("IDLE"); // "IDLE", "COPIED", "FAILED"

  // Time-lock countdown logic
  useEffect(() => {
    let interval = null;
    if (pipelineState === "deployed" && timeLockState === "LOCKED") {
      interval = setInterval(() => {
        setTimeLockSeconds(prevSec => {
          if (prevSec === 0) {
            setTimeLockMinutes(prevMin => {
              if (prevMin === 0) {
                setTimeLockState("RELEASED");
                clearInterval(interval);
                return 0;
              }
              return prevMin - 1;
            });
            return 59;
          }
          return prevSec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pipelineState, timeLockState]);

  // Sync timers if pipelineState is reset
  useEffect(() => {
    if (pipelineState === "idle") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLockMinutes(60);
      setTimeLockSeconds(0);
      setTimeLockState("LOCKED");
      setLeakTraceStatus("IDLE");
      setTraceLog("");
      setVerificationState("UNVERIFIED");
    }
  }, [pipelineState]);

  const handleAccelerateTimer = () => {
    if (timeLockState === "RELEASED") return;
    setTimeLockMinutes(0);
    setTimeLockSeconds(3);
  };

  const handleTraceLeak = () => {
    setLeakTraceStatus("SCANNING");
    setTraceLog("Initializing visual footprint layout scanner...");
    
    setTimeout(() => {
      setTraceLog("Scanning spacing mutations & synonyms offsets across Center A/B/C submissions...");
    }, 600);

    setTimeout(() => {
      setLeakTraceStatus("FOUND");
      setTraceLog("MATCH FOUND: Center B layout spacing footprint match confirmed (100% confidence).");
    }, 1500);
  };

  const handleVerifyLedger = () => {
    if (ledgerIntegrity) {
      setVerificationState("VERIFIED");
    } else {
      setVerificationState("COMPROMISED");
    }
  };

  const handleAddScore = (e) => {
    e.preventDefault();
    if (!newScoreName) return;
    onAddLedgerRow(newScoreName, Number(newScoreVal));
    setNewScoreName("");
  };

  const latestVaultRow = vaultData.length > 0 ? vaultData[vaultData.length - 1] : null;

  const handleGenerateEvidenceCapsule = async () => {
    const capsule = await createEvidenceCapsule({
      activeSession,
      vaultData,
      ledgerData,
      watchdogStatus,
      ledgerIntegrity,
      committee1Signed,
      committee2Signed,
      approvalTime,
      pipelineState,
      phaseStatuses,
      logs
    });
    setEvidenceCapsule(capsule);
    setCopyState("IDLE");
  };

  const handleCopyEvidenceCapsule = async () => {
    if (!evidenceCapsule) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(evidenceCapsule, null, 2));
      setCopyState("COPIED");
    } catch {
      setCopyState("FAILED");
    }
  };

  const handleDownloadEvidenceCapsule = () => {
    if (!evidenceCapsule) return;

    const blob = new Blob([JSON.stringify(evidenceCapsule, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = evidenceCapsuleFileName(evidenceCapsule);
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 relative">
      
      {/* PAYLOAD INSPECTION OVERLAY MODAL */}
      {showPayloadModal && latestVaultRow && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm select-text">
          <div className="bg-[#0B0F19] border border-teal-cyan/40 rounded-xl p-5 max-w-lg w-full cyber-border-glow shadow-[0_0_30px_rgba(229,169,59,0.3)] space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-cyber text-white tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-cyan animate-pulse"></span>
                EXAM VAULT PAYLOAD: ENCRYPTED
              </h3>
              <button 
                onClick={() => setShowPayloadModal(false)}
                className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded cursor-pointer"
              >
                CLOSE [X]
              </button>
            </div>

            <div className="space-y-3 font-mono text-[9px] leading-relaxed">
              <div className="bg-[#050812] border border-slate-950 p-3 rounded text-slate-300 space-y-1.5">
                <div>
                  <span className="text-slate-550 block">VAULT ENTRY ID (UUID):</span>
                  <span className="text-white select-all">{latestVaultRow.id}</span>
                </div>
                <div>
                  <span className="text-slate-550 block">ENCRYPTION PROTOCOL:</span>
                  <span className="text-green-success font-bold">AES-256-GCM (AUTHENTICATED)</span>
                </div>
                <div>
                  <span className="text-slate-550 block">ENCRYPTION TIMESTAMP:</span>
                  <span className="text-white">{latestVaultRow.created_at}</span>
                </div>
                <div>
                  <span className="text-slate-550 block">IV KEY (INIT VECTOR):</span>
                  <span className="text-teal-cyan select-all">{latestVaultRow.iv}</span>
                </div>
                <div>
                  <span className="text-slate-550 block">AUTH TAG (GCM VALIDATOR):</span>
                  <span className="text-teal-cyan select-all">{latestVaultRow.auth_tag}</span>
                </div>
                <div>
                  <span className="text-slate-550 block">INTEGRITY SHA-256 HASH:</span>
                  <span className="text-gold-accent select-all">{latestVaultRow.hash}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">CIPHERTEXT PAYLOAD BLOB:</span>
                <div className="bg-[#050812] border border-slate-950 p-3 rounded max-h-[140px] overflow-y-auto text-gold-accent select-all break-all leading-normal text-[8.5px]">
                  {latestVaultRow.blob}
                </div>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-slate-900 select-none">
              <span className="text-[9px] text-slate-500 block">ENFORCED ROLE POLICY: READ-ONLY AUDIT LOCK</span>
            </div>
          </div>
        </div>
      )}

      {/* SECURE DIAGNOSTICS TABS BAR */}
      <div className="flex border-b border-slate-800 pb-2 select-none">
        <button
          onClick={() => setActiveTab("watchdog")}
          className={`mr-4 px-3 py-1.5 text-xs font-cyber tracking-wider rounded transition-all cursor-pointer ${
            activeTab === "watchdog"
              ? "bg-teal-cyan/15 text-teal-cyan font-bold border border-teal-cyan/35"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          🔒 Phase 4-5: Secure Vault & Watchdog
        </button>
        <button
          onClick={() => setActiveTab("distribution")}
          className={`mr-4 px-3 py-1.5 text-xs font-cyber tracking-wider rounded transition-all cursor-pointer ${
            activeTab === "distribution"
              ? "bg-teal-cyan/15 text-teal-cyan font-bold border border-teal-cyan/35"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          📡 Phase 6-7: Network Map & Time-Lock
        </button>
        <button
          onClick={() => setActiveTab("mutation")}
          className={`mr-4 px-3 py-1.5 text-xs font-cyber tracking-wider rounded transition-all cursor-pointer ${
            activeTab === "mutation"
              ? "bg-teal-cyan/15 text-teal-cyan font-bold border border-teal-cyan/35"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          🧬 Phase 8: Mutation Forensics
        </button>
        <button
          onClick={() => setActiveTab("ledger")}
          className={`mr-4 px-3 py-1.5 text-xs font-cyber tracking-wider rounded transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "bg-teal-cyan/15 text-teal-cyan font-bold border border-teal-cyan/35"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          🔗 Phase 9: Immutable Ledger
        </button>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`px-3 py-1.5 text-xs font-cyber tracking-wider rounded transition-all cursor-pointer ${
            activeTab === "evidence"
              ? "bg-gold-accent/15 text-gold-accent font-bold border border-gold-accent/35"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          Evidence Capsule
        </button>
      </div>

      {/* ====================================================
          TAB 1: WATCHDOG & ENCRYPTION PIPELINE
          ==================================================== */}
      {activeTab === "watchdog" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Watchdog status control panel */}
          <div className="xl:col-span-4 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 font-mono text-[11px] leading-relaxed">
            <h4 className="text-xs font-cyber text-white tracking-widest border-b border-slate-900 pb-2 mb-3 select-none flex justify-between items-center">
              <span>INTEGRITY WATCHDOG CENTER</span>
              <span className={`w-2 h-2 rounded-full ${watchdogActive ? 'bg-green-success animate-pulse' : 'bg-slate-750'}`}></span>
            </h4>

            <div className="space-y-2.5">
              <div className="flex justify-between border-b border-slate-950 pb-1.5">
                <span className="text-slate-500">WATCHDOG STATUS:</span>
                <span className={watchdogActive ? 'text-green-success font-semibold' : 'text-slate-500'}>
                  {watchdogActive ? 'MONITOR RUNNING' : 'STANDBY'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-950 pb-1.5">
                <span className="text-slate-500">LAST SCAN TIMESTAMP:</span>
                <span className="text-teal-cyan">
                  {watchdogActive ? `${watchdogTimeLeft}s countdown` : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-950 pb-1.5">
                <span className="text-slate-500">HASH VALIDATION:</span>
                <span className={`font-bold ${
                  watchdogStatus === 'OK' ? 'text-green-success' :
                  watchdogStatus === 'BREACH' ? 'text-red-alert animate-pulse' : 'text-slate-500'
                }`}>
                  {watchdogStatus === 'OK' ? '✓ VALID' : watchdogStatus === 'BREACH' ? '❌ BREACH DETECTED' : 'UNARMED'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-950 pb-1.5">
                <span className="text-slate-500">INTEGRITY SCORE:</span>
                <span className={`font-bold ${
                  watchdogStatus === 'OK' ? 'text-green-success' :
                  watchdogStatus === 'BREACH' ? 'text-red-alert animate-pulse' : 'text-slate-500'
                }`}>
                  {watchdogStatus === 'OK' ? '100%' : watchdogStatus === 'BREACH' ? '0% (CRITICAL)' : 'N/A'}
                </span>
              </div>

              {/* Action triggers */}
              <div className="pt-2 flex flex-col gap-2 select-none">
                <button
                  onClick={onSimulateTamper}
                  disabled={vaultData.length === 0 || watchdogStatus === 'BREACH'}
                  className={`w-full py-2.5 px-3 border text-[11px] font-cyber tracking-widest text-center rounded transition-all duration-300 cursor-pointer ${
                    vaultData.length === 0 || watchdogStatus === 'BREACH'
                      ? 'border-slate-900 text-slate-650 cursor-not-allowed bg-slate-950/20'
                      : 'border-red-alert/50 text-red-alert hover:bg-red-alert/10 hover:shadow-[0_0_15px_rgba(212,60,60,0.15)] animate-pulse'
                  }`}
                >
                  ⚠️ SIMULATE TAMPER ATTACK (VAULT BREACH)
                </button>
                <button
                  onClick={onResetDatabase}
                  className="w-full py-1.5 px-3 border border-slate-700/60 text-[10px] text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  🔄 RESET SYSTEM PIPELINE
                </button>
              </div>
            </div>
          </div>

          {/* AES Encrypted Vault panel with vector lock animation */}
          <div className="xl:col-span-8 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3 select-none">
                <h4 className="text-xs font-cyber text-white tracking-widest flex items-center gap-1.5">
                  <span>SECURE EXAM VAULT Panel</span>
                </h4>
                
                {/* Glowing padlock badge */}
                <div className="flex items-center space-x-1">
                  <span className={`text-[9px] font-mono border px-2 py-0.5 rounded ${
                    latestVaultRow 
                      ? (watchdogStatus === 'BREACH' ? 'text-red-alert border-red-alert/20 bg-red-alert/5 animate-pulse' : 'text-green-success border-green-success/20 bg-green-success/5')
                      : 'text-slate-650 border-slate-900'
                  }`}>
                    {latestVaultRow 
                      ? (watchdogStatus === 'BREACH' ? 'VAULT BREACHED' : 'VAULT STATUS: LOCKED')
                      : 'STATUS: UNLOCKED'
                    }
                  </span>
                </div>
              </div>

              {/* Vector padlock lock animation */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* Visual lock display */}
                <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-[#050812] border border-slate-950 rounded select-none">
                  {latestVaultRow ? (
                    <div className="relative flex items-center justify-center h-16 w-16">
                      {/* Locked Padlock */}
                      <svg className={`h-12 w-12 ${watchdogStatus === 'BREACH' ? 'text-red-alert animate-bounce' : 'text-green-success filter drop-shadow-[0_0_10px_rgba(34,180,102,0.4)] animate-pulse'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {/* Rotating aura */}
                      <div className={`absolute inset-0 rounded-full border border-dashed animate-spin ${
                        watchdogStatus === 'BREACH' ? 'border-red-alert/35' : 'border-green-success/35'
                      }`} />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center h-16 w-16">
                      {/* Unlocked Padlock */}
                      <svg className="h-12 w-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <span className={`text-[8.5px] font-cyber uppercase tracking-widest mt-2 block ${
                    latestVaultRow 
                      ? (watchdogStatus === 'BREACH' ? 'text-red-alert font-bold' : 'text-green-success')
                      : 'text-slate-500'
                  }`}>
                    {latestVaultRow 
                      ? (watchdogStatus === 'BREACH' ? 'ALARM ACTIVE' : 'AES KEY VERIFIED')
                      : 'KEY DISARMED'
                    }
                  </span>
                </div>

                {/* Encryption visual flow details */}
                <div className="md:col-span-9 space-y-2 font-mono text-[9px]">
                  
                  <div className="grid grid-cols-3 gap-2 text-center bg-[#070B14] p-2 rounded border border-slate-950">
                    <div className="p-1 bg-[#0A0E1A] border border-slate-900 rounded">
                      <span className="text-slate-500 block text-[7.5px] uppercase">Original JSON</span>
                      <span className="text-teal-cyan font-bold">{latestVaultRow ? "✓ Compiled" : "Awaiting"}</span>
                    </div>
                    <div className="p-1 bg-[#0A0E1A] border border-slate-900 rounded flex flex-col justify-center">
                      <span className="text-slate-500 block text-[7.5px] uppercase">AES-256 Engine</span>
                      <span className="text-white font-bold">{latestVaultRow ? "✓ Encrypted" : "Standby"}</span>
                    </div>
                    <div className="p-1 bg-[#0A0E1A] border border-slate-900 rounded">
                      <span className="text-slate-500 block text-[7.5px] uppercase">Integrity Hash</span>
                      <span className="text-gold-accent font-bold">{latestVaultRow ? "✓ SHA-256" : "Awaiting"}</span>
                    </div>
                  </div>

                  {latestVaultRow ? (
                    <div className="space-y-1.5 p-2 bg-[#050812] border border-slate-950 rounded select-text">
                      <div className="flex justify-between border-b border-slate-900/50 pb-1">
                        <span className="text-slate-500">VAULT ID:</span>
                        <span className="text-white">{latestVaultRow.id.substring(0,20)}...</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900/50 pb-1">
                        <span className="text-slate-500">SHA-256:</span>
                        <span className="text-gold-accent">{latestVaultRow.hash.substring(0,25)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">CIPHERTEXT SIZE:</span>
                        <button
                          onClick={() => setShowPayloadModal(true)}
                          className="bg-teal-cyan/15 text-teal-cyan px-2 py-0.2 rounded border border-teal-cyan/30 text-[8.5px] hover:bg-teal-cyan/25 transition-colors cursor-pointer"
                        >
                          👁️ VIEW ENCRYPTED PAYLOAD
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 italic select-none">
                      Vault is empty. Run compilation and approval loops first.
                    </div>
                  )}

                </div>

              </div>
            </div>

            {watchdogStatus === "BREACH" && (
              <div className="mt-3 bg-red-alert/10 border border-red-alert/30 rounded p-2.5 text-center text-red-alert font-cyber font-bold text-[10px] tracking-widest uppercase select-none animate-bounce">
                🚨 UNAUTHORIZED MODIFICATION FOUND - PIPELINE LOCKDOWN ACTIVATED!
              </div>
            )}
          </div>
          
        </div>
      )}

      {/* ====================================================
          TAB 2: BLIND DISTRIBUTION MAP & TIME-LOCK
          ==================================================== */}
      {activeTab === "distribution" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Nodal Distribution Map */}
          <div className="xl:col-span-8 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 select-none">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-2">
              <h4 className="text-xs font-cyber text-white tracking-widest">
                DISTRIBUTION MAP (SYNC CHANNELS)
              </h4>
              
              {pipelineState === "deployed" && (
                <span className="text-[9px] bg-green-success/15 border border-green-success/30 text-green-success px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                  ✓ 5/5 NODAL CENTERS SYNCED
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Map SVG */}
              <div className="md:col-span-7 border border-slate-950 rounded bg-[#04060c] flex items-center justify-center p-1">
                <svg className="w-full h-[140px]" viewBox="0 0 400 160">
                  {pipelineState === "deployed" ? (
                    <>
                      <line x1="200" y1="80" x2="80" y2="35" stroke="#E5A93B" strokeWidth="1.5" className="animate-dash" />
                      <line x1="200" y1="80" x2="80" y2="125" stroke="#E5A93B" strokeWidth="1.5" className="animate-dash" />
                      <line x1="200" y1="80" x2="320" y2="125" stroke="#E5A93B" strokeWidth="1.5" className="animate-dash" />
                      <line x1="200" y1="80" x2="320" y2="35" stroke="#E5A93B" strokeWidth="1.5" className="animate-dash" />
                      <line x1="200" y1="80" x2="200" y2="25" stroke="#E5A93B" strokeWidth="1.5" className="animate-dash" />
                    </>
                  ) : (
                    <>
                      <line x1="200" y1="80" x2="80" y2="35" stroke="#1E293B" strokeWidth="1" />
                      <line x1="200" y1="80" x2="80" y2="125" stroke="#1E293B" strokeWidth="1" />
                      <line x1="200" y1="80" x2="320" y2="125" stroke="#1E293B" strokeWidth="1" />
                      <line x1="200" y1="80" x2="320" y2="35" stroke="#1E293B" strokeWidth="1" />
                      <line x1="200" y1="80" x2="200" y2="25" stroke="#1E293B" strokeWidth="1" />
                    </>
                  )}

                  <circle cx="200" cy="80" r="13" fill="#0E1528" stroke={pipelineState === 'deployed' ? '#22B466' : '#1E293B'} strokeWidth="2" className={pipelineState === 'deployed' ? 'animate-node-pulse' : ''} />
                  <text x="200" y="83" fill="#ffffff" fontSize="8" textAnchor="middle" fontFamily="Rajdhani" fontWeight="bold">VAULT</text>

                  <circle cx="80" cy="35" r="8" fill="#0E1528" stroke={pipelineState === 'deployed' ? '#E5A93B' : '#1E293B'} strokeWidth="1.5" />
                  <circle cx="80" cy="125" r="8" fill="#0E1528" stroke={pipelineState === 'deployed' ? '#E5A93B' : '#1E293B'} strokeWidth="1.5" />
                  <circle cx="320" cy="125" r="8" fill="#0E1528" stroke={pipelineState === 'deployed' ? '#E5A93B' : '#1E293B'} strokeWidth="1.5" />
                  <circle cx="320" cy="35" r="8" fill="#0E1528" stroke={pipelineState === 'deployed' ? '#E5A93B' : '#1E293B'} strokeWidth="1.5" />
                  <circle cx="200" cy="25" r="8" fill="#0E1528" stroke={pipelineState === 'deployed' ? '#E5A93B' : '#1E293B'} strokeWidth="1.5" />

                  {pipelineState === "deployed" && (
                    <>
                      <circle r="2.5" fill="#22B466"><animate attributeName="cx" from="200" to="80" dur="2.2s" repeatCount="indefinite" /><animate attributeName="cy" from="80" to="35" dur="2.2s" repeatCount="indefinite" /></circle>
                      <circle r="2.5" fill="#22B466"><animate attributeName="cx" from="200" to="80" dur="2.6s" repeatCount="indefinite" /><animate attributeName="cy" from="80" to="125" dur="2.6s" repeatCount="indefinite" /></circle>
                      <circle r="2.5" fill="#22B466"><animate attributeName="cx" from="200" to="320" dur="2.4s" repeatCount="indefinite" /><animate attributeName="cy" from="80" to="125" dur="2.4s" repeatCount="indefinite" /></circle>
                      <circle r="2.5" fill="#22B466"><animate attributeName="cx" from="200" to="320" dur="2s" repeatCount="indefinite" /><animate attributeName="cy" from="80" to="35" dur="2s" repeatCount="indefinite" /></circle>
                      <circle r="2.5" fill="#22B466"><animate attributeName="cx" from="200" to="200" dur="1.8s" repeatCount="indefinite" /><animate attributeName="cy" from="80" to="25" dur="1.8s" repeatCount="indefinite" /></circle>
                    </>
                  )}
                </svg>
              </div>

              {/* Transfer logs visual panel */}
              <div className="md:col-span-5 bg-[#050812] border border-slate-950 p-2.5 rounded h-[140px] overflow-y-auto text-[8.5px] font-mono leading-relaxed text-slate-400 select-text">
                <span className="text-slate-500 font-bold block mb-1 uppercase select-none text-[8px]">Nodal Link Signals</span>
                {pipelineState === "deployed" ? (
                  <div className="space-y-1">
                    <div className="text-green-success flex justify-between"><span>Node A (Delhi):</span> <span>✓ Synced</span></div>
                    <div className="text-green-success flex justify-between"><span>Node B (Mumbai):</span> <span>✓ Synced</span></div>
                    <div className="text-green-success flex justify-between"><span>Node C (Chennai):</span> <span>✓ Synced</span></div>
                    <div className="text-green-success flex justify-between"><span>Node D (Kolkata):</span> <span>✓ Synced</span></div>
                    <div className="text-green-success flex justify-between"><span>Node E (Guwahati):</span> <span>✓ Synced</span></div>
                    <div className="text-[7.5px] text-slate-550 border-t border-slate-900 pt-1 mt-1 font-mono uppercase select-none">
                      Cipher packets delivered. Keys locked.
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-650 italic text-center py-8 select-none">
                    Distribution channel stands by.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Time-Lock panel */}
          <div className="xl:col-span-4 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 font-mono text-[11px] flex flex-col justify-between leading-normal">
            <div>
              <h4 className="text-xs font-cyber text-white tracking-widest border-b border-slate-900 pb-2 mb-2.5">
                TIME-LOCKED DECRYPTION
              </h4>

              <div className="bg-[#050812] border border-slate-950 rounded p-3 text-center space-y-1.5 relative select-none">
                
                {/* Countdown Key overlay when complete */}
                {timeLockState === "RELEASED" && (
                  <div className="absolute inset-0 bg-green-success/10 border border-green-success/30 rounded flex flex-col items-center justify-center space-y-1 animate-pulse backdrop-blur-[1.5px]">
                    <span className="text-base">🔑</span>
                    <span className="text-[9px] text-green-success font-bold font-cyber tracking-widest">DECRYPTION KEY RELEASED</span>
                    <span className="text-[10px] text-white font-bold font-cyber animate-pulse">READY FOR EXAM</span>
                  </div>
                )}

                <span className="text-[8.5px] text-slate-500 block uppercase font-mono">RELEASE WINDOW TICKER</span>
                <div className="text-xl font-bold font-mono tracking-widest text-gold-accent">
                  {`T - 00:${timeLockMinutes < 10 ? '0' + timeLockMinutes : timeLockMinutes}:${timeLockSeconds < 10 ? '0' + timeLockSeconds : timeLockSeconds}`}
                </div>
                <span className="text-[9px] text-slate-400 font-cyber tracking-wider block">STATE: LOCKED IN VAULT</span>
              </div>

              <p className="text-[9px] text-slate-400 leading-normal mt-2 select-text">
                Decryption keys are released automatically at T-15m (CBT Mode) or T-60m (Physical Mode) on secure machines.
              </p>
            </div>

            {pipelineState === "deployed" && timeLockState === "LOCKED" && (
              <button
                onClick={handleAccelerateTimer}
                className="mt-3.5 w-full py-2 border border-gold-accent/40 text-gold-accent hover:text-white rounded hover:bg-gold-accent/10 transition-colors font-cyber text-[10px] uppercase tracking-wider select-none cursor-pointer"
              >
                ⏩ Accelerate Timer (Demo Test)
              </button>
            )}

            {timeLockState === "RELEASED" && (
              <div className="mt-3.5 bg-[#050812] border border-slate-950 rounded p-1.5 text-[8.5px] text-center text-green-success select-all">
                Unlocked Key: <span className="font-bold text-white pl-1">0x8B901C74FA22D681AA90DF0E</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ====================================================
          TAB 3: MUTATION SIGNATURE FORENSICS
          ==================================================== */}
      {activeTab === "mutation" && (
        <div className="bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 font-mono text-[11px] leading-relaxed">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-2 mb-3 gap-2 select-none">
            <h4 className="text-xs font-cyber text-white tracking-widest">
              MUTATION SIGNATURE LEAK TRACER
            </h4>
            
            {pipelineState === "deployed" && (
              <button
                onClick={handleTraceLeak}
                disabled={leakTraceStatus === "SCANNING"}
                className="py-1 px-3 bg-teal-cyan/15 hover:bg-teal-cyan/25 border border-teal-cyan/45 text-teal-cyan hover:text-white rounded font-cyber text-[10px] tracking-widest uppercase cursor-pointer"
              >
                {leakTraceStatus === "SCANNING" ? "🔍 SCANNERS ONLINE..." : "🔍 TRACE LEAKED SHEET"}
              </button>
            )}
          </div>

          {/* Interactive Tracer Readout banner */}
          {leakTraceStatus === "SCANNING" && (
            <div className="bg-teal-cyan/10 border border-teal-cyan/25 rounded p-2.5 text-center text-teal-cyan text-[10px] select-none mb-3 animate-pulse">
              ⏳ {traceLog}
            </div>
          )}

          {leakTraceStatus === "FOUND" && (
            <div className="bg-red-alert/15 border border-red-alert/30 rounded p-2.5 text-center text-red-alert font-cyber font-bold text-[10px] tracking-widest uppercase select-none mb-3 animate-bounce">
              🚨 LEAK SOURCE IDENTIFIED: NODE B (MUMBAI NODAL CENTER)
            </div>
          )}

          {leakTraceStatus === "IDLE" && (
            <p className="text-[10px] text-slate-500 mb-3 select-none">
              Deploy paper variants to generate mutation footprint trackers. Tracing compares scanned sheet layouts against center patterns.
            </p>
          )}

          {/* Center visual layout differences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Center A (Delhi) */}
            <div className="bg-[#050812] border border-slate-900 rounded p-3 select-text transition-all duration-300">
              <span className="text-[9px] text-slate-500 font-bold block mb-1">CENTER A (NODE A - DELHI)</span>
              <div className="text-[10px] text-slate-300 space-y-1.5 p-2 bg-[#0A0E1A] rounded border border-slate-950 font-sans">
                <p>1.  What is the dimensional formula of universal gravitational constant G?</p>
              </div>
              <div className="mt-2 text-[8px] font-mono text-slate-500 flex justify-between">
                <span>MUTATION: Double Spaced</span>
                <span className="text-teal-cyan">Trace ID: DEL-981A</span>
              </div>
            </div>

            {/* Center B (Mumbai) */}
            <div className={`bg-[#050812] rounded p-3 select-text transition-all duration-500 border ${
              leakTraceStatus === "FOUND" ? 'border-red-alert/70 shadow-[0_0_15px_rgba(212,60,60,0.15)] bg-red-alert/5 animate-pulse' : 'border-slate-900'
            }`}>
              <span className={`text-[9px] font-bold block mb-1 ${leakTraceStatus === "FOUND" ? 'text-red-alert' : 'text-slate-500'}`}>
                CENTER B (NODE B - MUMBAI)
              </span>
              <div className="text-[10px] text-slate-300 space-y-1.5 p-2 bg-[#0A0E1A] rounded border border-slate-950 font-sans">
                <p>1. What is the dimensional formula of universal gravitational constant <span className="italic text-teal-cyan font-semibold">g</span>?</p>
              </div>
              <div className="mt-2 text-[8px] font-mono text-slate-500 flex justify-between">
                <span>MUTATION: Italic variable g</span>
                <span className={leakTraceStatus === 'FOUND' ? 'text-red-alert font-bold animate-pulse' : 'text-teal-cyan'}>
                  Trace ID: BOM-105F
                </span>
              </div>
            </div>

            {/* Center C (Kolkata) */}
            <div className="bg-[#050812] border border-slate-900 rounded p-3 select-text transition-all duration-300">
              <span className="text-[9px] text-slate-500 font-bold block mb-1">CENTER C (NODE C - KOLKATA)</span>
              <div className="text-[10px] text-slate-300 space-y-1.5 p-2 bg-[#0A0E1A] rounded border border-slate-950 font-sans">
                <p>1. <span className="text-teal-cyan font-semibold">Identify</span> the dimensional formula of universal gravitational constant G?</p>
              </div>
              <div className="mt-2 text-[8px] font-mono text-slate-500 flex justify-between">
                <span>MUTATION: Synonym Mutation</span>
                <span className="text-teal-cyan">Trace ID: CCU-402X</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ====================================================
          TAB 4: IMMUTABLE LEDGER JOURNAL
          ==================================================== */}
      {activeTab === "ledger" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Ledger validator panel */}
          <div className="xl:col-span-4 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 font-mono text-[11px] leading-relaxed flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-cyber text-white tracking-widest border-b border-slate-900 pb-2 mb-3 select-none">
                LEDGER AUDITOR CORE
              </h4>

              <div className="space-y-3 font-mono text-[11px]">
                
                {/* Ledger actions */}
                <div className="pt-1 select-none flex flex-col gap-2">
                  <button
                    onClick={handleVerifyLedger}
                    className="w-full py-2.5 bg-teal-cyan/15 border border-teal-cyan/35 text-teal-cyan hover:bg-teal-cyan/25 rounded text-center font-cyber tracking-widest text-[10px] uppercase transition-colors cursor-pointer"
                  >
                    🛡️ VERIFY LEDGER JOURNAL
                  </button>
                  
                  <button
                    onClick={onTamperLedger}
                    disabled={ledgerData.length === 0}
                    className={`w-full py-1.5 border text-[10px] text-center font-cyber tracking-wider rounded transition-all cursor-pointer ${
                      ledgerData.length === 0
                        ? 'border-slate-850 text-slate-650 cursor-not-allowed bg-slate-950/20'
                        : 'border-red-alert/45 text-red-alert hover:bg-red-alert/10'
                    }`}
                  >
                    ⚠️ SIMULATE MARKS TAMPERING
                  </button>
                </div>

                {/* Audit verification display shields */}
                <div className="pt-2 select-none border-t border-slate-900 mt-2.5">
                  <span className="text-slate-500 block text-[9px] uppercase">CHAIN VERIFIER HEARTBEAT:</span>
                  
                  {verificationState === "VERIFIED" && (
                    <div className="bg-[#22B466]/10 border border-[#22B466]/30 rounded p-2.5 text-center text-green-success font-cyber font-bold tracking-widest text-[10px] uppercase mt-1 animate-pulse shadow-[0_0_15px_rgba(34,180,102,0.15)]">
                      🛡️ LEDGER VERIFIED (CHAIN OK)
                    </div>
                  )}

                  {verificationState === "COMPROMISED" && (
                    <div className="bg-[#D43C3C]/10 border border-[#D43C3C]/30 rounded p-2.5 text-center text-red-alert font-cyber font-bold tracking-widest text-[10px] uppercase mt-1 animate-bounce shadow-[0_0_15px_rgba(212,60,60,0.15)]">
                      🚨 LEDGER CHAIN BROKEN (CORRUPTED)
                    </div>
                  )}

                  {verificationState === "UNVERIFIED" && (
                    <div className="bg-slate-900/50 border border-slate-850 rounded p-2.5 text-center text-slate-500 font-cyber tracking-wider uppercase mt-1">
                      AWAITING INTEGRITY RUN
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mining score block form */}
            <form onSubmit={handleAddScore} className="mt-3 pt-3 border-t border-slate-900 select-none space-y-2">
              <span className="text-[9.5px] font-cyber text-slate-400 font-bold tracking-wider block">MINE score BLOCK</span>
              <input
                type="text"
                placeholder="Student ID (e.g. STU-9104)"
                value={newScoreName}
                onChange={(e) => setNewScoreName(e.target.value)}
                className="w-full bg-[#0A0E1A] border border-slate-800 rounded px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-cyan"
              />
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                  <span>Score:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newScoreVal}
                    onChange={(e) => setNewScoreVal(e.target.value)}
                    className="bg-[#0A0E1A] border border-slate-800 rounded w-12 py-0.5 text-center text-white text-[10px] focus:outline-none"
                  />
                  <span>%</span>
                </div>
                <button
                  type="submit"
                  className="bg-teal-cyan/15 hover:bg-teal-cyan/25 border border-teal-cyan/35 text-teal-cyan px-2.5 py-0.5 rounded text-[9.5px] font-cyber tracking-widest uppercase cursor-pointer"
                >
                  MINE
                </button>
              </div>
            </form>
          </div>

          {/* Ledger Chain table */}
          <div className="xl:col-span-8 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 select-text">
            <h4 className="text-xs font-cyber text-white tracking-widest border-b border-slate-900 pb-2 mb-3 select-none flex justify-between">
              <span>LEDGER HASH CHAIN (score_ledger)</span>
              <span className="text-slate-550 text-[9px] font-mono select-none">Blocks: {ledgerData.length}</span>
            </h4>

            <div className="overflow-x-auto max-h-[195px] overflow-y-auto">
              {ledgerData.length === 0 ? (
                <div className="text-slate-500 italic text-[11px] text-center py-8 font-mono select-none">
                  [LEDGER EMPTY] Mine block on the left to initialize hash ledger.
                </div>
              ) : (
                <table className="w-full font-mono text-[9px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 select-none">
                      <th className="pb-1.5 pr-2">BLOCK ID</th>
                      <th className="pb-1.5 pr-2">STUDENT ID</th>
                      <th className="pb-1.5 pr-2">SCORE</th>
                      <th className="pb-1.5 pr-2">PREVIOUS BLOCK HASH</th>
                      <th className="pb-1.5 pr-2">CURRENT BLOCK HASH</th>
                      <th className="pb-1.5">BLOCK STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {ledgerData.map((row, index) => {
                      const isFirstRow = index === 0;
                      const expectedPrevHash = isFirstRow ? 'GENESIS' : ledgerData[index - 1].row_hash;
                      const prevHashMatch = row.prev_hash === expectedPrevHash;
                      
                      return (
                        <tr key={row.id || index} className={`hover:bg-slate-900/20 ${prevHashMatch ? 'text-slate-350' : 'text-red-alert bg-red-alert/5 font-semibold'}`}>
                          <td className="py-2 pr-2 text-slate-550 font-mono">#{row.id.substring(0,8)}...</td>
                          <td className="py-2 pr-2 text-white font-medium">{row.student_id}</td>
                          <td className="py-2 pr-2 text-teal-cyan font-bold">{row.score}%</td>
                          <td 
                            className={`py-2 pr-2 max-w-[120px] truncate ${prevHashMatch ? 'text-slate-500' : 'text-red-alert font-bold bg-red-alert/10 px-1 rounded animate-pulse'}`}
                            title={row.prev_hash}
                          >
                            {row.prev_hash}
                          </td>
                          <td className="py-2 pr-2 text-gold-accent max-w-[120px] truncate" title={row.row_hash}>
                            {row.row_hash}
                          </td>
                          <td className="py-2 text-[8px] text-slate-600 select-none">READ-ONLY</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          TAB 5: EXPORTABLE EVIDENCE CAPSULE
          ==================================================== */}
      {activeTab === "evidence" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-4 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 font-mono text-[11px] leading-relaxed flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-cyber text-white tracking-widest border-b border-slate-900 pb-2 mb-3 select-none">
                JUDGE EVIDENCE CAPSULE
              </h4>

              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                  <span className="text-slate-500">EXAM CODE:</span>
                  <span className="text-white font-semibold">{activeSession?.exam_code || 'UNSELECTED'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                  <span className="text-slate-500">DUAL SIGNATURES:</span>
                  <span className={committee1Signed && committee2Signed ? 'text-green-success font-bold' : 'text-gold-accent'}>
                    {committee1Signed && committee2Signed ? 'COMPLETE' : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                  <span className="text-slate-500">VAULT HASH:</span>
                  <span className={latestVaultRow ? 'text-green-success font-bold' : 'text-slate-500'}>
                    {latestVaultRow ? 'AVAILABLE' : 'EMPTY'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                  <span className="text-slate-500">LEDGER BLOCKS:</span>
                  <span className="text-teal-cyan font-bold">{ledgerData.length}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 select-none space-y-2">
              <button
                onClick={handleGenerateEvidenceCapsule}
                className="w-full py-2.5 bg-gold-accent/15 border border-gold-accent/35 text-gold-accent hover:bg-gold-accent/25 rounded text-center font-cyber tracking-widest text-[10px] uppercase transition-colors cursor-pointer"
              >
                Generate Evidence Capsule
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyEvidenceCapsule}
                  disabled={!evidenceCapsule}
                  className={`py-1.5 border rounded text-[10px] font-cyber tracking-wider transition-colors ${
                    evidenceCapsule
                      ? 'border-teal-cyan/35 text-teal-cyan hover:bg-teal-cyan/15 cursor-pointer'
                      : 'border-slate-850 text-slate-650 cursor-not-allowed'
                  }`}
                >
                  Copy JSON
                </button>
                <button
                  onClick={handleDownloadEvidenceCapsule}
                  disabled={!evidenceCapsule}
                  className={`py-1.5 border rounded text-[10px] font-cyber tracking-wider transition-colors ${
                    evidenceCapsule
                      ? 'border-green-success/35 text-green-success hover:bg-green-success/15 cursor-pointer'
                      : 'border-slate-850 text-slate-650 cursor-not-allowed'
                  }`}
                >
                  Download
                </button>
              </div>
              {copyState === "COPIED" && (
                <div className="text-center text-[9px] text-green-success font-cyber tracking-wider">
                  CAPSULE JSON COPIED
                </div>
              )}
              {copyState === "FAILED" && (
                <div className="text-center text-[9px] text-red-alert font-cyber tracking-wider">
                  CLIPBOARD BLOCKED BY BROWSER
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-8 bg-[#0A0E1A]/60 border border-slate-850 rounded-lg p-4 select-text">
            <h4 className="text-xs font-cyber text-white tracking-widest border-b border-slate-900 pb-2 mb-3 select-none flex justify-between">
              <span>CAPSULE PROOF READOUT</span>
              <span className="text-slate-550 text-[9px] font-mono select-none">
                {evidenceCapsule ? evidenceCapsule.schema_version : 'NOT GENERATED'}
              </span>
            </h4>

            {evidenceCapsule ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="bg-[#050812] border border-slate-950 rounded p-2">
                    <span className="text-slate-500 block uppercase text-[8px]">Capsule Hash</span>
                    <span className="text-gold-accent font-bold break-all">{evidenceCapsule.capsule_hash_preview}</span>
                  </div>
                  <div className="bg-[#050812] border border-slate-950 rounded p-2">
                    <span className="text-slate-500 block uppercase text-[8px]">Vault Hash</span>
                    <span className="text-teal-cyan font-bold break-all">{evidenceCapsule.vault.sha256_preview}</span>
                  </div>
                  <div className="bg-[#050812] border border-slate-950 rounded p-2">
                    <span className="text-slate-500 block uppercase text-[8px]">Ledger Integrity</span>
                    <span className={evidenceCapsule.ledger.integrity_status === 'VERIFIED' ? 'text-green-success font-bold' : 'text-red-alert font-bold'}>
                      {evidenceCapsule.ledger.integrity_status}
                    </span>
                  </div>
                </div>

                <pre className="bg-[#050812] border border-slate-950 rounded p-3 max-h-[260px] overflow-auto text-[9px] leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {JSON.stringify(evidenceCapsule, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-slate-500 italic text-[11px] text-center py-12 font-mono select-none">
                Generate a capsule after the pipeline runs to create a portable proof receipt for judges.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Database lists logs for the vault rows */}
      {activeTab === "watchdog" && vaultData.length > 0 && (
        <div className="bg-[#0A0E1A]/40 border border-slate-900 rounded p-3 select-text mt-3">
          <span className="text-[10px] text-slate-500 font-cyber font-bold tracking-widest block uppercase mb-1.5 select-none">
            Active Vault Rows (exam_vault table)
          </span>
          <div className="overflow-x-auto max-h-[100px] overflow-y-auto">
            <table className="w-full font-mono text-[8.5px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 select-none">
                  <th className="pb-1.5 pr-2">EXAM CODE</th>
                  <th className="pb-1.5 pr-2">VARIANT</th>
                  <th className="pb-1.5 pr-2">CIPHERTEXT BLOB</th>
                  <th className="pb-1.5 pr-2">IV (KEY)</th>
                  <th className="pb-1.5 pr-2">AUTH TAG</th>
                  <th className="pb-1.5">SHA-256 HASH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {vaultData.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-900/40 text-slate-350">
                    <td className="py-1.5 pr-2 text-white font-semibold">{row.exam_code}</td>
                    <td className="py-1.5 pr-2 text-teal-cyan">{row.variant}</td>
                    <td className="py-1.5 pr-2 max-w-[150px] truncate text-slate-500" title={row.blob}>{row.blob}</td>
                    <td className="py-1.5 pr-2 text-slate-500">{row.iv}</td>
                    <td className="py-1.5 pr-2 text-slate-500">{row.auth_tag}</td>
                    <td className="py-1.5 text-gold-accent max-w-[100px] truncate" title={row.hash}>{row.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
