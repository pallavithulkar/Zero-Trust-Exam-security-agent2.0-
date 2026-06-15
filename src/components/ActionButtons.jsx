export default function ActionButtons({ 
  onGenerate, 
  onApproveCommittee1,
  onApproveCommittee2,
  onDeploy,
  onRunAutoPipeline,
  isAutopilotRunning = false,
  generateState = "idle",     // "idle", "loading", "done"
  committee1Signed = false,
  committee2Signed = false,
  deployState = "idle",       // "idle", "pending", "done"
  setterName = "Prof. Sarah Jenkins",
  reviewerName = "Dr. Alex Morgan",
  approvalNotes = "Awaiting ruleset confirmation from Committee 1 (Setter).",
  approvalTime = "",
  currentPhase = 1
}) {

  // Button styles mapping
  const autopilotBtnClass = isAutopilotRunning
    ? "border-gold-accent bg-gold-accent/10 text-gold-accent animate-pulse cursor-wait shadow-[0_0_20px_rgba(212,175,55,0.25)]"
    : "border-gold-accent/40 hover:border-gold-accent text-white hover:bg-gold-accent/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]";

  const generateBtnClass = (generateState === "loading" || isAutopilotRunning)
    ? "border-teal-cyan text-teal-cyan cursor-wait opacity-65"
    : generateState === "done"
      ? "border-green-success/30 text-green-success/60 cursor-not-allowed bg-green-success/5"
      : "border-teal-cyan/40 hover:border-teal-cyan text-white hover:bg-teal-cyan/10 hover:shadow-[0_0_15px_rgba(229,169,59,0.15)]";

  const comm1BtnClass = (generateState === "done" && !committee1Signed && !isAutopilotRunning)
    ? "border-[#E5A93B] hover:border-teal-cyan hover:bg-teal-cyan/15 text-white hover:shadow-[0_0_15px_rgba(229,169,59,0.2)] animate-pulse"
    : committee1Signed
      ? "border-green-success/30 text-green-success/60 cursor-not-allowed bg-green-success/5"
      : "border-slate-800 text-slate-500 cursor-not-allowed";

  const comm2BtnClass = (committee1Signed && !committee2Signed && !isAutopilotRunning)
    ? "border-gold-accent hover:border-green-success hover:bg-green-success/15 text-white hover:shadow-[0_0_15px_rgba(34,180,102,0.2)] animate-pulse"
    : committee2Signed
      ? "border-green-success/30 text-green-success/60 cursor-not-allowed bg-green-success/5"
      : "border-slate-800 text-slate-500 cursor-not-allowed";

  const deployBtnClass = (committee1Signed && committee2Signed && deployState === "pending" && !isAutopilotRunning)
    ? "border-[#D4AF37]/50 hover:border-gold-accent text-white hover:bg-gold-accent/15 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] animate-pulse"
    : deployState === "done"
      ? "border-green-success/30 text-green-success/60 cursor-not-allowed bg-green-success/5"
      : "border-slate-800 text-slate-500 cursor-not-allowed";

  return (
    <div className="bg-[#0E1528]/85 border border-slate-800 rounded-lg p-4 flex flex-col justify-between cyber-border-glow shadow-xl h-full backdrop-blur-md">
      
      {/* Panel header */}
      <div>
        <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 mb-3.5 select-none">
          <h2 className="text-base font-cyber text-white tracking-widest flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-accent"></span>
            ACTIONS & CONTROL
          </h2>
          <span className="text-[9px] text-gold-accent bg-gold-accent/5 px-2 py-0.5 rounded border border-gold-accent/10 font-cyber font-medium uppercase">
            Operations Console
          </span>
        </div>

        {/* Buttons List */}
        <div className="space-y-2.5">
          
          {/* ✨ JUDGE DEMO MODE AUTOPILOT BUTTON */}
          <button
            onClick={(!isAutopilotRunning && onRunAutoPipeline) ? onRunAutoPipeline : undefined}
            disabled={isAutopilotRunning}
            className={`w-full border rounded-lg p-3 text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${autopilotBtnClass}`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-[#0A0E1A] rounded border border-gold-accent/40">
                <span className="text-base">✨</span>
              </div>
              <div>
                <h3 className="text-xs font-cyber font-bold tracking-widest text-gold-accent">RUN COMPLETE PIPELINE</h3>
                <p className="text-[9px] opacity-75 font-outfit text-white">One-click autonomous judge walkthrough</p>
              </div>
            </div>
            {isAutopilotRunning ? (
              <svg className="animate-spin h-4 w-4 text-gold-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="text-xs text-gold-accent font-bold">&gt;&gt;</span>
            )}
          </button>

          <div className="border-t border-slate-800/40 my-1 select-none" />

          {/* STEP 1: GENERATE BUTTON */}
          <button 
            onClick={(generateState === "idle" && !isAutopilotRunning) ? onGenerate : undefined}
            disabled={generateState !== "idle" || isAutopilotRunning}
            className={`w-full border rounded-lg p-2.5 text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${generateBtnClass}`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-[#0A0E1A] rounded border border-teal-cyan/20">
                <svg className="w-4 h-4 text-teal-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-cyber font-bold tracking-wider">1. GENERATE EXAM PACKAGE</h3>
                <p className="text-[9px] opacity-60 font-outfit">Trigger decentralized AI compilation</p>
              </div>
            </div>
            {generateState === "loading" ? (
              <svg className="animate-spin h-4 w-4 text-teal-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="text-xs">&gt;</span>
            )}
          </button>

          {/* STEP 2: COMMITTEE 1 SIGN-OFF */}
          <button 
            onClick={(generateState === "done" && !committee1Signed && !isAutopilotRunning) ? onApproveCommittee1 : undefined}
            disabled={generateState !== "done" || committee1Signed || isAutopilotRunning}
            className={`w-full border rounded-lg p-2.5 text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${comm1BtnClass}`}
          >
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 bg-[#0A0E1A] rounded border ${generateState === 'done' && !committee1Signed ? 'border-teal-cyan/40' : 'border-slate-800'}`}>
                <svg className="w-4 h-4 text-teal-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-cyber font-bold tracking-wider">2. APPROVE COMPILATION (COMMITTEE 1)</h3>
                <p className="text-[9px] opacity-60 font-outfit">Syllabus verification and initial signature</p>
              </div>
            </div>
            <span className="text-xs">&gt;</span>
          </button>

          {/* STEP 3: COMMITTEE 2 SIGN-OFF */}
          <button 
            onClick={(committee1Signed && !committee2Signed && !isAutopilotRunning) ? onApproveCommittee2 : undefined}
            disabled={!committee1Signed || committee2Signed || isAutopilotRunning}
            className={`w-full border rounded-lg p-2.5 text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${comm2BtnClass}`}
          >
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 bg-[#0A0E1A] rounded border ${committee1Signed && !committee2Signed ? 'border-gold-accent/40' : 'border-slate-800'}`}>
                <svg className="w-4 h-4 text-red-alert" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-cyber font-bold tracking-wider">3. FINAL BOARD APPROVAL (COMMITTEE 2)</h3>
                <p className="text-[9px] opacity-60 font-outfit">Board review of Critic self-audit scorecards</p>
              </div>
            </div>
            <span className="text-xs">&gt;</span>
          </button>

          {/* STEP 4: DEPLOY TO VAULT */}
          <button 
            onClick={(committee1Signed && committee2Signed && deployState === "pending" && !isAutopilotRunning) ? onDeploy : undefined}
            disabled={!committee1Signed || !committee2Signed || deployState !== "pending" || isAutopilotRunning}
            className={`w-full border rounded-lg p-2.5 text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${deployBtnClass}`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-[#0A0E1A] rounded border border-slate-800">
                <svg className="w-4 h-4 text-gold-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-2-9-10-10-7 7 10 10zM14 5l-8 8m0 0l-2 2a2 2 0 01-2.828 0v0a2 2 0 010-2.828l2-2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-cyber font-bold tracking-wider">4. DEPLOY TO SECURE CHANNEL</h3>
                <p className="text-[9px] opacity-60 font-outfit">AES encrypt payload, save & distribute</p>
              </div>
            </div>
            <span className="text-xs">&gt;</span>
          </button>
        </div>
      </div>

      {/* Dynamic Approvals timeline visual */}
      <div className="my-3 border-t border-b border-slate-850 py-3 select-none">
        <h4 className="text-[10px] text-slate-500 font-cyber tracking-widest uppercase mb-2">
          Approval Timeline Status
        </h4>
        <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] font-cyber relative">
          
          {/* Phase 1 compile */}
          <div className="flex flex-col items-center">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${
              generateState === 'done' ? 'bg-teal-cyan/10 border-teal-cyan text-teal-cyan' : 'border-slate-800 text-slate-650'
            }`}>✓</span>
            <span className="mt-1 leading-none text-slate-500 scale-[0.95]">1.Compile</span>
          </div>
          
          {/* Phase 2 audit */}
          <div className="flex flex-col items-center">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${
              generateState === 'done' && currentPhase >= 3 ? 'bg-teal-cyan/10 border-teal-cyan text-teal-cyan' : 'border-slate-800 text-slate-650'
            }`}>✓</span>
            <span className="mt-1 leading-none text-slate-500 scale-[0.95]">2.Audit</span>
          </div>

          {/* Committee 1 */}
          <div className="flex flex-col items-center">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${
              committee1Signed ? 'bg-teal-cyan/10 border-teal-cyan text-teal-cyan' : 'border-slate-800 text-slate-650'
            }`}>✓</span>
            <span className="mt-1 leading-none text-slate-500 scale-[0.95]">3.Comm1</span>
          </div>

          {/* Committee 2 */}
          <div className="flex flex-col items-center">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${
              committee2Signed ? 'bg-green-success/15 border-green-success text-green-success' : 'border-slate-800 text-slate-650'
            }`}>✓</span>
            <span className="mt-1 leading-none text-slate-500 scale-[0.95]">4.Comm2</span>
          </div>

          {/* Securely Locked */}
          <div className="flex flex-col items-center">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${
              deployState === 'done' ? 'bg-green-success/15 border-green-success text-green-success' : 'border-slate-800 text-slate-650'
            }`}>🔒</span>
            <span className="mt-1 leading-none text-slate-500 scale-[0.95]">5.Vaulted</span>
          </div>

        </div>
      </div>

      {/* Dual Human-in-the-loop Signature Statuses */}
      <div className="mt-1.5 flex flex-col justify-end">
        <h4 className="text-[10px] text-slate-500 font-cyber tracking-widest uppercase mb-2">
          Dual Verification Sign-off status
        </h4>
        
        <div className="grid grid-cols-2 gap-2.5">
          {/* COMMITTEE 1 SIGNATURE */}
          <div className="bg-[#0A0E1A]/60 border border-slate-850 rounded p-2.5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-cyber text-slate-400 block leading-tight">{setterName}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${committee1Signed ? 'bg-teal-cyan' : 'bg-slate-750'}`}></span>
            </div>
            <span className="text-[8px] text-slate-600 block font-mono leading-none">COMMITTEE 1 (SETTER)</span>
            
            <div className="h-6 flex items-center justify-center select-none bg-[#050812] border border-slate-900 rounded font-serif italic text-xs">
              {committee1Signed ? (
                <span className="text-teal-cyan tracking-wider font-serif">/s/ Sarah Jenkins</span>
              ) : (
                <span className="text-slate-700 text-[9px] font-mono">Awaiting click #1</span>
              )}
            </div>
          </div>

          {/* COMMITTEE 2 SIGNATURE */}
          <div className="bg-[#0A0E1A]/60 border border-slate-850 rounded p-2.5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-cyber text-slate-400 block leading-tight">{reviewerName}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${committee2Signed ? 'bg-green-success' : 'bg-slate-750'}`}></span>
            </div>
            <span className="text-[8px] text-slate-600 block font-mono leading-none">COMMITTEE 2 (APPROVER)</span>
            
            <div className="h-6 flex items-center justify-center select-none bg-[#050812] border border-slate-900 rounded font-serif italic text-xs">
              {committee2Signed ? (
                <span className="text-green-success tracking-wider font-serif">/s/ Alex Morgan</span>
              ) : (
                <span className="text-slate-700 text-[9px] font-mono">Awaiting click #2</span>
              )}
            </div>
          </div>
        </div>

        {/* Approval metadata notes */}
        <div className="mt-2.5 bg-[#0A0E1A]/40 border border-slate-900/60 rounded p-2 text-[9px] font-mono text-slate-400 select-text leading-relaxed">
          <div className="flex justify-between text-[8px] text-slate-550 border-b border-slate-900 pb-0.5 mb-1 font-mono uppercase">
            <span>AUDIT METADATA JOURNAL</span>
            <span>{approvalTime || 'PENDING'}</span>
          </div>
          {approvalNotes}
        </div>
      </div>

    </div>
  );
}
