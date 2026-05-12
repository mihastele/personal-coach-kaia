import React from 'react';
import { Brain, Sparkles, Smartphone, Monitor } from 'lucide-react';

export default function LoadingScreen({ progress }) {
  const percentage = progress ? Math.round(progress.progress * 100) : 0;
  const currentPhase = progress ? progress.text : 'Initializing...';
  const modelSize = progress?.modelSize || '~2GB';
  const isMobile = progress?.isMobile || false;
  const isWebGPUSupported = progress?.isWebGPUSupported !== false;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 p-4">
      <div className="text-center px-6 max-w-md w-full">
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-full p-6 sm:p-8 border border-slate-700 inline-block">
            <Brain className="w-16 h-16 sm:w-24 sm:h-24 text-primary-400 mx-auto animate-pulse-slow" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
          kAIa
        </h1>
        <p className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">Your Personal AI Coach</p>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-400" />
                {currentPhase}
              </span>
              <span className="text-sm font-semibold text-primary-400">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-500 to-cyan-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              {isMobile ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary-400">{modelSize}</span>
              <span>model</span>
            </div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isMobile ? (
                <>
                  Optimized for mobile with a lightweight model ({modelSize}). 
                  Downloads once, then runs locally. Your data stays private.
                </>
              ) : (
                <>
                  Downloading AI model to your browser. This only happens once.
                  The model runs entirely on your device - your data stays private.
                </>
              )}
            </p>
            {!isWebGPUSupported && (
              <p className="text-xs text-amber-400 mt-2">
                ⚠️ WebGPU not detected. Using CPU mode - responses may be slower.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
