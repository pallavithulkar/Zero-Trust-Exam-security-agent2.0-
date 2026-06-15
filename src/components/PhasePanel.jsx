// Icons mapping for the 9 phases
const PHASE_ICONS = {
  1: (
    // Blind Compilation (Mind/Group)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  2: (
    // Critic Audit (Shield/Check)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  3: (
    // Committee Approval (User Group/Key)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  4: (
    // Encrypt (Key/Lock)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  5: (
    // Watchdog (Fingerprint/Eye)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.5c0-6.078-4.5-11-10-11m12 0c5.5 0 10 4.922 10 11 0 2.222-.658 4.29-1.793 6.016M11 21a9 9 0 1118 0" />
    </svg>
  ),
  6: (
    // Blind Distribution (Network/Link)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  7: (
    // Time-Lock (Clock/Hourglass)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  8: (
    // Mutation Signature (Code/Sparkles)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  9: (
    // Score Ledger (Database/Chain)
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  )
};

export default function PhasePanel({ currentPhase = 1, phaseStatuses = {}, systemStatus = "SECURE" }) {
  const phases = [
    { num: 1, title: 'Blind Compilation', desc: 'Secure compilation of expert pools' },
    { num: 2, title: 'Critic Self-Audit', desc: 'Syllabus, redundancy & PYQ verification' },
    { num: 3, title: 'Committee Approval', desc: 'Double signature verification' },
    { num: 4, title: 'AES-256 GCM Vaulting', desc: 'Cryptographic locking & RLS insert' },
    { num: 5, title: 'Integrity Watchdog', desc: '120s hash validation routine' },
    { num: 6, title: 'Blind Distribution', desc: 'Nodal portal encrypted release' },
    { num: 7, title: 'Time-Locked Release', desc: 'Auto-decryption key release' },
    { num: 8, title: 'Mutation Signature', desc: 'Leak origin tracing footprint' },
    { num: 9, title: 'Immutable Ledger', desc: 'Chained transaction log' }
  ];

  const isSecure = systemStatus === "SECURE";
  const healthVal = isSecure ? "100%" : "12%";
  const healthColor = isSecure ? "text-green-success" : "text-red-alert animate-pulse";
  const healthBg = isSecure ? "bg-green-success" : "bg-red-alert animate-ping";
  const healthText = isSecure ? "All systems operational" : "CRITICAL SECURITY BREACH";
  const lineClass = isSecure ? "text-green-success/80" : "text-red-alert/80 animate-shake";

  return (
    <div className="bg-[#0E1528]/85 border border-slate-800 rounded-lg p-4 flex flex-col justify-between cyber-border-glow shadow-xl h-full backdrop-blur-md">
      <div>
        {/* Section Title */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <h2 className="text-lg font-cyber text-white tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-accent animate-pulse"></span>
            SECURITY WORKFLOW
          </h2>
          <span className="text-xs bg-slate-800/80 px-2 py-0.5 rounded text-slate-400 font-cyber font-medium uppercase">
            9-Phase Flow
          </span>
        </div>

        {/* Phase Checklist */}
        <div className="space-y-2.5">
          {phases.map((p) => {
            const status = phaseStatuses[p.num] || 'INACTIVE';
            
            let itemBg = 'bg-[#0A0E1A]/40 border-slate-900/40 text-slate-500';
            let statusBadge = '';
            let ringColor = 'border-slate-850';
            let iconColor = 'text-slate-650';

            if (p.num === currentPhase && status === 'ACTIVE') {
              itemBg = 'bg-teal-cyan/5 border-teal-cyan/30 text-white cyber-border-glow-gold';
              ringColor = 'border-teal-cyan animate-pulse';
              iconColor = 'text-teal-cyan';
              statusBadge = (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-cyan"></span>
                </span>
              );
            } else if (status === 'SUCCESS') {
              itemBg = 'bg-green-success/5 border-green-success/30 text-slate-200';
              ringColor = 'border-green-success';
              iconColor = 'text-green-success';
              statusBadge = (
                <span className="text-[10px] text-green-success font-semibold tracking-wider font-cyber">OK</span>
              );
            } else if (status === 'FAILED') {
              itemBg = 'bg-red-alert/5 border-red-alert/30 text-slate-200 animate-pulse';
              ringColor = 'border-red-alert';
              iconColor = 'text-red-alert';
              statusBadge = (
                <span className="text-[10px] text-red-alert font-bold tracking-wider font-cyber animate-pulse">BREACH</span>
              );
            } else if (status === 'COMPLETED') {
              itemBg = 'bg-[#0E1528] border-slate-800 text-slate-400';
              ringColor = 'border-slate-700';
              iconColor = 'text-slate-400';
              statusBadge = (
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider font-cyber">DONE</span>
              );
            } else if (status === 'INACTIVE') {
              itemBg = 'bg-[#0A0E1A]/40 border-slate-900/40 text-slate-400';
              ringColor = 'border-gold-accent/30';
              iconColor = 'text-gold-accent/70';
              statusBadge = (
                <span className="w-1.5 h-1.5 rounded-full bg-gold-accent/50"></span>
              );
            }

            return (
              <div
                key={p.num}
                className={`flex items-center justify-between border rounded-lg p-2.5 transition-all duration-300 ${itemBg}`}
              >
                <div className="flex items-center space-x-3">
                  {/* Left Circle Icon */}
                  <div className={`p-1.5 rounded border-2 ${ringColor} flex items-center justify-center bg-[#070B14]`}>
                    <span className={iconColor}>{PHASE_ICONS[p.num]}</span>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className={`text-sm font-cyber font-semibold tracking-wide flex items-center gap-1.5 ${p.num === currentPhase && status === 'ACTIVE' ? 'text-white' : ''}`}>
                      <span className="text-[11px] opacity-60 font-mono">P0{p.num}:</span>
                      {p.title}
                    </h3>
                    <p className="text-[11px] opacity-60 line-clamp-1 select-none font-outfit">{p.desc}</p>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div className="flex items-center space-x-1.5 pr-1">
                  {statusBadge}
                  {p.num === currentPhase && status === 'ACTIVE' && (
                    <span className="text-[10px] text-teal-cyan font-bold tracking-widest font-cyber animate-pulse">ACTIVE</span>
                  )}
                  {status === 'INACTIVE' && (
                    <span className="text-[10px] text-gold-accent/60 font-cyber tracking-wider">INACTIVE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Health Block */}
      <div className="mt-4 pt-3 border-t border-slate-850 select-none">
        <h4 className="text-[10px] text-gold-accent font-cyber tracking-widest uppercase mb-1">
          SYSTEM HEALTH
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex-grow h-8 flex items-center pr-4">
            <svg className={`w-full h-6 ${lineClass}`} viewBox="0 0 120 30" fill="none">
              <path d="M0 15 h30 l4 -10 l4 25 l4 -20 l4 5 h54" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={`text-xl font-bold font-mono tracking-wider ${healthColor}`}>
            {healthVal}
          </div>
        </div>
        <div className="flex items-center space-x-1.5 mt-2 text-[9.5px] text-slate-400 font-cyber uppercase tracking-wider">
          <span className={`w-1.5 h-1.5 rounded-full ${healthBg}`} />
          <span className={isSecure ? "" : "text-red-alert font-bold"}>{healthText}</span>
        </div>
      </div>
    </div>
  );
}
