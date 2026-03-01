import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Audit Logs' };

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Audit Logs</h1>
        <p className="text-text-secondary mt-1">Track all platform actions</p>
      </div>

      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2A2A3E] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Recent Actions</h2>
          <div className="flex gap-2">
            <select className="h-8 px-2 text-xs rounded border border-[#2A2A3E] bg-[#0A0A0F] text-text-secondary focus:outline-none">
              <option>All Actions</option>
              <option>LOGIN</option>
              <option>API_KEY_CREATE</option>
              <option>SUBSCRIPTION_CREATE</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A3E]">
              {['Time', 'User', 'Action', 'Resource', 'IP Address'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                No audit logs yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
