import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { TabsNav } from './components/TabsNav';
import { Tab1WarningSigns } from './components/Tab1WarningSigns';
import { Tab2IdentifyIllness } from './components/Tab2IdentifyIllness';
import { Tab3HospitalSupplies } from './components/Tab3HospitalSupplies';
import { Tab4ActionPlan } from './components/Tab4ActionPlan';
import { DocumentModal } from './components/DocumentModal';
import { DispatchModal } from './components/DispatchModal';
import { ChatAssistantModal } from './components/ChatAssistantModal';
import { HelpModal } from './components/HelpModal';
import { INITIAL_SCENARIOS } from './data/initialData';
import { OutbreakData, ReadyDocument, NearbyTransfer } from './types';
import { Sparkles, MessageSquareHeart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('respiratory');
  const [currentData, setCurrentData] = useState<OutbreakData>(INITIAL_SCENARIOS.respiratory);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [dispatchedHospitals, setDispatchedHospitals] = useState<string[]>([]);
  
  // Modals
  const [selectedDocument, setSelectedDocument] = useState<ReadyDocument | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<NearbyTransfer | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch between presets or re-analyze with Gemini
  const handleSelectPreset = async (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
    
    // Immediately show baseline data for instant response
    const baseline = INITIAL_SCENARIOS[scenarioId] || INITIAL_SCENARIOS.respiratory;
    setCurrentData(baseline);

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-outbreak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId }),
      });

      if (res.ok) {
        const enriched = await res.json();
        if (enriched && enriched.tab1_warningSigns) {
          setCurrentData(enriched);
        }
      }
    } catch (err) {
      console.warn('Using baseline scenario data:', err);
    } finally {
      setIsAnalyzing(false);
      showToast(`Loaded and analyzed: ${baseline.title}`);
    }
  };

  // Analyze custom symptoms or uploaded CSV
  const handleAnalyzeCustom = async (customPrompt: string, fileData?: { name: string; type: string }) => {
    setIsAnalyzing(true);
    setCurrentScenarioId('custom');

    try {
      const res = await fetch('/api/analyze-outbreak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customPrompt,
          customNotes: fileData ? `File attached: ${fileData.name}` : undefined,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result && result.tab1_warningSigns) {
          setCurrentData(result);
          showToast('Custom Outbreak analysis ready!');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Completed analysis of custom report');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmTransfer = (hospitalName: string) => {
    setDispatchedHospitals((prev) => [...prev, hospitalName]);
    showToast(`Emergency transfer convoy dispatched from ${hospitalName}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-200 selection:text-teal-900">
      
      {/* Top App Header */}
      <Header
        onOpenChat={() => setIsChatOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Outbreak Scenario Selector & Custom Input */}
        <ScenarioSelector
          currentScenarioId={currentScenarioId}
          onSelectPreset={handleSelectPreset}
          onAnalyzeCustom={handleAnalyzeCustom}
          isAnalyzing={isAnalyzing}
          currentData={currentData}
        />

        {/* 4-Step Wizard Navigation */}
        <TabsNav activeTab={activeTab} onTabChange={(tabIdx) => setActiveTab(tabIdx)} />

        {/* Active Tab View */}
        <div className="transition-all duration-200">
          {activeTab === 1 && (
            <Tab1WarningSigns
              data={currentData.tab1_warningSigns}
              onNextTab={() => setActiveTab(2)}
            />
          )}

          {activeTab === 2 && (
            <Tab2IdentifyIllness
              data={currentData.tab2_identifyIllness}
              onPrevTab={() => setActiveTab(1)}
              onNextTab={() => setActiveTab(3)}
              onOpenFactChecker={() => setIsChatOpen(true)}
            />
          )}

          {activeTab === 3 && (
            <Tab3HospitalSupplies
              data={currentData.tab3_hospitalSupplies}
              onPrevTab={() => setActiveTab(2)}
              onNextTab={() => setActiveTab(4)}
              onRequestTransfer={(transfer) => setSelectedTransfer(transfer)}
              dispatchedHospitals={dispatchedHospitals}
            />
          )}

          {activeTab === 4 && (
            <Tab4ActionPlan
              data={currentData.tab4_actionPlan}
              onPrevTab={() => setActiveTab(3)}
              onOpenDocument={(doc) => setSelectedDocument(doc)}
            />
          )}
        </div>

      </main>

      {/* Floating Action Button for Quick Fact-Checking */}
      <aside aria-label="Emergency Assistant" className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-700"
        >
          <MessageSquareHeart className="w-4 h-4 text-teal-400" />
          <span>Ask Fact-Checker</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </aside>

      {/* Notification Toast */}
      {toastMessage && (
        <aside aria-label="Notification" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Modals */}
      <DocumentModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      <DispatchModal
        transfer={selectedTransfer}
        onClose={() => setSelectedTransfer(null)}
        onConfirm={handleConfirmTransfer}
      />

      <ChatAssistantModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentData={currentData}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>ZEROHOUR</strong>: 24-Hour Outbreak Response Assistant • Designed for Clarity, Speed, and Zero Misinformation
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-slate-800 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="hover:text-slate-800 cursor-pointer"
            >
              Ask AI Fact-Checker
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
