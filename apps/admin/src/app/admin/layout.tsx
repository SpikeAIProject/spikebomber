'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Users, CreditCard, BarChart3, FileText, Activity, LogOut, Settings } from 'lucide-react';
import { useAdminAuthStore } from '@/store/admin-auth.store';
import { cn } from '@spike-ai/ui';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/plans', label: 'Planos', icon: Settings },
  { href: '/admin/subscriptions', label: 'Assinaturas', icon: CreditCard },
  { href: '/admin/usage', label: 'Uso & Analytics', icon: Activity },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth, isAuthenticated } = useAdminAuthStore();

  // Redirect to login if not authenticated (client-side)
  if (!isAuthenticated && pathname !== '/admin/login') {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border flex flex-col fixed inset-y-0 left-0 bg-card/50">
        <div className="h-14 flex items-center px-4 border-b border-border gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="font-bold text-sm">SPIKE AI</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-1.5 mb-1">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
