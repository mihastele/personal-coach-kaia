import React from 'react';
import { Bot, User, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ChatMessage({ message, isUser, onClear }) {
  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3",
        isUser 
          ? "bg-primary-600 text-white rounded-tr-sm" 
          : "bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700"
      )}>
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
        <span className="text-xs opacity-60 mt-2 block">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <User className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
}
