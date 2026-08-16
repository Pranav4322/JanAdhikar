import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [voterId, setVoterId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, voterId.toUpperCase());
      }
      navigate('/report');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-jan-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-jan-orange flex items-center justify-center">
            <Building2 className="text-white" size={20} />
          </div>
          <span className="font-bold text-lg text-jan-dark">JanAdhar</span>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              mode === 'login' ? 'bg-white text-jan-dark shadow-sm' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              mode === 'register' ? 'bg-white text-jan-dark shadow-sm' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <h1 className="text-xl font-bold text-jan-dark mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === 'login' ? 'Log in to file and track complaints.' : 'Voter ID verification required to register.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-sm font-medium text-jan-dark">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-jan-orange"
                placeholder="Pranav Kumar"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-jan-dark">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-jan-orange"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-jan-dark">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-jan-orange"
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-sm font-medium text-jan-dark">Voter ID (EPIC Number)</label>
              <input
                type="text"
                required
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-jan-orange uppercase"
                placeholder="ABC1234567"
                maxLength={10}
              />
              <p className="text-xs text-gray-400 mt-1">Format: 3 letters + 7 digits, e.g. ABC1234567</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-jan-orange hover:bg-jan-orange-light text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}