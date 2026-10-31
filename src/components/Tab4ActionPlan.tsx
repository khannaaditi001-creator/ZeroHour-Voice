import React, { useState } from 'react';
import { 
  Stethoscope, 
  Truck, 
  Building2, 
  FileCheck2, 
  Printer, 
  Copy, 
  Volume2, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  Share2,
  CheckCircle2
} from 'lucide-react';
import { Tab4ActionPlan as Tab4Data, ReadyDocument } from '../types';

interface Tab4ActionPlanProps {
  data: Tab4Data;
  onPrevTab: () => void;
  onOpenDocument: (doc: ReadyDocument) => void;
}

export const Tab4ActionPlan: React.FC<Tab4ActionPlanProps> = ({
  data,
  onPrevTab,
  onOpenDocument,
}) => {
  const [documentsGenerated, setDocumentsGenerated] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('health') || role.toLowerCase().includes('epidemiologist')) {
      return Stethoscope;
    }
    if (role.toLowerCase().includes('supply') || role.toLowerCase().includes('logistics')) {
      return Truck;
    }
    return Building2;
  };

  const handleCopy = (doc: ReadyDocument) => {
    navigator.clipboard.writeText(`${doc.title}\n\n${doc.fullText}`);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeak = (doc: ReadyDocument) => {
    if ('speechSynthesis' in window) {
      if (speakingId === doc.id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${doc.title}. ${doc.summary}. ${doc.fullText}`);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(doc.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 3 Simple Perspective Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Multi-Stakeholder Consensus
            </span>
            <span className="text-xs text-slate-500">
              Clear 2-sentence recommendations from key leads
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Leadership Perspectives & Consensus
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {data.perspectives.map((item, idx) => {
            const Icon = getRoleIcon(item.role);

            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                        {item.role}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Verified Recommendation
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-teal-500 pl-3 py-1 my-2 leading-relaxed">
                    "{item.quote}"
                  </blockquote>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Approved for 24h Directive</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Big Green Generation Action Bar */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-center shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-emerald-950 mb-1">
          Turn Analysis into Instant Real-World Action
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-2xl mx-auto mb-4">
          All four emergency notices are calibrated to plain English so public health officers, hospital couriers, and families have zero confusion.
        </p>

        <button
          onClick={() => setDocumentsGenerated(true)}
          className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate Ready-to-Send Documents</span>
        </button>
      </div>

      {/* 4 Clean Printable Cards */}
      {documentsGenerated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-teal-600" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                4 Ready-to-Send Emergency Documents
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Printable & Plain English
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.readyDocuments.map((doc, idx) => {
              const isSpeaking = speakingId === doc.id;
              const isCopied = copiedId === doc.id;

              return (
                <div
                  key={doc.id || idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    {/* Header with category and audience */}
                    <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {doc.category}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base mt-1.5 leading-snug">
                          {doc.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 text-right">
                        For: {doc.audience}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mb-3">
                      {doc.summary}
                    </p>

                    {/* Clean preview box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono whitespace-pre-line max-h-40 overflow-y-auto leading-relaxed">
                      {doc.fullText}
                    </div>
                  </div>

                  {/* Document Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    
                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full View & Print</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSpeak(doc)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          isSpeaking
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                        title="Read aloud for hands-busy staff"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isSpeaking ? 'Playing...' : 'Listen'}</span>
                      </button>

                      <button
                        onClick={() => handleCopy(doc)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                        title="Copy text to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onPrevTab}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospital Supplies</span>
        </button>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">All 4 Response Steps Complete</span>
          <span className="text-xs font-bold text-emerald-700">Directive Ready for Emergency Broadcast</span>
        </div>
      </div>

    </div>
  );
};
