import { useState, useEffect } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { DataTable, type Column } from '../../components/ui/DataTable.tsx';
import { Modal } from '../../components/Modal/index.ts';
import { FormInput } from '../../components/forms/FormInput.tsx';
import { FormSelect } from '../../components/forms/FormSelect.tsx';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton.tsx';
import { adminApi } from '../../services/mockApi.ts';
import type { User, UserRole } from '../../types/index.ts';
import toast from 'react-hot-toast';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'admin', label: 'Admin' },
];

export function AdminUsersPage() {
  const [tab, setTab] = useState<UserRole | 'all'>('student');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<UserRole>('student');
  const [addPassword, setAddPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const role = tab === 'all' ? undefined : tab;
    adminApi.getUsers(role).then(setUsers).finally(() => setLoading(false));
  }, [tab]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<User>[] = [
    { id: 'name', header: 'Name', accessor: (r) => r.name, sortable: true },
    { id: 'email', header: 'Email', accessor: (r) => r.email, sortable: true },
    {
      id: 'role',
      header: 'Role',
      accessor: (r) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {r.role}
        </span>
      ),
    },
  ];

  const handleAdd = async () => {
    setSubmitting(true);
    try {
      await adminApi.createUser({ name: addName, email: addEmail, role: addRole, password: addPassword });
      toast.success('User added.');
      setAddOpen(false);
      setAddName('');
      setAddEmail('');
      setAddPassword('');
      adminApi.getUsers(tab === 'all' ? undefined : tab).then(setUsers);
    } catch {
      toast.error('Failed to add user.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Users">
        <TableSkeleton rows={10} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Users">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(['student', 'faculty', 'admin', 'all'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium ${tab === t ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <Link
          to="/admin/users/signup"
          className="flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" /> Sign up new user
        </Link>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" /> Add user (quick)
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search users..."
        onSearch={setSearch}
      />
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add user"
        footer={
          <>
            <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
              Cancel
            </button>
            <button type="button" onClick={handleAdd} disabled={submitting} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-60">
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={addName} onChange={(e) => setAddName(e.target.value)} fullWidth />
          <FormInput label="Email" type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} fullWidth />
          <FormSelect label="Role" options={roleOptions} value={addRole} onChange={(e) => setAddRole(e.target.value as UserRole)} fullWidth />
          <FormInput label="Password" type="password" value={addPassword} onChange={(e) => setAddPassword(e.target.value)} fullWidth />
        </div>
      </Modal>
    </AppShell>
  );
}
