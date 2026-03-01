import { Metadata } from 'next';
import { UserTable } from '@/components/users/UserTable';

export const metadata: Metadata = { title: 'User Management' };

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="text-text-secondary mt-1">Manage platform users</p>
        </div>
      </div>
      <UserTable />
    </div>
  );
}
