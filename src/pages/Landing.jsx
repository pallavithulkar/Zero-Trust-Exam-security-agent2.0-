export default function Landing({ onSelectRole }) {
  return (
    <div className="min-h-screen bg-cyber-bg scanline-bg text-slate-200 flex items-center justify-center p-4 font-outfit relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full bg-[#0E1528]/90 border border-slate-800 rounded-2xl p-6 md:p-10 cyber-border-glow shadow-[0_0_50px_rgba(229,169,59,0.15)] backdrop-blur-md">
        
        {/* App Branding */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex bg-[#17223B] p-4 rounded-full border-2 border-teal-cyan/50 shadow-[0_0_30px_rgba(229,169,59,0.25)] mb-4 animate-float">
            {/* Lock with gear */}
            <svg className="w-12 h-12 text-teal-cyan" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-cyber text-white tracking-widest uppercase mb-2">
            ZERO-TRUST EXAM SECURITY AGENT
          </h1>
          <p className="text-xs md:text-sm text-gold-accent font-cyber tracking-widest font-semibold uppercase mb-4">
            Autonomous Cybersecurity Infrastructure for National Examinations
          </p>
          
          <div className="max-w-xl mx-auto text-xs md:text-sm text-slate-400 font-outfit leading-relaxed">
            Eliminating physical theft and human leak vectors. 
            All exam variants compile blindly via AI, validate autonomously, and lock with browser-native 
            <span className="text-teal-cyan font-mono font-semibold"> AES-256-GCM </span> encryption before deployment. 
            <strong> Total Human Clicks = 2 Only.</strong>
          </div>
        </div>

        {/* Roles Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* COMMITTEE 1 CARD */}
          <div 
            onClick={() => onSelectRole('Setter')}
            className="group cursor-pointer bg-[#0A0E1A]/80 border border-slate-800 hover:border-teal-cyan/60 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,169,59,0.15)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-cyber text-slate-500 font-semibold tracking-wider">COMMITTEE 1</span>
                <span className="text-[9px] bg-teal-cyan/15 text-teal-cyan px-2 py-0.5 rounded border border-teal-cyan/20">STEP 1</span>
              </div>
              <h2 className="text-lg font-cyber text-white tracking-wider group-hover:text-teal-cyan transition-colors mb-2">
                EXAM SETTER
              </h2>
              <p className="text-[11px] text-slate-400 font-outfit leading-relaxed">
                Configure parameters, fetch dynamic syllabi, and blindly generate variants A/B/C.
              </p>
            </div>
            
            <button className="mt-6 w-full py-2 bg-teal-cyan/10 border border-teal-cyan/35 text-teal-cyan hover:bg-teal-cyan/20 rounded font-cyber text-xs tracking-widest uppercase transition-colors">
              Access Setter View
            </button>
          </div>

          {/* COMMITTEE 2 CARD */}
          <div 
            onClick={() => onSelectRole('Approver')}
            className="group cursor-pointer bg-[#0A0E1A]/80 border border-slate-800 hover:border-[#D43C3C]/60 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,60,60,0.1)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-cyber text-slate-500 font-semibold tracking-wider">COMMITTEE 2</span>
                <span className="text-[9px] bg-[#D43C3C]/15 text-[#D43C3C] px-2 py-0.5 rounded border border-[#D43C3C]/20">STEP 2</span>
              </div>
              <h2 className="text-lg font-cyber text-white tracking-wider group-hover:text-[#D43C3C] transition-colors mb-2">
                EXAM APPROVER
              </h2>
              <p className="text-[11px] text-slate-400 font-outfit leading-relaxed">
                Review Critic Agent compliance scorecards, verify security audit items, and approve compilation.
              </p>
            </div>
            
            <button className="mt-6 w-full py-2 bg-[#D43C3C]/10 border border-[#D43C3C]/35 text-[#D43C3C] hover:bg-[#D43C3C]/20 rounded font-cyber text-xs tracking-widest uppercase transition-colors">
              Access Approver View
            </button>
          </div>

          {/* ADMIN OPERATIONS CARD */}
          <div 
            onClick={() => onSelectRole('Admin')}
            className="group cursor-pointer bg-[#0A0E1A]/80 border border-slate-800 hover:border-gold-accent/60 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-cyber text-slate-500 font-semibold tracking-wider">OPERATIONS</span>
                <span className="text-[9px] bg-gold-accent/15 text-gold-accent px-2 py-0.5 rounded border border-gold-accent/20 font-mono">GLOBAL</span>
              </div>
              <h2 className="text-lg font-cyber text-white tracking-wider group-hover:text-gold-accent transition-colors mb-2">
                SECURITY ADMIN
              </h2>
              <p className="text-[11px] text-slate-400 font-outfit leading-relaxed">
                Monitor live pipelines, inspect AES-256 hashes, test watchdog tampering alerts, and verify Ledger blocks.
              </p>
            </div>
            
            <button className="mt-6 w-full py-2 bg-gold-accent/10 border border-gold-accent/35 text-gold-accent hover:bg-gold-accent/20 rounded font-cyber text-xs tracking-widest uppercase transition-colors">
              Access Admin View
            </button>
          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="flex flex-wrap items-center justify-around gap-4 text-center border-t border-slate-850 pt-6 font-cyber text-xs text-slate-500">
          <div>
            PROVEN LEAK RATE: <span className="text-red-alert font-bold">70+ / DECADE</span>
          </div>
          <div className="hidden sm:block text-slate-700">•</div>
          <div>
            ZERO-TRUST PARADIGM: <span className="text-green-success font-bold">0 LEAKS</span>
          </div>
          <div className="hidden sm:block text-slate-700">•</div>
          <div>
            HUMAN INTERACTION: <span className="text-teal-cyan font-bold">2 SIGNATURE CLICKS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
