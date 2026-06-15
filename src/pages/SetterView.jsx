import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import PhasePanel from '../components/PhasePanel';
import RobotMascot from '../components/RobotMascot';
import LiveProcessLog from '../components/LiveProcessLog';

export default function SetterView({ 
  currentRole = "Committee 1 - Setter",
  systemStatus = "SECURE",
  currentPhase = 1,
  phaseStatuses = {},
  robotState = "idle",
  speakTrigger = "",
  speechText = "",
  logs = [],
  sessions = [],
  activeSession = null,
  onSelectSession = () => {},
  onConfirmRules = () => {},
  onApproveCommittee1 = () => {},
  committee1Signed = false,
  pipelineState = "idle", // "idle", "generating", "regenerating", "awaiting_approval", "encrypting", "deployed"
}) {
  const [selectedSessionId, setSelectedSessionId] = useState(activeSession?.id || sessions[0]?.id || "");
  const [scraperSource, setScraperSource] = useState("scrape"); // "scrape" | "cache"

  const handleConfirm = (e) => {
    e.preventDefault();
    const session = sessions.find(s => s.id === selectedSessionId);
    if (!session) return;
    onSelectSession(session);
    onConfirmRules(session, scraperSource);
  };

  const currentSession = sessions.find(s => s.id === selectedSessionId) || activeSession || sessions[0];

  return (
    <Dashboard systemStatus={systemStatus} currentRole={currentRole}>
      
      {/* COLUMN 1: WORKFLOW PHASES (LEFT) */}
      <div className="lg:col-span-3">
        <PhasePanel currentPhase={currentPhase} phaseStatuses={phaseStatuses} systemStatus={systemStatus} />
      </div>

      {/* COLUMN 2: ROBOT & TELETEMP LOGGER (CENTER) */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        <RobotMascot 
          state={robotState} 
          speakTrigger={speakTrigger} 
          speechText={speechText} 
        />
        <LiveProcessLog logs={logs} />
      </div>

      {/* COLUMN 3: SETTER CONTROLS & PARAMS (RIGHT) */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        
        {/* SETTER PARAMETER FORM */}
        <div className="bg-[#0E1528]/85 border border-slate-800 rounded-lg p-5 cyber-border-glow shadow-xl flex-grow backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 select-none">
              <h2 className="text-base font-cyber text-white tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-cyan"></span>
                COMMITTEE 1: RULESET CONFIG
              </h2>
              <span className="text-[9px] bg-teal-cyan/10 text-teal-cyan px-2 py-0.5 rounded border border-teal-cyan/20 font-mono">
                INPUT PORTAL
              </span>
            </div>

            {pipelineState === "idle" ? (
              <form onSubmit={handleConfirm} className="space-y-4 select-none">
                {/* Exam selection */}
                <div>
                  <label className="text-[10px] text-slate-400 font-cyber tracking-widest uppercase block mb-1">
                    Select National Exam Session
                  </label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-teal-cyan"
                  >
                    {sessions.map(s => (
                      <option key={s.id} value={s.id}>
                        [{s.board}] {s.exam_code} - {s.subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Syllabus Discovery Source */}
                <div>
                  <label className="text-[10px] text-slate-400 font-cyber tracking-widest uppercase block mb-1.5">
                    Syllabus Scraper Discovery Portal
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setScraperSource("scrape")}
                      className={`py-2 px-3 border rounded text-center transition-colors cursor-pointer ${
                        scraperSource === "scrape"
                          ? "border-teal-cyan text-teal-cyan bg-teal-cyan/5 font-semibold"
                          : "border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      📡 Live Scrape Portal
                    </button>
                    <button
                      type="button"
                      onClick={() => setScraperSource("cache")}
                      className={`py-2 px-3 border rounded text-center transition-colors cursor-pointer ${
                        scraperSource === "cache"
                          ? "border-teal-cyan text-teal-cyan bg-teal-cyan/5 font-semibold"
                          : "border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      💾 Fallback Cached JSON
                    </button>
                  </div>
                </div>

                {/* Difficulty distribution telemetry */}
                <div className="bg-[#0A0E1A] border border-slate-900 rounded p-3 text-[10px] font-mono space-y-1 text-slate-400">
                  <span className="text-slate-500 font-semibold block text-[9px] uppercase mb-1">COMPILATION METRICS:</span>
                  <div className="flex justify-between">
                    <span>VARIANTS:</span>
                    <span className="text-white">A, B, C (3 Copies)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DIFFICULTY CURVE:</span>
                    <span className="text-white">30% / 40% / 30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LEAK PROTECTION:</span>
                    <span className="text-green-success font-semibold">ZERO ACCESS TOKEN</span>
                  </div>
                </div>

                {/* CLICK 1: Setter Confirm */}
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-cyan/15 hover:bg-teal-cyan/25 border border-teal-cyan/45 hover:border-teal-cyan text-white rounded font-cyber text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(229,169,59,0.1)] hover:shadow-[0_0_20px_rgba(229,169,59,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-teal-cyan animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>CONFIRM EXAM & COMPILE</span>
                </button>
              </form>
            ) : (
              <div className="space-y-3.5 font-mono text-xs select-none">
                
                {/* Active Session telemetry */}
                <div className="bg-[#0A0E1A] border border-slate-900 rounded-lg p-3 space-y-2 text-slate-350">
                  <div className="text-slate-500 font-semibold text-[9px] uppercase border-b border-slate-900 pb-1">
                    RUNNING COMPILER DATA
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">EXAM:</span>
                    <span className="text-white font-semibold">{currentSession?.exam_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">RULESET:</span>
                    <span className="text-green-success">CONFIRMED</span>
                  </div>
                </div>

                {/* Loading state visual */}
                {(pipelineState === "generating" || pipelineState === "regenerating") ? (
                  <div className="text-center py-4 space-y-3">
                    <svg className="animate-spin h-6 w-6 text-teal-cyan mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-[10px] text-slate-400 animate-pulse">
                      Generating Variants & Scrapes...
                    </p>
                  </div>
                ) : (
                  // Compilation Completed! Show visual dashboard outputs
                  <div className="space-y-3">
                    
                    {/* Variants Checkboxes */}
                    <div className="bg-[#0A0E1A] border border-slate-900 rounded p-2.5 space-y-1 text-[10px]">
                      <span className="text-slate-500 font-bold block text-[8px] uppercase mb-1">GENERATED COMPILATIONS:</span>
                      <div className="flex justify-between text-green-success font-semibold">
                        <span>✓ Variant A (5 Questions)</span>
                        <span className="text-slate-500">READY</span>
                      </div>
                      <div className="flex justify-between text-green-success font-semibold">
                        <span>✓ Variant B (5 Questions)</span>
                        <span className="text-slate-500">READY</span>
                      </div>
                      <div className="flex justify-between text-green-success font-semibold">
                        <span>✓ Variant C (5 Questions)</span>
                        <span className="text-slate-500">READY</span>
                      </div>
                    </div>

                    {/* Difficulty breakdown graphics */}
                    <div className="bg-[#0A0E1A] border border-slate-900 rounded p-2.5 space-y-1.5 text-[10px]">
                      <span className="text-slate-500 font-bold block text-[8px] uppercase">DIFFICULTY DISTRIBUTION GAP:</span>
                      
                      {/* Easy */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[9px]">
                          <span>Easy Questions</span>
                          <span className="text-white">30%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-success h-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>

                      {/* Medium */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[9px]">
                          <span>Medium Questions</span>
                          <span className="text-white">40%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-teal-cyan h-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>

                      {/* Hard */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[9px]">
                          <span>Hard Questions</span>
                          <span className="text-white">30%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-alert h-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Click 1 approval action trigger */}
                    {!committee1Signed ? (
                      <button
                        onClick={onApproveCommittee1}
                        className="w-full py-2 bg-teal-cyan/15 hover:bg-teal-cyan/25 border border-teal-cyan/45 hover:border-teal-cyan text-white rounded font-cyber text-[11px] tracking-wider uppercase transition-all select-none cursor-pointer"
                      >
                        ✍️ APPROVE COMPILATION (COMMITTEE 1)
                      </button>
                    ) : (
                      <div className="bg-teal-cyan/10 border border-teal-cyan/35 text-teal-cyan rounded py-2 text-center font-cyber tracking-widest font-bold uppercase select-none">
                        ✓ SETTER SIGNED OFF
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
          </div>

          {/* Verification receipt */}
          <div className="mt-4 border-t border-slate-800 pt-3 select-none text-[9px] font-mono text-slate-500 space-y-1.5">
            <div className="flex justify-between">
              <span>COMMITTEE 1 SIGN-OFF:</span>
              <span className={committee1Signed ? 'text-teal-cyan font-bold animate-pulse' : 'text-slate-700'}>
                {committee1Signed ? 'YES (SIGNED)' : 'AWAITING SIGN'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>VAULT SECURE HASH:</span>
              <span className="text-slate-650 font-mono">MD-2026-F5</span>
            </div>
          </div>
        </div>

      </div>

    </Dashboard>
  );
}
