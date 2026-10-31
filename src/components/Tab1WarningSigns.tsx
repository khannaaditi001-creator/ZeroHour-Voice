import React from 'react';
import { 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Building2, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Tab1WarningSigns as Tab1Data } from '../types';

interface Tab1WarningSignsProps {
  data: Tab1Data;
  onNextTab: () => void;
}

export const Tab1WarningSigns: React.FC<Tab1WarningSignsProps> = ({ data, onNextTab }) => {
  return (
    <div className="space-y-6">
      
      {/* Plain English Takeaway Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
            What This Means in Plain English
          </h3>
          <p className="text-sm sm:text-base text-amber-950 font-medium mt-1 leading-relaxed">
            {data.plainEnglishTakeaway}
          </p>
        </div>
      </div>

      {/* Grid of Key Warning Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: ER Patient Visits */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hospital ER Visits
              </span>
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {data.erVisits24h}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                patients / 24h
              </span>
            </div>

            <div className="mt-3 flex items-center space-x-2 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{data.erIncreasePercent}% higher than normal baseline ({data.erVisitsBaseline} avg)</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
            Emergency rooms are receiving influx at more than double regular Saturday volume.
          </p>
        </div>

        {/* Card 2: Main Symptoms Reported */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Main Reported Symptoms (ER Triage Intake)
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Based on incoming patient charts
            </span>
          </div>

          <div className="space-y-3">
            {data.topSymptoms.map((symp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-slate-800">{symp.name}</span>
                  <span className="font-bold text-teal-700">{symp.percentage}% of patients</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${symp.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">{symp.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Pharmacy Spikes & Overcrowded Clinic Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Pharmacy Sales Spikes Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Local Pharmacy Medicine Sales Spikes
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Demand Surge
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Early signals from cash register transactions at neighborhood pharmacies:
          </p>

          <div className="space-y-2.5">
            {data.pharmacySpikes.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                    {item.item}
                  </p>
                  <span className={`text-[11px] font-medium ${
                    item.status.includes('Low') || item.status.includes('Sold Out')
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800">
                    +{item.changePercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Clinic Overcrowding Visual Alert */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Local Clinic Capacity & Wait Times
              </h3>
            </div>
            <span className="text-xs text-slate-400">Live Telemetry</span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Real-time occupancy across urgent care centers and regional clinics:
          </p>

          <div className="space-y-3">
            {data.clinicAlerts.map((clinic, idx) => {
              const isOvercrowded = clinic.capacityPercent > 100;
              const isNearLimit = clinic.capacityPercent >= 80 && clinic.capacityPercent <= 100;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isOvercrowded
                      ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400/30'
                      : isNearLimit
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {clinic.name}
                        </span>
                        {isOvercrowded && (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                            <AlertCircle className="w-2.5 h-2.5" />
                            <span>Overcrowded Alert</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Wait Time: <strong className="text-slate-800">{clinic.currentWaitTime}</strong></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-extrabold ${
                        isOvercrowded ? 'text-rose-700' : isNearLimit ? 'text-amber-700' : 'text-emerald-700'
                      }`}>
                        {clinic.capacityPercent}%
                      </span>
                      <p className="text-[10px] text-slate-500 font-medium">Capacity</p>
                    </div>
                  </div>

                  {/* Visual Capacity Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        isOvercrowded ? 'bg-rose-600' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(clinic.capacityPercent, 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 font-medium">
                    ↳ Action: {clinic.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Step Forward Button */}
      <div className="flex items-center justify-end pt-3">
        <button
          onClick={onNextTab}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
        >
          <span>Continue to Step 2: Identify the Illness</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
