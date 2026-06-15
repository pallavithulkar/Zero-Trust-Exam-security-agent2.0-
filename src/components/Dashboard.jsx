import { useEffect, useState } from 'react';

export default function Dashboard({ children, systemStatus = "SECURE", currentRole = "Admin" }) {
  const [utcTime, setUtcTime] = useState("");

  // Update UTC clock in real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setUtcTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timePart = utcTime.includes(' ') ? utcTime.split(' ')[1] : '00:00:00';
  const datePart = utcTime.includes(' ') ? utcTime.split(' ')[0] : 'May 23, 2025';

  return (
    <div className="min-h-screen bg-cyber-bg scanline-bg text-slate-200 p-4 font-outfit relative flex flex-col justify-between selection:bg-teal-cyan/30 selection:text-white">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0" />

      {/* Cyber Header */}
      <header className="relative z-10 w-full bg-[#0E1528]/80 border border-slate-800 rounded-lg p-4 mb-4 flex flex-col md:flex-row justify-between items-center cyber-border-glow shadow-2xl backdrop-blur-md">
        {/* Logo and App Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#17223B] p-2.5 rounded-lg border border-gold-accent/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            {/* Padlock Icon */}
            <svg className="w-6 h-6 text-gold-accent animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-cyber text-white tracking-wider flex items-center gap-2">
              ZERO-TRUST EXAM SECURITY AGENT
            </h1>
            <p className="text-[10px] text-teal-cyan font-cyber font-semibold tracking-widest uppercase">
              AI-POWERED • ZERO-TRUST • END-TO-END EXAM SECURITY
            </p>
          </div>
        </div>

        {/* Global Security Telemetry */}
        <div className="flex items-center space-x-6 mt-4 md:mt-0 font-cyber text-sm">
          {/* Active Role Indicator */}
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block tracking-widest uppercase">ACTIVE PORTAL</span>
            <span className="text-gold-accent font-semibold tracking-wider">{currentRole}</span>
          </div>

          <div className="border-l border-slate-800 h-8 hidden sm:block" />

          {/* System Status */}
          <div className="text-right">
            <span className="text-xs text-slate-400 block tracking-widest">SYSTEM STATUS</span>
            <span className={`font-semibold tracking-wider ${systemStatus === 'SECURE' ? 'text-green-success' : 'text-red-alert animate-pulse'}`}>
              {systemStatus}
            </span>
          </div>

          <div className="border-l border-slate-800 h-8" />

          {/* Live UTC Timer */}
          <div>
            <span className="text-xs font-semibold block tracking-widest text-gold-accent font-mono">{timePart} UTC</span>
            <span className="font-mono text-slate-400 text-[10px] tracking-wide">{datePart}</span>
          </div>

          {/* ECG/Pulse visualizer */}
          <div className="hidden lg:flex items-center space-x-1.5 h-6 bg-[#0A0E1A] px-2.5 rounded border border-slate-850">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${systemStatus === 'SECURE' ? 'bg-green-success' : 'bg-red-alert'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${systemStatus === 'SECURE' ? 'bg-green-success' : 'bg-red-alert'}`}></span>
            </span>
            {/* Heartbeat SVG */}
            <svg className={`w-12 h-6 ${systemStatus === 'SECURE' ? 'text-green-success/60' : 'text-red-alert/60 animate-shake'}`} viewBox="0 0 100 30" fill="none">
              <path d="M0 15 h30 l5 -10 l5 25 l5 -20 l5 5 h50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Grid Panels Area */}
      <main className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch mb-4">
        {children}
      </main>

      {/* Zero-Trust Compliance Footer */}
      <footer className="relative z-10 w-full bg-[#0E1528] border border-slate-850 rounded-lg px-6 py-3 text-center text-xs tracking-widest text-slate-400 font-cyber flex flex-wrap justify-between items-center gap-2 select-none">
        <div>
          ENCRYPTION: <span className="text-teal-cyan font-mono">AES-256</span>
        </div>
        <div className="hidden sm:block text-slate-650">•</div>
        <div>
          NETWORK: <span className="text-teal-cyan">ZERO-TRUST</span>
        </div>
        <div className="hidden sm:block text-slate-650">•</div>
        <div>
          LEDGER: <span className="text-teal-cyan">IMMUTABLE</span>
        </div>
        <div className="hidden sm:block text-slate-650">•</div>
        <div>
          COMPLIANCE: <span className="text-teal-cyan font-semibold">ISO/IEC 27001</span>
        </div>
      </footer>
    </div>
  );
}
