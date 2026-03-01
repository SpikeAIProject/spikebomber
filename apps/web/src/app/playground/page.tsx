'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@spike-ai/ui';
import { Send, Loader2, Download, Copy, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { usePreferencesStore } from '@/store/preferences.store';
import { apiClient } from '@/lib/api-client';

const MODELS = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', badge: 'Poderoso' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', badge: 'Rápido' },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', badge: 'Estável' },
];

interface Response {
  id: string;
  content: string;
  totalTokens: number;
  latencyMs: number;
}

export default function PlaygroundPage() {
  const { accessToken } = useAuthStore();
  const { selectedModel, setModel } = usePreferencesStore();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.post<Response>(
        'v1/generate',
        { model: selectedModel, prompt },
        { token: accessToken || '' },
      );
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar resposta');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!response) return;
    const blob = new Blob([JSON.stringify({ prompt, response }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spike-ai-${response.id}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Playground</h1>
        <p className="text-muted-foreground mt-1">
          Teste a API SPIKE AI diretamente no browser
        </p>
      </div>

      {/* Model selector */}
      <div className="flex gap-2 mb-4">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => setModel(model.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors ${
              selectedModel === model.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            {model.name}
            <Badge variant="info" className="text-xs">{model.badge}</Badge>
          </button>
        ))}
      </div>

      {/* Input */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-[140px] bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground"
            placeholder="Digite seu prompt aqui... Ex: Explique o que é computação quântica em termos simples."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate();
            }}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Ctrl+Enter para enviar</span>
            <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Gerar
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive mb-4">
          {error}
        </div>
      )}

      {/* Response */}
      {response && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Resposta</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="success">{response.totalTokens} tokens</Badge>
              <Badge variant="info">{response.latencyMs}ms</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigator.clipboard.writeText(response.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono bg-muted/30 rounded-md p-4">
              {response.content}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
