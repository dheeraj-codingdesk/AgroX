import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, SendIcon, UserIcon, LinkIcon } from './icons/Icons';

interface ChatbotCardProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({ messages, onSendMessage, isLoading, disabled }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[28rem] md:h-[34rem]">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BotIcon className="w-6 h-6 mr-3 text-green-600" />
          AI Assistant
        </h3>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-5 h-5 text-green-600" />
              </div>
            )}
            <div className={`flex flex-col max-w-xs md:max-w-sm lg:max-w-xs xl:max-w-sm`}>
              <div className={`px-4 py-2 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                    <h4 className="font-semibold mb-1 flex items-center"><LinkIcon className="w-3 h-3 mr-1.5" /> Sources</h4>
                    <ul className="space-y-1 pl-1">
                        {msg.sources.map((source, i) => (
                            <li key={i} className="truncate">
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{source.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-xl rounded-bl-none px-4 py-3">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? 'Analyze a crop to start chatting' : 'Ask a question...'}
            disabled={isLoading || disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow disabled:bg-gray-100"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || disabled || !input.trim()}
            className="p-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotCard;