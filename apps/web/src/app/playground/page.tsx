'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Settings, RotateCcw, Copy, CheckCheck } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', badge: 'Fast' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', badge: 'Powerful' },
  { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', badge: 'Vision' },
];

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
  const [showSettings, setShowSettings] = useState(false);
  const [streamEnabled, setStreamEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async (data: { message: string }) => {
    if (!data.message.trim() || isStreaming) return;

    const userMessage: Message = {
      role: 'user',
      content: data.message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    reset();
    setIsStreaming(true);

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      if (streamEnabled) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1'}/ai/chat`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
            },
            body: JSON.stringify({
              messages: [...messages, userMessage].map((m) => ({
                role: m.role,
                content: m.content,
              })),
              model: selectedModel,
              systemPrompt,
              stream: true,
            }),
          },
        );

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

          for (const line of lines) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data) as { text?: string };
              if (parsed.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === 'assistant') {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + parsed.text,
                    };
                  }
                  return updated;
                });
              }
            } catch {
              // Skip parse errors
            }
          }
        }
      } else {
        const result = await api.post('/ai/chat', {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          systemPrompt,
          stream: false,
        });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...assistantMessage,
            content: (result.data as { text?: string }).text ?? '',
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...assistantMessage,
          content: 'Error: Failed to get response. Please try again.',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const copyMessage = async (content: string, idx: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Playground</h1>
          <p className="text-text-secondary text-sm mt-0.5">Test and explore AI models</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background-secondary text-sm text-text-primary focus:outline-none focus:border-neon-blue"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button
            onClick={() => setMessages([])}
            className="h-9 w-9 rounded-md border border-border bg-background-secondary text-text-secondary hover:text-text-primary hover:border-neon-blue transition-all flex items-center justify-center"
            title="Clear conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`h-9 w-9 rounded-md border bg-background-secondary transition-all flex items-center justify-center ${showSettings ? 'border-neon-blue text-neon-blue' : 'border-border text-text-secondary hover:text-text-primary'}`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-background-secondary border border-border rounded-lg p-4 mb-4 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-blue resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Options</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={streamEnabled}
                  onChange={(e) => setStreamEnabled(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm text-text-secondary">Enable streaming</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Start a conversation</h3>
            <p className="text-text-secondary max-w-md">
              Ask anything or paste your code, text, or ideas. SPIKE AI will help you think through it.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {['Write a REST API in TypeScript', 'Explain quantum computing', 'Debug this code'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSubmit(() => onSubmit({ message: prompt }))()}
                  className="px-3 py-1.5 rounded-full border border-border text-xs text-text-secondary hover:border-neon-blue hover:text-neon-blue transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm relative group ${
                msg.role === 'user'
                  ? 'bg-neon-blue/20 border border-neon-blue/30 text-text-primary'
                  : 'bg-background-secondary border border-border text-text-primary'
              }`}
            >
              <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {msg.content}
                {isStreaming && idx === messages.length - 1 && msg.role === 'assistant' && (
                  <span className="inline-block w-1 h-4 bg-neon-blue ml-0.5 animate-pulse" />
                )}
              </div>
              <button
                onClick={() => copyMessage(msg.content, idx)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-text-muted hover:text-text-secondary"
              >
                {copiedId === idx ? <CheckCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-neon-purple text-xs font-bold flex-shrink-0">
                U
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            {...register('message')}
            placeholder="Ask anything... (Press Enter to send, Shift+Enter for new line)"
            rows={3}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background-secondary text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-blue transition-all resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit(onSubmit)();
              }
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isStreaming}
          className="h-12 w-12 rounded-xl bg-gradient-neon text-white flex items-center justify-center shadow-neon-blue hover:shadow-neon-blue-lg transition-all disabled:opacity-50 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
