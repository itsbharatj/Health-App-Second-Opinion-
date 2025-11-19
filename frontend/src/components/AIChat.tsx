import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../services/api';
import { ChatMessage } from '../types';
import { FiSend } from 'react-icons/fi';

interface AIChatProps {
  userId: string;
  userConditions: string[];
  userMedications: string[];
}

export const AIChat: React.FC<AIChatProps> = ({ userId, userConditions, userMedications }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Doc, your AI health companion. I can help you understand your health data, answer health questions, and provide personalized recommendations based on your medical history. What can I help you with today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(userId, input);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response || 'I encountered an issue processing your request.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I encountered an error. Please check your API connection and try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96 bg-secondary rounded-lg overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-blue-600 p-3 text-white">
        <h3 className="font-semibold">🏥 Doc - Your AI Health Assistant</h3>
        <p className="text-xs opacity-90">Always here to help</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-100 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 px-3 py-2 rounded-lg rounded-bl-none">
              <span className="animate-pulse">Doc is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 bg-slate-600 text-white placeholder-slate-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="bg-accent text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};
