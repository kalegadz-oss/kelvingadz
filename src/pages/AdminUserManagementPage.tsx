import { useState, useEffect, useCallback } from 'react';
import { supabase, type AdminUser } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import {
  ShieldCheck, Users, Mail, Calendar, Search, ChevronRight, X,
  Crown, UserCircle, KeyRound, Trash2, AlertCircle, CheckCircle2,
  Loader2, Ban,
} from 'lucide-react';

export default function AdminUserManagementPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('admin_list_users');
    if (rpcError) {
      setError('Could not load users. You may not have admin access.');
      setLoading(false);
      return;
    }
    setUsers((data ?? []) as AdminUser[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(u => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">User Management</h1>
            <p className="text-navy-300 text-sm">Admin dashboard for managing all user accounts.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in-up animate-delay-100">
        <StatCard icon={Users} label="Total Users" value={users.length} color="brand" />
        <StatCard icon={Crown} label="Admins" value={users.filter(u => u.role === 'admin').length} color="warning" />
        <StatCard icon={UserCircle} label="Regular Users" value={users.filter(u => u.role === 'user').length} color="success" />
      </div>

      {/* Search + Table */}
      <Card className="p-0 overflow-hidden animate-fade-in-up animate-delay-200">
        <div className="p-5 border-b border-navy-700/30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full rounded-xl bg-navy-900/50 border border-navy-700/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-danger-500/10 border border-danger-500/30 px-4 py-3 m-5">
            <AlertCircle className="w-4 h-4 text-danger-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-danger-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-10 h-10 text-navy-600 mb-3" />
            <p className="text-sm text-navy-400">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700/30 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUserId={profile?.id}
                    onView={() => setSelectedUser(user)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* User detail drawer */}
      {selectedUser && (
        <UserDetailDrawer
          user={selectedUser}
          currentUserId={profile?.id}
          onClose={() => setSelectedUser(null)}
          onRefresh={fetchUsers}
        />
      )}
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Users; label: string; value: number; color: 'brand' | 'warning' | 'success';
}) {
  const colorMap = {
    brand: 'bg-brand-500/15 border-brand-500/30 text-brand-400',
    warning: 'bg-warning-500/15 border-warning-500/30 text-warning-400',
    success: 'bg-success-500/15 border-success-500/30 text-success-400',
  };
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-white">{value}</p>
        <p className="text-xs text-navy-400 font-medium">{label}</p>
      </div>
    </Card>
  );
}

// ─── User Row ───────────────────────────────────────────────────────────────────

function UserRow({ user, currentUserId, onView }: {
  user: AdminUser;
  currentUserId?: string;
  onView: () => void;
}) {
  const initials = (user.full_name || user.email || 'U')
    .split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const isSelf = user.id === currentUserId;
  const isAdmin = user.role === 'admin';
  const isBanned = user.banned_until && new Date(user.banned_until) > new Date();

  return (
    <tr className="border-b border-navy-800/40 hover:bg-navy-800/20 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.full_name || '—'}
              {isSelf && <span className="text-navy-500 text-xs ml-1.5">(You)</span>}
            </p>
            <p className="text-xs text-navy-400 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        {isAdmin ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-500/15 border border-warning-500/30 px-2.5 py-1 text-xs font-semibold text-warning-300">
            <Crown className="w-3 h-3" /> Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-700/40 border border-navy-600/30 px-2.5 py-1 text-xs font-semibold text-navy-300">
            <UserCircle className="w-3 h-3" /> User
          </span>
        )}
      </td>
      <td className="px-5 py-3.5 hidden md:table-cell">
        <div className="flex items-center gap-2 text-sm text-navy-300">
          <Calendar className="w-3.5 h-3.5 text-navy-500" />
          {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </td>
      <td className="px-5 py-3.5 hidden lg:table-cell">
        {isBanned ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-500/15 border border-danger-500/30 px-2.5 py-1 text-xs font-semibold text-danger-300">
            <Ban className="w-3 h-3" /> Banned
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-500/15 border border-success-500/30 px-2.5 py-1 text-xs font-semibold text-success-300">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        )}
      </td>
      <td className="px-5 py-3.5 text-right">
        <button
          onClick={onView}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-300 hover:text-brand-200 transition-colors"
        >
          Manage <ChevronRight className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

// ─── User Detail Drawer ─────────────────────────────────────────────────────────

function UserDetailDrawer({ user, currentUserId, onClose, onRefresh }: {
  user: AdminUser;
  currentUserId?: string;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [roleLoading, setRoleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isSelf = user.id === currentUserId;
  const initials = (user.full_name || user.email || 'U')
    .split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChangeRole = async (newRole: 'user' | 'admin') => {
    if (newRole === user.role) return;
    setRoleLoading(true);
    const { error: rpcError } = await supabase.rpc('admin_set_user_role', {
      p_target: user.id,
      p_role: newRole,
    });
    setRoleLoading(false);
    if (rpcError) {
      showToast('error', 'Could not change role. ' + (rpcError.message.includes('Not authorized') ? 'Not authorized.' : 'Try again.'));
    } else {
      showToast('success', `Role changed to ${newRole}.`);
      onRefresh();
    }
  };

  const handlePasswordReset = async () => {
    setResetLoading(true);
    const { data, error: rpcError } = await supabase.rpc('admin_send_password_reset', {
      p_target: user.id,
    });
    if (rpcError) {
      setResetLoading(false);
      showToast('error', 'Could not initiate password reset.');
      return;
    }
    const email = data as string;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    setResetLoading(false);
    if (resetError) {
      showToast('error', 'Could not send reset email.');
    } else {
      showToast('success', `Password reset email sent to ${email}.`);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const { error: rpcError } = await supabase.rpc('admin_delete_user', {
      p_target: user.id,
    });
    setDeleteLoading(false);
    if (rpcError) {
      showToast('error', 'Could not delete user. ' + (rpcError.message.includes('Not authorized') ? 'Not authorized.' : 'Try again.'));
    } else {
      showToast('success', 'User deleted successfully.');
      onRefresh();
      setTimeout(() => onClose(), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
      <aside
        className="relative w-full max-w-md glass-strong border-l border-navy-700/40 flex flex-col animate-slide-in h-full overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-navy-700/30 flex items-center justify-between sticky top-0 glass-strong z-10">
          <h2 className="text-lg font-bold text-white">Manage User</h2>
          <button onClick={onClose} className="text-navy-400 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Toast */}
          {toast && (
            <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 animate-scale-in ${
              toast.type === 'success'
                ? 'bg-success-500/10 border-success-500/30'
                : 'bg-danger-500/10 border-danger-500/30'
            }`}>
              {toast.type === 'success'
                ? <CheckCircle2 className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 text-danger-400 mt-0.5 flex-shrink-0" />}
              <p className={`text-sm ${toast.type === 'success' ? 'text-success-300' : 'text-danger-300'}`}>{toast.msg}</p>
            </div>
          )}

          {/* Profile summary */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">{user.full_name || '—'}</h3>
              <p className="text-sm text-navy-300 truncate">{user.email}</p>
              <div className="mt-1.5">
                {user.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-500/15 border border-warning-500/30 px-2.5 py-0.5 text-xs font-semibold text-warning-300">
                    <Crown className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-700/40 border border-navy-600/30 px-2.5 py-0.5 text-xs font-semibold text-navy-300">
                    <UserCircle className="w-3 h-3" /> User
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <Card className="p-4 space-y-3">
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow icon={Calendar} label="Joined" value={new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <DetailRow icon={ShieldCheck} label="User ID" value={user.id} mono />
            <DetailRow
              icon={CheckCircle2}
              label="Account Status"
              value={user.banned_until && new Date(user.banned_until) > new Date() ? 'Banned' : 'Active'}
            />
          </Card>

          {/* Role management */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Role Management</h4>
            {isSelf ? (
              <div className="flex items-start gap-2.5 rounded-xl bg-warning-500/10 border border-warning-500/30 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-warning-300">You cannot change your own role to prevent lockout.</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={user.role === 'user' ? 'primary' : 'secondary'}
                  size="md"
                  className="flex-1"
                  loading={roleLoading}
                  disabled={user.role === 'user'}
                  onClick={() => handleChangeRole('user')}
                >
                  <UserCircle className="w-4 h-4" /> Make User
                </Button>
                <Button
                  variant={user.role === 'admin' ? 'primary' : 'secondary'}
                  size="md"
                  className="flex-1"
                  loading={roleLoading}
                  disabled={user.role === 'admin'}
                  onClick={() => handleChangeRole('admin')}
                >
                  <Crown className="w-4 h-4" /> Make Admin
                </Button>
              </div>
            )}
          </div>

          {/* Password reset */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Password Reset</h4>
            <p className="text-xs text-navy-400">
              Sends a secure password reset link to the user's email. The user will create their new password through the secure flow. Passwords are never visible to anyone.
            </p>
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              loading={resetLoading}
              onClick={handlePasswordReset}
            >
              <KeyRound className="w-4 h-4" /> Send Password Reset Email
            </Button>
          </div>

          {/* Danger zone */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-danger-300">Danger Zone</h4>
            {isSelf ? (
              <div className="flex items-start gap-2.5 rounded-xl bg-warning-500/10 border border-warning-500/30 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-warning-300">You cannot delete your own account.</p>
              </div>
            ) : confirmDelete ? (
              <div className="rounded-xl bg-danger-500/10 border border-danger-500/30 p-4 space-y-3">
                <p className="text-sm text-danger-300 font-medium">
                  Are you sure? This permanently deletes the user and all associated data. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button variant="danger" size="md" className="flex-1" loading={deleteLoading} onClick={handleDelete}>
                    <Trash2 className="w-4 h-4" /> Confirm Delete
                  </Button>
                  <Button variant="ghost" size="md" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="danger" size="md" className="w-full" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="w-4 h-4" /> Delete User
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Detail Row ─────────────────────────────────────────────────────────────────

function DetailRow({ icon: Icon, label, value, mono }: {
  icon: typeof Mail; label: string; value: string; mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-navy-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-navy-400 font-medium">{label}</p>
        <p className={`text-sm text-white ${mono ? 'font-mono text-xs' : ''} break-all`}>{value}</p>
      </div>
    </div>
  );
}
