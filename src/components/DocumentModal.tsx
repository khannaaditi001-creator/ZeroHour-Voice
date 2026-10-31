import React, { useState } from 'react';
import { X, Printer, Copy, Volume2, Check, Download, ShieldCheck, FileText } from 'lucide-react';
import { ReadyDocument } from '../types';

interface DocumentModalProps {
  document: ReadyDocument | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${document.title}\n\n${document.fullText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${document.title}. ${document.fullText}`);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                {document.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {document.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Printable Notice Body */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* Header Banner */}
          <div className="border-b-2 border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                OFFICIAL OUTBREAK DIRECTIVE • EMERGENCY RESPONSE DESK
              </h2>
              <p className="text-lg font-black text-slate-900 mt-0.5">
                {document.title}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-bold text-slate-800">Target Audience:</p>
              <p>{document.audience}</p>
            </div>
          </div>

          {/* Formatted Text Content */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-line leading-relaxed">
            {document.fullText}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Validated by ZEROHOUR Clinical Protocol System • Plain English Verified</span>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeak}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                speaking
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{speaking ? 'Stop Speech' : 'Listen'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied Text</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Notice</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
