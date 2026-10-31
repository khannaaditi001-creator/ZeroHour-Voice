import React from 'react';
import { AlertTriangle, Stethoscope, Bed, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface TabsNavProps {
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
}

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      index: 1,
      title: '1. Spot Warning Signs',
      subtitle: 'ER Surges & Overcrowded Clinics',
      icon: AlertTriangle,
      color: 'teal',
    },
    {
      index: 2,
      title: '2. Identify the Illness',
      subtitle: 'Likely Causes & Safety Gear',
      icon: Stethoscope,
      color: 'teal',
    },
    {
      index: 3,
      title: '3. Check Hospital Supplies',
      subtitle: '14-Day Beds & Equipment Transfers',
      icon: Bed,
      color: 'teal',
    },
    {
      index: 4,
      title: '4. Action Plan',
      subtitle: 'Expert Advice & Official Notices',
      icon: FileText,
      color: 'emerald',
    },
  ];

  return (
    <div className="mb-6">
      
      {/* Tab Navigation Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.index;
          const isPassed = activeTab > tab.index;

          return (
            <button
              key={tab.index}
              onClick={() => onTabChange(tab.index)}
              className={`text-left p-3 sm:p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-white border-teal-600 shadow-sm ring-2 ring-teal-500/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-600'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-teal-600" />
              )}
              
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isActive ? 'text-teal-900' : 'text-slate-800'
                      }`}
                    >
                      {tab.title}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate hidden sm:block">
                    {tab.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
