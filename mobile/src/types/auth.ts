export interface User {
  id: number;
  full_name: string;
  email: string;
  avatar?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (full_name: string, email: string, password: string, avatar?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateAvatar: (avatar: string | null) => Promise<void>;
  clearError: () => void;
}
