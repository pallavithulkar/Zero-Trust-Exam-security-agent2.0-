import Dashboard from '../components/Dashboard';
import PhasePanel from '../components/PhasePanel';
import RobotMascot from '../components/RobotMascot';
import LiveProcessLog from '../components/LiveProcessLog';
import OfficialExamPaper from '../components/OfficialExamPaper';

export default function ApproverView({
  currentRole = "Committee 2 - Approver",
  systemStatus = "SECURE",
  currentPhase = 3,
  phaseStatuses = {},
  robotState = "idle",
  speakTrigger = "",
  speechText = "",
  logs = [],
  activeSession = null,
  generatedVariants = null,
  criticReport = null,
  approvalStatus = "PENDING",
  onApprove = () => {},
  onReject = () => {}
}) {
  return (
    <Dashboard systemStatus={systemStatus} currentRole={currentRole}>
      
      {/* COLUMN 1: WORKFLOW PHASES (LEFT) */}
      <div className="lg:col-span-3">
        <PhasePanel currentPhase={currentPhase} phaseStatuses={phaseStatuses} systemStatus={systemStatus} />
      </div>

      {/* COLUMN 2: ROBOT & MONITOR LOGS (CENTER) */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        <RobotMascot 
          state={robotState} 
          speakTrigger={speakTrigger} 
          speechText={speechText} 
        />
        <LiveProcessLog logs={logs} />
      </div>

      {/* COLUMN 3: APPROVER REVIEW BOARD (RIGHT) */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        
        {/* COMPLIANCE AUDIT SCORECARD CARD */}
        <div className="bg-[#0E1528]/85 border border-slate-800 rounded-lg p-5 cyber-border-glow shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 select-none">
              <h2 className="text-base font-cyber text-white tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-alert animate-pulse"></span>
                COMMITTEE 2: REVIEW BOARD
              </h2>
              <span className="text-[9px] bg-red-alert/10 text-red-alert px-2 py-0.5 rounded border border-red-alert/20 font-mono">
                AUDIT REPORT
              </span>
            </div>

            {criticReport ? (
              <div className="space-y-3 font-mono text-xs select-text">
                {/* Score badge */}
                <div className="flex items-center justify-between bg-[#0A0E1A] p-3 rounded-lg border border-slate-900 select-none">
                  <span className="text-[10px] text-slate-400 font-cyber tracking-widest uppercase">CRITIC SECURITY SCORE</span>
                  <div className="text-right">
                    <span className={`text-2xl font-bold font-cyber ${
                      criticReport.total_score >= 7.0 ? 'text-green-success' : 'text-red-alert'
                    }`}>
                      {criticReport.total_score.toFixed(1)}
                    </span>
                    <span className="text-slate-600 text-[10px]"> / 10</span>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="space-y-1.5 bg-[#070B14] p-3 rounded border border-slate-950 select-none">
                  <span className="text-[9px] text-slate-500 font-semibold block uppercase mb-1">METRIC DETAILS:</span>
                  <div className="flex justify-between">
                    <span>SYLLABUS COMPLIANCE:</span>
                    <span className="text-white font-semibold">{criticReport.breakdown.syllabus_compliance.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DIFFICULTY ALIGNMENT:</span>
                    <span className="text-white font-semibold">{criticReport.breakdown.difficulty_distribution.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PYQ PLAGIARISM CHECK:</span>
                    <span className="text-white font-semibold">{criticReport.breakdown.pyq_plagiarism_check.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>QUESTION DE-DUPLICATION:</span>
                    <span className="text-white font-semibold">{criticReport.breakdown.question_redundancy.toFixed(1)}/10</span>
                  </div>
                </div>

                {/* Issues list log */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-semibold block uppercase select-none">CRITIC RECOMMENDATIONS:</span>
                  <ul className="text-[10px] space-y-1 text-slate-400 max-h-[85px] overflow-y-auto bg-[#070B14] p-2 rounded border border-slate-950 select-text leading-tight">
                    {criticReport.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-teal-cyan font-bold select-none">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Approve/Reject Controls (Click 2) */}
                {approvalStatus === "CONFIRMED" && (
                  <div className="grid grid-cols-2 gap-2 pt-2 select-none">
                    <button
                      onClick={onApprove}
                      className="py-2.5 bg-green-success/15 hover:bg-green-success/25 border border-green-success/45 hover:border-green-success text-white rounded font-cyber text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(34,180,102,0.1)] hover:shadow-[0_0_20px_rgba(34,180,102,0.25)] text-center cursor-pointer"
                    >
                      👍 APPROVE
                    </button>
                    <button
                      onClick={onReject}
                      className="py-2.5 bg-red-alert/15 hover:bg-red-alert/25 border border-red-alert/45 hover:border-red-alert text-white rounded font-cyber text-xs tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(212,60,60,0.2)] text-center cursor-pointer"
                    >
                      👎 REJECT
                    </button>
                  </div>
                )}

                {approvalStatus === "PENDING" && (
                  <div className="bg-[#0A0E1A] border border-slate-900 rounded-lg p-3 text-center text-slate-500 font-cyber font-bold tracking-widest uppercase py-3.5 select-none">
                    ⏳ AWAITING SETTER SIGN-OFF
                  </div>
                )}

                {approvalStatus === "APPROVED" && (
                  <div className="bg-[#22B466]/10 border border-[#22B466]/30 rounded-lg p-3 text-center text-green-success font-cyber font-bold tracking-widest uppercase py-3.5 select-none animate-pulse">
                    🔑 FINAL SIGNATURE APPROVED
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-xs font-mono text-slate-500 select-none">
                [AWAITING REPORT] 
                <p className="text-[10px] text-slate-650 mt-2">
                  No audit report compiled. Please generate variants under Setter Portal first.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* VARIANT VISUAL PREVIEW CARD */}
        {generatedVariants && (
          <div className="bg-[#0E1528]/85 border border-slate-800 rounded-lg p-5 cyber-border-glow shadow-xl backdrop-blur-md flex-grow flex flex-col justify-between">
            <OfficialExamPaper 
              activeSession={activeSession} 
              generatedVariants={generatedVariants} 
            />
          </div>
        )}

      </div>

    </Dashboard>
  );
}
