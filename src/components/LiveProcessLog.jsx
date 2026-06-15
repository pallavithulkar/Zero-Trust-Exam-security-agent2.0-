import { useEffect, useRef } from 'react';

export default function LiveProcessLog({ logs = [] }) {
  const containerRef = useRef(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#090D1A]/95 border border-slate-850 rounded-lg p-4 flex flex-col justify-between cyber-border-glow shadow-xl h-[330px] font-mono">
      {/* Title block */}
      <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-2 select-none">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-alert animate-ping" />
          <span className="text-xs font-cyber text-white tracking-widest">LIVE PROCESS LOG</span>
        </div>
        <span className="text-[10px] text-teal-cyan/80 bg-teal-cyan/5 px-2 py-0.5 rounded border border-teal-cyan/10">
          Agent Feed Active
        </span>
      </div>

      {/* Log list area */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-y-auto space-y-1 pr-1 text-xs select-text text-slate-300"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-8 text-center">
            No pipeline events logged. Select a role and trigger a transaction.
          </div>
        ) : (
          logs.map((log, index) => {
            // Check if log content contains OK, SECURE, FAIL, BREACH or WARNING to apply color highlights
            let statusBadge = null;
            let logText = log.text;

            if (log.text.endsWith("OK")) {
              statusBadge = <span className="text-green-success font-semibold float-right">OK</span>;
              logText = log.text.slice(0, -2);
            } else if (log.text.endsWith("SECURE")) {
              statusBadge = <span className="text-green-success font-bold float-right">SECURE</span>;
              logText = log.text.slice(0, -6);
            } else if (log.text.endsWith("FAILED")) {
              statusBadge = <span className="text-red-alert font-bold float-right animate-pulse">FAILED</span>;
              logText = log.text.slice(0, -6);
            } else if (log.text.endsWith("BREACH")) {
              statusBadge = <span className="text-red-alert font-extrabold float-right animate-pulse">BREACH</span>;
              logText = log.text.slice(0, -6);
            } else if (log.text.endsWith("WARNING")) {
              statusBadge = <span className="text-gold-accent font-semibold float-right animate-pulse">WARNING</span>;
              logText = log.text.slice(0, -7);
            }

            // Determine if line itself is error/warning style
            let lineClass = "text-slate-350";
            if (logText.includes("❌") || logText.includes("Breach") || logText.includes("lockdown")) {
              lineClass = "text-red-alert/90 font-medium";
            } else if (logText.includes("⚠️") || logText.includes("Warning")) {
              lineClass = "text-gold-accent/90";
            } else if (logText.includes("✅") || logText.includes("encrypted") || logText.includes("Vault")) {
              lineClass = "text-green-success/90";
            } else if (logText.includes("[DISCOVERY]") || logText.includes("[GENERATOR]") || logText.includes("[CRITIC]")) {
              lineClass = "text-slate-300";
            }

            return (
              <div key={index} className={`py-0.5 leading-5 border-b border-slate-900/20 hover:bg-[#111A30]/40 px-1 rounded transition-colors ${lineClass}`}>
                <span className="text-teal-cyan/60 mr-2 text-[11px] select-none font-mono">[{log.timestamp}]</span>
                <span className="tracking-wide select-text">{logText}</span>
                {statusBadge}
              </div>
            );
          })
        )}
      </div>

      {/* Terminal prompt bar */}
      <div className="mt-2 pt-2 border-t border-slate-850 flex items-center text-xs text-red-alert font-mono select-none">
        <span className="mr-1.5 animate-pulse text-red-alert">&gt;</span>
        <span className="animate-pulse tracking-wide text-red-alert/90">Monitoring zero-trust pipeline...</span>
      </div>
    </div>
  );
}
