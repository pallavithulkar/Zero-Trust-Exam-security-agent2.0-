import Dashboard from '../components/Dashboard';
import PhasePanel from '../components/PhasePanel';
import RobotMascot from '../components/RobotMascot';
import LiveProcessLog from '../components/LiveProcessLog';
import ActionButtons from '../components/ActionButtons';
import AdminView from '../components/AdminView';

export default function AdminDashboard({
  currentRole = "Operations Admin",
  systemStatus = "SECURE",
  currentPhase = 1,
  phaseStatuses = {},
  robotState = "idle",
  speakTrigger = "",
  speechText = "",
  logs = [],
  vaultData = [],
  ledgerData = [],
  watchdogActive = false,
  watchdogStatus = "IDLE",
  watchdogTimeLeft = 10,
  approvalTime = "",
  approvalNotes = "",
  generateState = "idle",
  committee1Signed = false,
  committee2Signed = false,
  deployState = "idle",
  ledgerIntegrity = true,
  onGenerate = () => {},
  onApproveCommittee1 = () => {},
  onApproveCommittee2 = () => {},
  onDeploy = () => {},
  onRunAutoPipeline = () => {},
  isAutopilotRunning = false,
  onSimulateTamper = () => {},
  onResetDatabase = () => {},
  onAddLedgerRow = () => {},
  onTamperLedger = () => {},
  pipelineState = "idle",
  activeSession = null
}) {
  return (
    <Dashboard systemStatus={systemStatus} currentRole={currentRole}>
      
      {/* ROW 1 COLUMN 1: SECURITY WORKFLOW (LEFT) */}
      <div className="lg:col-span-3">
        <PhasePanel currentPhase={currentPhase} phaseStatuses={phaseStatuses} systemStatus={systemStatus} />
      </div>

      {/* ROW 1 COLUMN 2: MASCOT & LOGS (CENTER) */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        <RobotMascot 
          state={robotState} 
          speakTrigger={speakTrigger} 
          speechText={speechText} 
        />
        <LiveProcessLog logs={logs} />
      </div>

      {/* ROW 1 COLUMN 3: PIPELINE CONTROLS (RIGHT) */}
      <div className="lg:col-span-4">
        <ActionButtons
          onGenerate={onGenerate}
          onApproveCommittee1={onApproveCommittee1}
          onApproveCommittee2={onApproveCommittee2}
          onDeploy={onDeploy}
          onRunAutoPipeline={onRunAutoPipeline}
          isAutopilotRunning={isAutopilotRunning}
          generateState={generateState}
          committee1Signed={committee1Signed}
          committee2Signed={committee2Signed}
          deployState={deployState}
          approvalNotes={approvalNotes}
          approvalTime={approvalTime}
          currentPhase={currentPhase}
        />
      </div>

      {/* ROW 2: FULL-WIDTH TELEMETRY & VAULT DATABASE INSPECTOR */}
      <div className="lg:col-span-12 mt-4">
        <div className="bg-[#0E1528]/80 border border-slate-800 rounded-lg p-5 cyber-border-glow shadow-xl backdrop-blur-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 select-none">
            <h2 className="text-base font-cyber text-white tracking-widest flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-cyan animate-pulse"></span>
              SECURE DATABASE INSPECTION OPERATIONS
            </h2>
            <span className="text-[9px] bg-teal-cyan/10 text-teal-cyan px-2 py-0.5 rounded border border-teal-cyan/20 font-mono">
              DB PORTAL
            </span>
          </div>

          <AdminView
            vaultData={vaultData}
            ledgerData={ledgerData}
            watchdogActive={watchdogActive}
            watchdogStatus={watchdogStatus}
            watchdogTimeLeft={watchdogTimeLeft}
            onSimulateTamper={onSimulateTamper}
            onResetDatabase={onResetDatabase}
            onAddLedgerRow={onAddLedgerRow}
            ledgerIntegrity={ledgerIntegrity}
            onTamperLedger={onTamperLedger}
            pipelineState={pipelineState}
            activeSession={activeSession}
            committee1Signed={committee1Signed}
            committee2Signed={committee2Signed}
            approvalTime={approvalTime}
            phaseStatuses={phaseStatuses}
            logs={logs}
          />
        </div>
      </div>

    </Dashboard>
  );
}
