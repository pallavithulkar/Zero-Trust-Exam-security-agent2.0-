import { useEffect, useRef, useState } from 'react';

/**
 * Robot Mascot Component
 * @param {string} state - "idle" | "processing" | "success" | "alert"
 * @param {string} speakTrigger - changes to this will trigger speech synthesis
 * @param {string} speechText - text to speak aloud when speakTrigger updates
 */
export default function RobotMascot({ state = "idle", speakTrigger = "", speechText = "" }) {
  const previousTriggerRef = useRef("");
  const [transparentSrc, setTransparentSrc] = useState("/robot.png");

  // Dynamic black background remover (chroma keying)
  useEffect(() => {
    const img = new Image();
    img.src = "/robot.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          const maxVal = Math.max(r, g, b);
          if (maxVal < 22) {
            data[i+3] = 0; // Pure black background pixels -> transparent
          } else if (maxVal < 50) {
            // Anti-aliasing blend for borders
            const ratio = (maxVal - 22) / 28;
            data[i+3] = Math.round(data[i+3] * ratio);
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        setTransparentSrc(canvas.toDataURL());
      } catch (err) {
        console.error("Canvas read error, fallback to CSS blend-mode:", err);
      }
    };
  }, []);

  // Speak function using Web Speech API
  const speak = (text) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      // Cancel current speech to prevent queue build-up
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a nice female English voice (Zira, Samantha, Hazel, or Google US English)
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        return lang.includes('en') && (
          name.includes('zira') || 
          name.includes('samantha') || 
          name.includes('hazel') || 
          name.includes('female') || 
          name.includes('google us english')
        );
      }) || voices.find(v => v.lang.includes('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.pitch = 1.1; // slightly higher pitch for a clear female voice
      utterance.rate = 0.95; // slightly slower for clearer speech
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis API is not supported in this browser.");
    }
  };

  // Trigger speech when parent changes the trigger token
  useEffect(() => {
    if (speakTrigger && speakTrigger !== previousTriggerRef.current) {
      speak(speechText);
      previousTriggerRef.current = speakTrigger;
    }
  }, [speakTrigger, speechText]);

  // Determine styling based on robot state
  let robotClass = "animate-float"; // idle float
  let glowColorClass = "border-teal-cyan/20 bg-slate-900/30";
  let statusGlowClass = "opacity-0";
  let borderGlowClass = "cyber-border-glow";
  let titleAccent = "text-teal-cyan";
  
  if (state === "processing") {
    robotClass = "animate-pulse-cyan animate-float";
    glowColorClass = "border-teal-cyan/50 bg-[#E5A93B]/5";
    statusGlowClass = "bg-teal-cyan/30 animate-ping opacity-100";
    borderGlowClass = "cyber-border-glow";
    titleAccent = "text-teal-cyan animate-pulse";
  } else if (state === "success") {
    robotClass = "animate-glow-green animate-float";
    glowColorClass = "border-green-success/50 bg-[#22B466]/5";
    statusGlowClass = "bg-green-success/30 animate-pulse opacity-100";
    borderGlowClass = "cyber-border-glow-green";
    titleAccent = "text-green-success";
  } else if (state === "alert") {
    robotClass = "animate-glow-red animate-shake"; // alert shake
    glowColorClass = "border-red-alert/60 bg-[#D43C3C]/5 animate-pulse";
    statusGlowClass = "bg-red-alert/40 animate-ping opacity-100";
    borderGlowClass = "cyber-border-glow-red";
    titleAccent = "text-red-alert";
  }

  return (
    <div className={`relative flex flex-col items-center justify-center border rounded-lg p-5 transition-all duration-500 overflow-hidden ${glowColorClass} ${borderGlowClass} h-[280px]`}>
      
      {/* Dynamic Halo Rings in the Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className={`absolute rounded-full border border-dashed w-48 h-48 transition-all duration-500 ${
          state === 'alert' ? 'border-red-alert animate-spin' :
          state === 'success' ? 'border-green-success animate-pulse' :
          state === 'processing' ? 'border-teal-cyan animate-spin' : 'border-teal-cyan/30'
        }`} />
        <div className={`absolute rounded-full border w-64 h-64 transition-all duration-500 ${
          state === 'alert' ? 'border-red-alert/20 animate-ping' :
          state === 'success' ? 'border-green-success/20' :
          state === 'processing' ? 'border-teal-cyan/20 animate-pulse' : 'border-teal-cyan/10'
        }`} />
      </div>

      {/* Mascot Label */}
      <div className="absolute top-3 left-4 flex items-center space-x-1.5 z-10 font-cyber text-xs tracking-widest text-slate-400">
        <span className={`w-2.5 h-2.5 rounded-full ${state === 'idle' ? 'bg-teal-cyan/50' : 'bg-teal-cyan'} ${statusGlowClass}`} />
        <span>THE AGENT : <span className={titleAccent}>{state.toUpperCase()}</span></span>
      </div>

      {/* Speech bubble indicator above robot */}
      <div className="absolute top-10 w-full flex justify-center z-15">
        <div className="relative bg-[#121B2F] border border-slate-750 text-slate-200 px-4 py-2 rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.4)] text-[11px] font-mono tracking-wide text-center max-w-[85%] select-text leading-tight after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-x-transparent after:border-b-transparent after:border-t-[#121B2F] animate-float">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-cyan animate-pulse mr-1.5"></span>
          <span>{speechText || "Sentinel online. Standing by for secure compilation instructions..."}</span>
        </div>
      </div>

      {/* Robot PNG Asset */}
      <div className="relative w-36 h-36 flex items-center justify-center select-none z-10 mt-6">
        <img
          src={transparentSrc}
          alt="Zero-Trust Exam Security Robot Mascot"
          className={`w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(229,169,59,0.3)] transition-all duration-500 ${robotClass}`}
          onError={(e) => {
            // Fallback SVG if image is not loaded
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="w-24 h-24 rounded-full border-4 border-teal-cyan flex items-center justify-center bg-slate-900 animate-pulse">
                <span class="text-teal-cyan font-bold font-cyber text-xl">ZT-BOT</span>
              </div>
            `;
          }}
        />
      </div>

      {/* Bottom glowing platform */}
      <div className={`w-28 h-2 rounded-full filter blur-md mt-4 transition-all duration-500 ${
        state === 'alert' ? 'bg-red-alert/60 animate-pulse' :
        state === 'success' ? 'bg-green-success/60' :
        state === 'processing' ? 'bg-teal-cyan/60 animate-ping' : 'bg-teal-cyan/20'
      }`} />
    </div>
  );
}
