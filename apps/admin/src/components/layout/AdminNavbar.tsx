'use client';

import { useSession, signOut } from 'next-auth/react';
import { Bell, LogOut, RefreshCw } from 'lucide-react';

export function AdminNavbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-[#12121A] border-b border-[#2A2A3E] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-text-secondary">All systems operational</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[#1A1A27] transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[#1A1A27] transition-all">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-[#2A2A3E]">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
            {session?.user?.name?.[0] ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-text-primary">{session?.user?.name ?? 'Admin'}</p>
            <p className="text-xs text-text-muted">{(session?.user as { role?: string })?.role ?? 'ADMIN'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="ml-2 p-1.5 rounded text-text-muted hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
