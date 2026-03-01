'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { UserActions } from './UserActions';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  subscription?: { plan?: { name?: string; tier?: string } } | null;
}

export function UserTable() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users?limit=50');
      return (res.data as { data?: AdminUser[] }).data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-8 text-center text-text-muted">
        Loading users...
      </div>
    );
  }

  return (
    <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2A3E]">
            {['Name', 'Email', 'Role', 'Plan', 'Status', 'Joined', 'Actions'].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data || data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                No users found
              </td>
            </tr>
          ) : (
            data.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#2A2A3E] last:border-0 hover:bg-[#1A1A27] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
                      {user.name[0]}
                    </div>
                    <span className="text-text-primary font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${user.role === 'SUPER_ADMIN' ? 'bg-neon-purple/10 text-[#7B2FFF] border border-[#7B2FFF]/20' : user.role === 'ADMIN' ? 'bg-neon-blue/10 text-[#00D4FF] border border-[#00D4FF]/20' : 'bg-[#1A1A27] text-text-muted border border-[#2A2A3E]'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  {user.subscription?.plan?.name ?? 'Free'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${user.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <UserActions userId={user.id} isActive={user.isActive} onAction={() => void refetch()} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
