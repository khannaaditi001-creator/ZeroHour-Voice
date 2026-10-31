import React from 'react';
import { X, CheckCircle, AlertTriangle, Stethoscope, Bed, FileText, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Spot Warning Signs',
      icon: AlertTriangle,
      desc: 'Aggregates ER visitor counts, fever reducer sales spikes from local pharmacies, and alerts you to which specific clinic is overcrowded.',
    },
    {
      num: 2,
      title: 'Identify the Illness',
      icon: Stethoscope,
      desc: 'Shows top 3 diagnostic matches in plain English, tells frontline staff what PPE gear to wear, and fact-checks social media rumors.',
    },
    {
      num: 3,
      title: 'Check Hospital Supplies',
      icon: Bed,
      desc: 'Visualizes 14-day bed capacity, tests community safety measures (None / Targeted / Strict), and facilitates mutual aid equipment transfers.',
    },
    {
      num: 4,
      title: 'Action Plan',
      icon: FileText,
      desc: 'Synthesizes recommendations from health, logistics, and community leaders into 4 ready-to-print official notices.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">
              How ZEROHOUR Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In the first 24 hours of an outbreak, public health coordinators and local leaders need clear, fast, and simple guidance without deciphering raw technical code or alarmist rumors.
          </p>

          <div className="space-y-3 pt-2">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {s.num}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-medium flex items-center space-x-2 mt-4">
            <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Anti-misinformation rules are enforced across all insights and AI answers.</span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Got it, Let's Respond
          </button>
        </div>

      </div>
    </div>
  );
};
