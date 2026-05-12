import React from 'react';
import { Brain, Trash2, Info } from 'lucide-react';

export default function Header({ onClearHistory, messageCount }) {
  return (
    <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full p-2">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              kAIa
            </h1>
            <p className="text-xs text-slate-400">Your Personal AI Coach</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {messageCount > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              title="Clear chat history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <div className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all duration-200 cursor-help" title="All data is stored locally in your browser">
            <Info className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
