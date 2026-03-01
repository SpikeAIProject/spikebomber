'use client';

import { useState } from 'react';
import { useApiKeys } from '@/lib/hooks/useApiKeys';
import { Copy, Plus, Trash2, RefreshCw, Eye, EyeOff, CheckCheck } from 'lucide-react';

export default function SettingsPage() {
  const { apiKeys, isLoading, createKey, revokeKey, rotateKey } = useApiKeys();
  const [newKeyName, setNewKeyName] = useState('');
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    const result = await createKey(newKeyName);
    if (result?.rawKey) {
      setRevealedKeys((prev) => ({ ...prev, [result.id]: result.rawKey }));
    }
    setNewKeyName('');
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your API keys and account settings</p>
      </div>

      {/* API Keys Section */}
      <div className="bg-background-secondary border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-1">API Keys</h2>
        <p className="text-sm text-text-secondary mb-5">
          Use API keys to authenticate requests. Keys are shown only once on creation.
        </p>

        {/* Create new key */}
        <div className="flex gap-3 mb-6">
          <input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Production)"
            className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-blue"
            onKeyDown={(e) => { if (e.key === 'Enter') void handleCreateKey(); }}
          />
          <button
            onClick={handleCreateKey}
            disabled={!newKeyName.trim()}
            className="h-10 px-4 rounded-md bg-gradient-neon text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 shadow-neon-blue hover:shadow-neon-blue-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Key
          </button>
        </div>

        {/* Keys list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-background-tertiary animate-pulse" />
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <p>No API keys yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key: {
              id: string;
              name: string;
              keyPrefix: string;
              status: string;
              lastUsedAt: string | null;
              createdAt: string;
            }) => (
              <div
                key={key.id}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-border-light transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">{key.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${key.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {key.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-text-muted">
                      {revealedKeys[key.id] ? revealedKeys[key.id] : `${key.keyPrefix}${'•'.repeat(40)}`}
                    </code>
                  </div>
                  {key.lastUsedAt && (
                    <p className="text-xs text-text-muted mt-0.5">
                      Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {revealedKeys[key.id] && (
                    <button
                      onClick={() => handleCopy(revealedKeys[key.id], key.id)}
                      className="p-2 rounded text-text-muted hover:text-text-secondary transition-colors"
                      title="Copy key"
                    >
                      {copiedId === key.id ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => rotateKey(key.id)}
                    className="p-2 rounded text-text-muted hover:text-neon-blue transition-colors"
                    title="Rotate key"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => revokeKey(key.id)}
                    className="p-2 rounded text-text-muted hover:text-red-400 transition-colors"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
