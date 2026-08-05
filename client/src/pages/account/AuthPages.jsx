import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { authAPI } from '../../api/endpoints';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        setAuth(res.user, res.tokens.accessToken);
        toast.success(`Welcome back, ${res.user.name}! 👋`);
        if (res.user.role !== 'CUSTOMER') {
          navigate('/admin/dashboard');
        } else {
          navigate('/account/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-coral flex items-center justify-center text-white mx-auto shadow-md">
            <Gift className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Welcome Back to Gifto</h1>
          <p className="text-xs text-gray-500">Log in to view orders & earn loyalty points</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-teal-700"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">Password</label>
              <Link to="/account/forgot-password" className="text-[11px] font-semibold text-teal-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-teal-700"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-teal text-white font-bold py-3.5 rounded-full shadow-lg hover:opacity-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Don't have an account?{' '}
          <Link to="/account/register" className="font-bold text-teal-700 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.register({ name, email, phone, password });
      if (res.success) {
        setAuth(res.user, res.tokens.accessToken);
        toast.success('Account registered! Earned 50 Bonus Loyalty Points 🎉');
        navigate('/account/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-gray-900">Create Gifto Account</h1>
          <p className="text-xs text-gray-500">Sign up & get 50 Welcome Loyalty Points!</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ayesha Khan"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-teal text-white font-bold py-3.5 rounded-full shadow-lg hover:opacity-95 transition-all text-xs uppercase tracking-wider mt-2"
          >
            {loading ? 'Creating...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already have an account?{' '}
          <Link to="/account/login" className="font-bold text-teal-700 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Password reset instructions sent to your email.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-xs text-gray-500">Enter your registered email to receive reset link</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs"
          />
          <button type="submit" className="w-full gradient-teal text-white font-bold py-3 rounded-full text-xs">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
