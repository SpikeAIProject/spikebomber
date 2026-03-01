'use client';

import { useState } from 'react';
import { Ban, CheckCircle, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface UserActionsProps {
  userId: string;
  isActive: boolean;
  onAction: () => void;
}

export function UserActions({ userId, isActive, onAction }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleActive = async () => {
    setIsLoading(true);
    try {
      await api.patch(`/admin/users/${userId}`, { isActive: !isActive });
      onAction();
    } catch (err) {
      console.error('Failed to update user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    setIsLoading(true);
    try {
      await api.delete(`/admin/users/${userId}`);
      onAction();
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggleActive}
        disabled={isLoading}
        className={`p-1.5 rounded transition-colors ${isActive ? 'text-text-muted hover:text-yellow-400' : 'text-text-muted hover:text-green-400'}`}
        title={isActive ? 'Deactivate user' : 'Activate user'}
      >
        {isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={deleteUser}
        disabled={isLoading}
        className="p-1.5 rounded text-text-muted hover:text-red-400 transition-colors"
        title="Delete user"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
