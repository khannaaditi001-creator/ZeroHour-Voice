import React from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Share2, 
  Shield, 
  HelpCircle,
  Pill
} from 'lucide-react';
import { Tab2IdentifyIllness as Tab2Data } from '../types';

interface Tab2IdentifyIllnessProps {
  data: Tab2Data;
  onPrevTab: () => void;
  onNextTab: () => void;
  onOpenFactChecker: () => void;
}

export const Tab2IdentifyIllness: React.FC<Tab2IdentifyIllnessProps> = ({
  data,
  onPrevTab,
  onNextTab,
  onOpenFactChecker,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top 3 Likely Causes Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Diagnostic Match
              </span>
              <span className="text-xs text-slate-500">
                Comparing symptoms against regional disease patterns
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Top 3 Most Likely Causes
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            Plain English Clinical Synthesis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {data.likelyCauses.map((cause, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isTop
                    ? 'bg-teal-50/60 border-teal-300 ring-2 ring-teal-500/20'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500">
                      Rank #{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                        isTop
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cause.matchPercent}% Match
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug mb-2">
                    {cause.name}
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-0.5">
                        What it means:
                      </span>
                      <p className="text-slate-700">{cause.plainEnglish}</p>
                    </div>

                    <div className="text-xs text-slate-600 pt-1">
                      <strong className="text-slate-800">How it spreads: </strong>
                      {cause.spreadMethod}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span>Duration: <strong className="text-slate-700">{cause.duration}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Gear & Rumor Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Safety Gear Needed for Doctors & Nurses */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Safety Gear Doctors & Nurses Need
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Protection Protocol
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Recommended personal protective equipment (PPE) for clinical intake desks and triage staff:
          </p>

          <div className="space-y-3">
            {data.safetyGearNeeded.map((gear, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {gear.item}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        gear.priority === 'Essential'
                          ? 'bg-rose-100 text-rose-800'
                          : gear.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {gear.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {gear.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rumor & Panic-Buying Alert (Anti-Misinformation Guard) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Rumor & Panic-Buying Alert
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                Anti-Misinformation
              </span>
            </div>

            <div className="space-y-3.5">
              
              {/* Rumor Detected */}
              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                  ⚠️ False Rumor Detected Online:
                </span>
                <p className="text-xs sm:text-sm font-medium text-rose-950">
                  "{data.panicBuyingAndRumorAlert.rumorDetected}"
                </p>
              </div>

              {/* Verified Medical Fact */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  ✅ Verified Medical Fact:
                </span>
                <p className="text-xs sm:text-sm font-medium text-emerald-950">
                  {data.panicBuyingAndRumorAlert.debunkFact}
                </p>
              </div>

              {/* Pharmacy Directive */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                <Pill className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-0.5">
                    Action For Local Pharmacies:
                  </span>
                  <p className="text-xs text-slate-600">
                    {data.panicBuyingAndRumorAlert.pharmacyDirective}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Heard another rumor?</span>
            <button
              onClick={onOpenFactChecker}
              className="font-bold text-teal-700 hover:text-teal-800 underline cursor-pointer"
            >
              Verify with AI Fact-Checker →
            </button>
          </div>
        </div>

      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-3">
        <button
          onClick={onPrevTab}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Warning Signs</span>
        </button>

        <button
          onClick={onNextTab}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
        >
          <span>Continue to Step 3: Check Hospital Supplies</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
