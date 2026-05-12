import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import { initLLM, generateResponse, isEngineReady } from './lib/llm';
import { saveMessage, getChatHistory, clearChatHistory } from './lib/storage';
import { Download, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [engine, setEngine] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [dots, setDots] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeApp = async () => {
    try {
      // Load chat history from IndexedDB
      const history = await getChatHistory();
      setMessages(history);

      // Start LLM initialization in background
      initLLM((progress) => {
        setLoadingProgress(progress);
      }).then(llmEngine => {
        console.log('LLM Engine initialized:', llmEngine);
        setEngine(llmEngine);
        setIsLoading(false);
        
        // Process pending message if there is one
        if (pendingMessage) {
          processMessage(pendingMessage);
          setPendingMessage(null);
        }
      }).catch(error => {
        console.error('Initialization error:', error);
        setIsLoading(false);
        // Don't use alert, just log the error
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm having trouble initializing. Please refresh the page or check if your browser supports WebGPU.",
          timestamp: new Date().toISOString(),
        }]);
      });
    } catch (error) {
      console.error('Initialization error:', error);
      setIsLoading(false);
    }
  };

  const processMessage = async (userMessage) => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    await saveMessage(newMessage);
    setIsGenerating(true);

    try {
      const response = await generateResponse(userMessage, engine);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      await saveMessage(aiMessage);
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (userMessage) => {
    if (!engine) {
      // Queue the message if engine is not ready
      setPendingMessage(userMessage);
      
      // Add user message immediately
      const newMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      await saveMessage(newMessage);
      return;
    }

    processMessage(userMessage);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      await clearChatHistory();
      setMessages([]);
    }
  };

  const renderStatusCard = () => {
    if (!pendingMessage) return null;
    
    const percentage = loadingProgress ? Math.round(loadingProgress.progress * 100) : 0;
    const currentPhase = loadingProgress ? loadingProgress.text : 'Initializing...';
    
    return (
      <div className="flex gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
          {percentage < 100 ? (
            <Download className="w-5 h-5 text-white animate-pulse" />
          ) : (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          )}
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm text-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-700 max-w-sm">
          {percentage < 100 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span>{currentPhase}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">{percentage}% - I'll respond as soon as I'm ready</p>
            </div>
          ) : (
            <p className="text-slate-300 text-sm">Getting ready{dots}</p>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header onClearHistory={handleClearHistory} messageCount={messages.length} />
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-full p-6 border border-slate-700">
                  <div className="bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full p-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">Welcome to kAIa</h2>
              <p className="text-slate-400 max-w-md mb-8">
                I'm your personal AI coach, here to help you reflect, grow, and achieve your goals. 
                Everything we discuss stays private on your device.
              </p>
              {!engine && (
                <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700 max-w-md">
                  <p className="text-sm text-slate-300">
                    {loadingProgress ? 'Downloading AI model...' : 'Initializing AI model...'}
                  </p>
                  {loadingProgress && (
                    <div className="mt-2 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round(loadingProgress.progress * 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                {[
                  "How can I improve my productivity?",
                  "I'm feeling stressed about work",
                  "Help me set some personal goals",
                  "I want to build better habits"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 text-sm text-slate-300 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isUser={message.role === 'user'}
              />
            ))
          )}
          {renderStatusCard()}
          {isGenerating && (
            <div className="flex gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-700">
                <p className="text-slate-400">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <ChatInput onSend={handleSendMessage} disabled={isGenerating} />
    </div>
  );
}

export default App;
