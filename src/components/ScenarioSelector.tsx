import React, { useState, useRef } from 'react';
import { 
  AlertCircle, 
  Wind, 
  Droplets, 
  Bug, 
  Sparkles, 
  Upload, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  CheckCircle2, 
  Edit3, 
  RotateCw,
  MapPin
} from 'lucide-react';
import { OutbreakData } from '../types';

interface ScenarioSelectorProps {
  currentScenarioId: string;
  onSelectPreset: (scenarioId: string) => void;
  onAnalyzeCustom: (customPrompt: string, fileData?: { name: string; type: string }) => void;
  isAnalyzing: boolean;
  currentData: OutbreakData;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenarioId,
  onSelectPreset,
  onAnalyzeCustom,
  isAnalyzing,
  currentData,
}) => {
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [customText, setCustomText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    {
      id: 'respiratory',
      title: '1. Mystery Respiratory Flu',
      subtitle: 'Northside Metro District',
      icon: Wind,
      badge: 'High Alert',
      color: 'border-amber-300 hover:border-amber-400 bg-amber-50/50',
      activeColor: 'ring-2 ring-amber-500 bg-amber-50 border-amber-500',
      iconColor: 'text-amber-600 bg-amber-100',
      description: 'Sudden fever (>102°F), deep dry cough, pharmacy fever reducers sold out.',
    },
    {
      id: 'waterborne',
      title: '2. Flood Waterborne Illness',
      subtitle: 'Riverside County Lowlands',
      icon: Droplets,
      badge: 'Urgent Action',
      color: 'border-rose-300 hover:border-rose-400 bg-rose-50/50',
      activeColor: 'ring-2 ring-rose-500 bg-rose-50 border-rose-500',
      iconColor: 'text-rose-600 bg-rose-100',
      description: 'Watery diarrhea, acute cramps, dehydration after river flooding.',
    },
    {
      id: 'rural_fever',
      title: '3. Rural Fever Outbreak',
      subtitle: 'Valley Agrarian Basin',
      icon: Bug,
      badge: 'Watch Alert',
      color: 'border-emerald-300 hover:border-emerald-400 bg-emerald-50/50',
      activeColor: 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-500',
      iconColor: 'text-emerald-600 bg-emerald-100',
      description: 'Severe joint & muscle aches, eye pain, mosquito vector near canal.',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({ name: file.name, type: file.type || 'document' });
      if (!customText) {
        setCustomText(`Data extracted from ${file.name}: 78 patients reported sudden high fever and vomiting over 18 hours. Local clinic is requesting additional hydration packs and blood test kits.`);
      }
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onAnalyzeCustom(customText, uploadedFile || undefined);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-6">
      
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold tracking-wider uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Interactive Demo Flow
            </span>
            <span className="text-xs text-slate-500">
              Select or enter an outbreak scenario
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Load Sample Outbreak
          </h2>
        </div>

        {/* Toggle between 3 presets vs Custom Input */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setMode('preset')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'preset'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3 Ready-to-Click Scenarios
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              mode === 'custom'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Custom Symptoms / CSV</span>
          </button>
        </div>
      </div>

      {/* Preset Scenarios Grid */}
      {mode === 'preset' ? (
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {presets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = currentScenarioId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected ? preset.activeColor : preset.color
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${preset.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                          {preset.title}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 inline text-slate-400" />
                          {preset.subtitle}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Current Outbreak:</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-800">
                {currentData.title}
              </span>
              <span className="text-slate-400 hidden md:inline">|</span>
              <span className="text-slate-500 hidden md:inline">{currentData.location}</span>
            </div>

            <button
              onClick={() => onSelectPreset(currentScenarioId)}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>AI Crawling & Analyzing Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Outbreak with Gemini</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Custom Input Form */
        <form onSubmit={handleCustomSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Type Custom Symptoms, Clinic Reports, or Location:
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="E.g., 60 patients arrived at Oak Clinic with sudden high fever, skin petechiae, and eye soreness. Pharmacy ran out of fever reducers. Need triage recommendations..."
              className="w-full h-24 p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* File upload simulator */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload CSV / Photo Note</span>
              </button>

              {uploadedFile && (
                <span className="inline-flex items-center space-x-1 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{uploadedFile.name} attached</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !customText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>AI Synthesizing Custom Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Custom Outbreak</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
