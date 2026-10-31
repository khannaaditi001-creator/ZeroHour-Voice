import React, { useState } from 'react';
import { 
  Bed, 
  Sliders, 
  Truck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Wind, 
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { Tab3HospitalSupplies as Tab3Data, NearbyTransfer } from '../types';

interface Tab3HospitalSuppliesProps {
  data: Tab3Data;
  onPrevTab: () => void;
  onNextTab: () => void;
  onRequestTransfer: (transfer: NearbyTransfer) => void;
  dispatchedHospitals: string[];
}

export const Tab3HospitalSupplies: React.FC<Tab3HospitalSuppliesProps> = ({
  data,
  onPrevTab,
  onNextTab,
  onRequestTransfer,
  dispatchedHospitals,
}) => {
  // 0: None, 1: Targeted, 2: Strict
  const [measureLevel, setMeasureLevel] = useState<number>(1);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const measureKey = measureLevel === 0 ? 'none' : measureLevel === 1 ? 'targeted' : 'strict';
  const currentProjection = data.projections[measureKey];
  const maxBedCapacity = data.totalAvailableBeds;

  // Chart coordinate calculation for clean SVG
  const chartWidth = 700;
  const chartHeight = 260;
  const paddingX = 45;
  const paddingY = 30;

  const yMax = Math.max(maxBedCapacity * 1.5, ...currentProjection.bedsNeeded, 450);
  const getY = (val: number) => {
    return chartHeight - paddingY - ((val / yMax) * (chartHeight - paddingY * 2));
  };

  const getX = (index: number) => {
    const totalDays = data.projectionDays.length;
    const step = (chartWidth - paddingX * 2) / (totalDays - 1);
    return paddingX + index * step;
  };

  // Build SVG path
  const points = currentProjection.bedsNeeded.map((val, idx) => ({
    x: getX(idx),
    y: getY(val),
    val,
    day: data.projectionDays[idx],
  }));

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpX2 = cpX1;
    return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;
  const capacityY = getY(maxBedCapacity);

  const exceedsCapacity = currentProjection.peakBeds > maxBedCapacity;
  const deficitBeds = exceedsCapacity ? currentProjection.peakBeds - maxBedCapacity : 0;

  return (
    <div className="space-y-6">
      
      {/* 14-Day Hospital Beds Chart & Measure Slider */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        
        {/* Header with Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                14-Day Predictive Model
              </span>
              <span className="text-xs text-slate-500">
                Patients Needing Beds vs. Available Beds
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Hospital Bed Capacity Forecast
            </h3>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block">Total Local Beds:</span>
              <strong className="text-slate-900 text-sm">{maxBedCapacity} Beds</strong>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block">Peak Demand:</span>
              <strong className={`text-sm ${exceedsCapacity ? 'text-rose-700' : 'text-emerald-700'}`}>
                {currentProjection.peakBeds} Beds
              </strong>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 ${
              exceedsCapacity
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {exceedsCapacity ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Deficit of {deficitBeds} Beds (Surge Overflow)</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Within Capacity Safe Margin (+{maxBedCapacity - currentProjection.peakBeds} beds free)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Slider Bar: Community Safety Measures */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Community Safety Measures (Move Slider to Test Impact):
              </label>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-md">
              Selected: {currentProjection.label}
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-3">
            {currentProjection.description}
          </p>

          {/* 3-Position Slider */}
          <div className="relative pt-1 pb-3">
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={measureLevel}
              onChange={(e) => setMeasureLevel(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            
            {/* Step Labels */}
            <div className="flex justify-between text-xs font-semibold text-slate-600 mt-2 px-1">
              <button
                type="button"
                onClick={() => setMeasureLevel(0)}
                className={`cursor-pointer text-left ${measureLevel === 0 ? 'text-teal-700 font-bold' : 'hover:text-slate-900'}`}
              >
                1. None (No Restrictions)
              </button>
              <button
                type="button"
                onClick={() => setMeasureLevel(1)}
                className={`cursor-pointer text-center ${measureLevel === 1 ? 'text-teal-700 font-bold' : 'hover:text-slate-900'}`}
              >
                2. Targeted (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setMeasureLevel(2)}
                className={`cursor-pointer text-right ${measureLevel === 2 ? 'text-teal-700 font-bold' : 'hover:text-slate-900'}`}
              >
                3. Strict (Gatherings Paused)
              </button>
            </div>
          </div>
        </div>

        {/* Clean Light-Mode SVG Chart */}
        <div className="mt-5 relative w-full overflow-x-auto">
          <div className="min-w-[650px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Background horizontal grid lines */}
              {[0, 100, 200, 300, 400, 500, 600].filter((val) => val <= yMax).map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94a3b8"
                      fontWeight="500"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area under Curve */}
              <path
                d={areaD}
                fill={exceedsCapacity ? 'url(#roseGradient)' : 'url(#tealGradient)'}
                opacity="0.3"
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Hospital Bed Capacity Threshold Line */}
              <line
                x1={paddingX}
                y1={capacityY}
                x2={chartWidth - paddingX}
                y2={capacityY}
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              <text
                x={chartWidth - paddingX}
                y={capacityY - 6}
                textAnchor="end"
                fontSize="11"
                fill="#334155"
                fontWeight="bold"
              >
                Available Beds Limit: {maxBedCapacity}
              </text>

              {/* Patients Needing Beds Curve */}
              <path
                d={pathD}
                fill="none"
                stroke={exceedsCapacity ? '#e11d48' : '#0d9488'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points & hover zones */}
              {points.map((pt, idx) => {
                const isHovered = hoveredDay === pt.day;
                const isOver = pt.val > maxBedCapacity;

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredDay(pt.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isOver ? '#e11d48' : '#0d9488'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Day labels on X axis */}
                    <text
                      x={pt.x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748b"
                      fontWeight={isHovered ? 'bold' : 'normal'}
                    >
                      D{pt.day}
                    </text>

                    {/* Hover tooltip */}
                    {isHovered && (
                      <g>
                        <rect
                          x={pt.x - 45}
                          y={pt.y - 38}
                          width="90"
                          height="28"
                          rx="6"
                          fill="#0f172a"
                          opacity="0.95"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 20}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#ffffff"
                          fontWeight="bold"
                        >
                          {pt.val} beds ({pt.val > maxBedCapacity ? 'OVER' : 'OK'})
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-3 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <span className={`w-3.5 h-1 rounded-full ${exceedsCapacity ? 'bg-rose-600' : 'bg-teal-600'}`} />
              <span>Patients Needing Beds (Next 14 Days)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-700" />
              <span>Available Hospital Beds ({maxBedCapacity})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Nearby Hospital Equipment Transfer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Mutual Aid Network
              </span>
              <span className="text-xs text-slate-500">
                Nearby partner hospitals with spare capacity
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Surplus Oxygen & Ventilator Transfers
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Immediate dispatch within 45 minutes
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-3 mb-4">
          To prevent our local clinics from running out of supplies, you can request immediate equipment transfers from neighboring hospitals:
        </p>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-y border-slate-200 font-semibold">
                <th className="py-3 px-3.5">Hospital Name</th>
                <th className="py-3 px-3">Travel Time</th>
                <th className="py-3 px-3">Available Oxygen</th>
                <th className="py-3 px-3">Extra Ventilators</th>
                <th className="py-3 px-3">Clinical Staff Support</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.nearbyTransfers.map((item, idx) => {
                const isDispatched = dispatchedHospitals.includes(item.hospital);

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3.5 font-bold text-slate-900">
                      {item.hospital}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      <span className="inline-flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.distance}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.availableOxygenTanks} Tanks
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {item.ventilators} Units
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {item.staffAvailable}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {isDispatched ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Dispatched</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onRequestTransfer(item)}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Request Transfer</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-3">
        <button
          onClick={onPrevTab}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Identify Illness</span>
        </button>

        <button
          onClick={onNextTab}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
        >
          <span>Continue to Step 4: Action Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
