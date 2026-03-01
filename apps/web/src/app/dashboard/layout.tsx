'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, BarChart3, Settings, CreditCard, Key, Code2, Webhook, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@spike-ai/ui';

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', icon: BarChart3 },
  { href: '/playground', label: 'Playground', icon: Code2 },
  { href: '/settings', label: 'Configurações', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings/api-keys', label: 'API Keys', icon: Key },
  { href: '/settings/webhooks', label: 'Webhooks', icon: Webhook },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col fixed inset-y-0 left-0 bg-card/50">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Zap className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              SPIKE AI
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md mb-1">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
