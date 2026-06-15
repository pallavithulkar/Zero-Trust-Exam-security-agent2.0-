import { useState } from 'react';

export default function OfficialExamPaper({ activeSession, generatedVariants }) {
  const [selectedVariant, setSelectedVariant] = useState("A");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const questions = generatedVariants?.variants?.[selectedVariant]?.questions || [];

  if (!questions || questions.length === 0) return null;

  const handlePrint = () => {
    // Inject temporary print style to print only the exam sheet
    const printStyle = document.createElement('style');
    printStyle.id = 'temp-print-style';
    printStyle.innerHTML = `
      @media print {
        body {
          background: white !important;
          color: black !important;
        }
        body > * {
          display: none !important;
        }
        #print-target-sheet {
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          padding: 20px !important;
          margin: 0 !important;
          background: white !important;
          color: black !important;
          border: none !important;
          box-shadow: none !important;
        }
        .no-print {
          display: none !important;
        }
        .print-text-black {
          color: black !important;
        }
        .print-border-black {
          border-color: black !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    window.print();
    // Cleanup style after print dialog close
    setTimeout(() => {
      const el = document.getElementById('temp-print-style');
      if (el) el.remove();
    }, 1000);
  };

  const boardName = activeSession?.board || "NTA";
  const examCode = activeSession?.exam_code || "EXAM-2026";
  const subjectName = activeSession?.subject || "General Science";

  const renderPaperBody = (isModal = false) => (
    <div 
      id={isModal ? "print-target-sheet" : undefined}
      className={`relative bg-[#FAF6EE] text-slate-900 border-4 border-double border-slate-800 p-6 md:p-8 font-serif shadow-2xl select-text overflow-hidden ${
        isModal ? 'w-full max-w-3xl mx-auto my-4 min-h-[90vh]' : 'w-full'
      }`}
      style={{
        backgroundImage: 'radial-gradient(#e5dbcc 1px, transparent 0)',
        backgroundSize: '24px 24px',
        backgroundColor: '#FAF6EE'
      }}
    >
      {/* DIAGONAL WATERMARK */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06] text-slate-800 uppercase tracking-widest text-4xl sm:text-6xl font-sans font-black rotate-[-35deg]"
        style={{ zIndex: 0 }}
      >
        {boardName} CONFIDENTIAL {boardName}
      </div>

      <div className="relative z-10 space-y-6">
        {/* TOP CLASSIFICATION STAMP */}
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2 text-xs font-sans font-bold uppercase tracking-wider text-slate-700">
          <span className="px-2 py-0.5 border border-slate-700 rounded bg-[#FAF6EE]">CONFIDENTIAL</span>
          <span className="text-red-800 font-extrabold animate-pulse">VARIANT - {selectedVariant}</span>
          <span className="px-2 py-0.5 border border-slate-700 rounded bg-[#FAF6EE] text-slate-800">ZERO-TRUST ENCRYPTED</span>
        </div>

        {/* OFFICIAL MAIN LOGO / HEADER */}
        <div className="text-center space-y-1 py-2 select-none">
          <h1 className="text-xl md:text-2xl font-black tracking-wide text-slate-900 font-sans uppercase">
            {boardName === 'NTA' ? 'NATIONAL TESTING AGENCY (NTA)' : boardName}
          </h1>
          <p className="text-xs md:text-sm font-bold uppercase text-slate-700 tracking-widest">
            OFFICIAL SECURE EXAMINATION SYSTEM
          </p>
          <div className="h-0.5 w-32 bg-slate-800 mx-auto mt-2"></div>
        </div>

        {/* METADATA SHEET ROW */}
        <div className="grid grid-cols-2 gap-4 border-2 border-slate-800 p-3 bg-white/70 text-xs sm:text-sm font-sans">
          <div>
            <p className="font-bold"><span className="text-slate-500">EXAM CODE:</span> {examCode}</p>
            <p className="font-bold mt-1"><span className="text-slate-500">SUBJECT:</span> {subjectName}</p>
          </div>
          <div className="text-right">
            <p className="font-bold"><span className="text-slate-500">MAXIMUM MARKS:</span> 100</p>
            <p className="font-bold mt-1"><span className="text-slate-500">TIME ALLOWED:</span> 3 HOURS</p>
          </div>
        </div>

        {/* GENERAL INSTRUCTIONS */}
        <div className="border-b border-dashed border-slate-850 pb-4 text-[11px] sm:text-xs leading-relaxed text-slate-800">
          <p className="font-sans font-bold uppercase text-slate-900 mb-1 select-none">General Instructions:</p>
          <ol className="list-decimal pl-4 space-y-0.5 font-sans">
            <li>This question paper variant contains exactly 5 multiple choice questions.</li>
            <li>All questions are compulsory and carry equal marks (20 marks each).</li>
            <li>Each question has four alternative options. Choose the most appropriate one.</li>
            <li>Answers are stored as SHA-256 blocks and verified against the secure ledger.</li>
          </ol>
        </div>

        {/* QUESTIONS SECTIONS */}
        <div className="space-y-6 pt-2">
          {questions.map((q, idx) => (
            <div key={q.id || idx} className="space-y-2.5">
              <div className="flex gap-2">
                <span className="font-bold font-serif text-sm sm:text-base text-slate-950">Q.{idx+1}</span>
                <p className="font-serif text-sm sm:text-base text-slate-900 leading-normal font-semibold">
                  {q.text}
                  <span className="ml-2 px-1.5 py-0.5 rounded border border-slate-300 bg-white/60 text-[9px] font-sans font-medium text-slate-600 tracking-wide uppercase select-none">
                    {q.difficulty}
                  </span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 text-xs sm:text-sm font-sans">
                {q.options.map((opt, oIdx) => (
                  <div 
                    key={oIdx} 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
                      opt === q.correct 
                        ? 'border-green-800/40 bg-green-800/5 font-semibold text-green-900 shadow-sm' 
                        : 'border-slate-300 bg-white/40 hover:bg-white/70'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold bg-white text-slate-800 select-none">
                      {oIdx + 1}
                    </span>
                    <span>{opt}</span>
                    {opt === q.correct && (
                      <span className="ml-auto text-[9px] text-green-800 font-bold tracking-wider uppercase select-none">
                        [KEY]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SIGNATURE FIELDS AT BOTTOM */}
        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-300 text-[10px] font-sans select-none text-slate-650">
          <div>
            <p className="w-40 border-b border-slate-700 h-8"></p>
            <p className="mt-1 font-bold uppercase">Candidate's Signature</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="px-3 py-1 border border-dashed border-red-700/50 rounded bg-[#FAF6EE] text-red-800 font-bold uppercase tracking-wider text-[8px] rotate-[-2deg]">
              APPROVED & VAULTED
            </div>
            <p className="mt-2 font-bold uppercase">Controller of Examinations</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-3">
      {/* CARD COMPONENT HEADER & CONTROLS */}
      <div className="flex justify-between items-center border-b border-slate-850 pb-2 select-none">
        <h3 className="text-xs font-cyber text-slate-400 tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-cyan animate-pulse"></span>
          OFFICIAL EXAM PREVIEW SHEETS ({activeSession?.exam_code})
        </h3>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-2 py-0.5 bg-teal-cyan/15 hover:bg-teal-cyan/25 border border-teal-cyan/35 hover:border-teal-cyan text-teal-cyan rounded text-[9px] font-cyber tracking-wider uppercase transition-colors cursor-pointer mr-2"
          >
            🔎 Full Screen
          </button>

          {["A", "B", "C"].map(v => (
            <button
              key={v}
              onClick={() => setSelectedVariant(v)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                selectedVariant === v
                  ? "bg-teal-cyan text-slate-900"
                  : "bg-[#0A0E1A] text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* COMPACT CARD VIEW OF SHEET */}
      <div className="max-h-[200px] overflow-y-auto rounded border border-slate-800 shadow-inner">
        {renderPaperBody(false)}
      </div>

      <div className="text-[9px] font-mono text-slate-500 border-t border-slate-900 pt-2 select-none flex justify-between">
        <span>EXPORTS DECENTRALIZED POOLS: BLIND CONCATENATED</span>
        <span className="text-teal-cyan cursor-pointer hover:underline" onClick={() => setIsFullscreen(true)}>
          CLICK TO FULL VIEW
        </span>
      </div>

      {/* FULL SCREEN MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] overflow-y-auto flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl flex flex-col space-y-4">
            
            {/* Modal Controls */}
            <div className="flex justify-between items-center bg-[#0F1424] border border-slate-800 p-3 rounded-lg no-print select-none shadow-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-cyber text-white tracking-widest uppercase">
                  🔍 NTA OFFICIAL PRINT SYSTEM
                </span>
                
                {/* Variant buttons in modal */}
                <div className="flex space-x-1">
                  {["A", "B", "C"].map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                        selectedVariant === v
                          ? "bg-teal-cyan text-slate-900"
                          : "bg-[#0A0E1A] text-slate-400 hover:text-slate-200 border border-slate-800"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1 bg-green-success/15 hover:bg-green-success/25 border border-green-success/45 hover:border-green-success text-white rounded font-cyber text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-3.5 py-1 bg-red-alert/15 hover:bg-red-alert/25 border border-red-alert/45 hover:border-red-alert text-white rounded font-cyber text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  ❌ Close
                </button>
              </div>
            </div>

            {/* Modal Exam Sheet Body */}
            <div className="overflow-x-auto shadow-2xl rounded-lg">
              {renderPaperBody(true)}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
