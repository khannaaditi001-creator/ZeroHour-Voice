import React from 'react';
import { Activity, ShieldAlert, Sparkles, MessageSquareHeart, HelpCircle, Volume2 } from 'lucide-react';

interface HeaderProps {
  onOpenChat: () => void;
  onOpenHelp: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChat, onOpenHelp, isAnalyzing }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Main Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  ZEROHOUR
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Response
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                24-Hour Outbreak Response Assistant
              </p>
            </div>
          </div>

          {/* AI Crawlers & Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* AI Agent Status Pill */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Data Crawlers: {isAnalyzing ? 'Synthesizing...' : 'Monitoring Active'}</span>
              </span>
            </div>

            {/* Quick Ask / Fact Checker Button */}
            <button
              onClick={onOpenChat}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              title="Ask verified questions and debunk rumors"
            >
              <MessageSquareHeart className="w-4 h-4 text-teal-600" />
              <span>Ask AI Fact-Checker</span>
            </button>

            {/* Help / Guide Button */}
            <button
              onClick={onOpenHelp}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="How this outbreak wizard works"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
