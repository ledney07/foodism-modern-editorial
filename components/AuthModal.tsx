import React, { useState } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';
import { signIn, signUp, User as UserType } from '../utils/auth';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
};

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps): React.ReactElement => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = signUp(email, password, name);
      } else {
        result = signIn(email, password);
      }

      if (result.success && result.user) {
        onSuccess(result.user);
        handleReset();
        onClose();
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp);
    handleReset();
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 md:p-12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-[#f9b233] transition-colors group"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-neutral-600 group-hover:text-black transition-colors" />
        </button>

        <div className="mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-black mb-2">
            {isSignUp ? 'Create Admin Account' : 'Admin Login'}
          </h2>
          <p className="text-neutral-500 text-sm">
            {isSignUp ? 'Sign up to manage articles and comments' : 'Sign in to access the admin dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg text-base font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg text-base font-medium"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg text-base font-medium"
                placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'}
              />
            </div>
            {isSignUp && (
              <p className="text-xs text-neutral-400 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f9b233] text-black px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#e5a022] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleSwitchMode}
            className="text-sm text-neutral-500 hover:text-[#f9b233] transition-colors underline underline-offset-4"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

