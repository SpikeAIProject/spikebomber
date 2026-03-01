'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/users', icon: Users, label: 'Users' },
  { href: '/plans', icon: CreditCard, label: 'Plans' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/audit-logs', icon: ShieldCheck, label: 'Audit Logs' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#12121A] border-r border-[#2A2A3E] flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-[#2A2A3E]">
        <span className="text-lg font-bold" style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SPIKE AI
        </span>
        <span className="ml-2 text-xs text-text-muted bg-[#1A1A27] border border-[#2A2A3E] rounded px-1.5 py-0.5">
          Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-neon-blue/10 text-[#00D4FF] border border-[#00D4FF]/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-[#1A1A27]'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
