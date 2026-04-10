import React, { useState } from 'react';
import { UserPlus, Shield, User, Mail, Trash2, Search, X } from 'lucide-react';
import { UserProfile, Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PrivilegeAccessPageProps {
  users: UserProfile[];
  onAddUser: (email: string, role: Role) => void;
  onRemoveUser: (uid: string) => void;
}

export default function PrivilegeAccessPage({ users, onAddUser, onRemoveUser }: PrivilegeAccessPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('user');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    u.displayName?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail) {
      onAddUser(newEmail, newRole);
      setNewEmail('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Privilege Access</h2>
          <p className="text-muted-foreground">Manage user roles and system permissions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
        >
          <UserPlus size={20} />
          Add New User
        </button>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
            <h3 className="font-bold">User Management</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b text-left">
                  <th className="p-6 text-xs font-bold uppercase tracking-wider">User</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider">Role</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider">Created At</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-accent/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.displayName || 'User'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit",
                        user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-muted-foreground font-mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => onRemoveUser(user.uid)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b flex items-center justify-between bg-primary/5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus size={24} className="text-primary" />
                  Add New User
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase">Assign Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setNewRole('user')}
                      className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all",
                        newRole === 'user' ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                      )}
                    >
                      <User size={24} />
                      <span className="text-sm font-bold">User</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole('admin')}
                      className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all",
                        newRole === 'admin' ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                      )}
                    >
                      <Shield size={24} />
                      <span className="text-sm font-bold">Admin</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border rounded-xl font-bold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
