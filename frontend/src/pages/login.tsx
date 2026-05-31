import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';

interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

const DEMO_USERS = [
  {
    email: 'admin@wms.local',
    password: 'admin123456',
    name: 'Admin Warehouse',
    role: 'ADMIN_WAREHOUSE',
    description: 'Full access — manage catalog, approve operations, view analytics',
    icon: '👑',
  },
  {
    email: 'manager@wms.local',
    password: 'admin123456',
    name: 'Manager Warehouse',
    role: 'WAREHOUSE_MANAGER',
    description: 'Approve/reject operations, manage inventory thresholds',
    icon: '📋',
  },
  {
    email: 'staff@wms.local',
    password: 'admin123456',
    name: 'Staff Member',
    role: 'WAREHOUSE_STAFF',
    description: 'Create import/export operations, view inventory',
    icon: '🏭',
  },
];

export function LoginPage() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doLogin(email, password);
  };

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    setLoading(true);

    try {
      const result = await api.post<LoginResponse>('/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      login(result.data.accessToken, result.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoUser = (user: typeof DEMO_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    doLogin(user.email, user.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-1">WMS</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Warehouse Management System
        </p>

        {/* Demo Users */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Quick Login — Demo Users
          </p>
          <div className="space-y-2">
            {DEMO_USERS.map((user) => (
              <button
                key={user.email}
                onClick={() => selectDemoUser(user)}
                disabled={loading}
                className="w-full flex items-start gap-3 p-3 border rounded-lg text-left hover:bg-accent transition-colors disabled:opacity-50"
              >
                <span className="text-xl mt-0.5">{user.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {user.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">or sign in manually</span>
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
