import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Smartphone, Monitor, Download, Cpu, Shield, Zap } from 'lucide-react';

export default function LoadingScreen({ progress }) {
  const percentage = progress ? Math.round(progress.progress * 100) : 0;
  const currentPhase = progress ? progress.text : 'Initializing...';
  const modelSize = progress?.modelSize || '~600MB';
  const isMobile = progress?.isMobile || false;
  const isWebGPUSupported = progress?.isWebGPUSupported !== false;
  
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getLoadingStep = () => {
    if (percentage < 20) return { icon: Download, text: 'Downloading model', color: 'text-blue-400' };
    if (percentage < 50) return { icon: Cpu, text: 'Loading to memory', color: 'text-purple-400' };
    if (percentage < 80) return { icon: Zap, text: 'Initializing AI', color: 'text-yellow-400' };
    return { icon: Sparkles, text: 'Almost ready', color: 'text-green-400' };
  };

  const step = getLoadingStep();
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative text-center px-6 max-w-md w-full">
        {/* Logo with glow effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-cyan-500/20 rounded-2xl blur-xl animate-pulse-slow"></div>
              <Brain className="w-20 h-20 sm:w-24 sm:h-24 text-transparent bg-gradient-to-r from-primary-400 to-cyan-400 mx-auto relative" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 bg-clip-text text-transparent animate-gradient">
          kAIa
        </h1>
        <p className="text-slate-400 mb-8 text-base sm:text-lg font-light">Your Personal AI Coach</p>
        
        {/* Main loading card */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl space-y-5">
          {/* Progress section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-slate-700/50 ${step.color}`}>
                  <StepIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-200">
                  {step.text}{dots}
                </span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                {percentage}%
              </span>
            </div>
            
            {/* Progress bar with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-cyan-500/20 rounded-full blur-lg"></div>
              <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/50">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 transition-all duration-500 ease-out relative"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current phase indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-700/30 rounded-lg px-3 py-2">
            <Sparkles className="w-3 h-3 text-primary-400" />
            <span className="truncate">{currentPhase}</span>
          </div>
          
          {/* Info badges */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              {isMobile ? <Smartphone className="w-4 h-4 text-primary-400" /> : <Monitor className="w-4 h-4 text-primary-400" />}
              <span className="text-xs text-slate-400">{isMobile ? 'Mobile' : 'Desktop'}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <span className="text-sm font-bold text-primary-400">{modelSize}</span>
              <span className="text-xs text-slate-400">Model</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Private</span>
            </div>
          </div>
          
          {/* Info text */}
          <div className="text-xs text-slate-400 leading-relaxed bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
            {isMobile ? (
              <span>Optimized for mobile with a lightweight model. Downloads once, then runs locally.</span>
            ) : (
              <span>Downloading AI model to your browser. This only happens once. The model runs entirely on your device.</span>
            )}
            {!isWebGPUSupported && (
              <span className="block mt-2 text-amber-400">⚠️ WebGPU not detected. Using CPU mode - responses may be slower.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
