// Simple authentication utility using localStorage

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Sign up a new admin user
export const signUp = (email: string, password: string, name: string): { success: boolean; error?: string; user?: User } => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Not available on server' };
  }

  // Simple validation
  if (!email || !password || !name) {
    return { success: false, error: 'All fields are required' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Check if user already exists
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'User with this email already exists' };
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  // Store user
  users.push(newUser);
  localStorage.setItem('adminUsers', JSON.stringify(users));

  // Store password (in real app, this would be hashed!)
  const passwords: Record<string, string> = JSON.parse(localStorage.getItem('adminPasswords') || '{}');
  passwords[newUser.id] = password; // In production, hash this!
  localStorage.setItem('adminPasswords', JSON.stringify(passwords));

  // Auto-login
  localStorage.setItem('currentUser', JSON.stringify(newUser));

  return { success: true, user: newUser };
};

// Sign in existing user
export const signIn = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Not available on server' };
  }

  // Simple validation
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  // Find user
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Check password (in real app, this would compare hashes!)
  const passwords: Record<string, string> = JSON.parse(localStorage.getItem('adminPasswords') || '{}');
  if (passwords[user.id] !== password) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Set current user
  localStorage.setItem('currentUser', JSON.stringify(user));

  return { success: true, user };
};

// Sign out current user
export const signOut = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
};

// Get all users (for admin purposes)
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const usersStr = localStorage.getItem('adminUsers');
  if (!usersStr) return [];
  try {
    return JSON.parse(usersStr);
  } catch {
    return [];
  }
};

