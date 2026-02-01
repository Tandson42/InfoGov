/**
 * Tipos e interfaces globais da aplicação
 * Baseados nos DTOs do backend Laravel
 */

// ============================================
// AUTENTICAÇÃO
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role?: Role;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type RoleName = 'administrador' | 'servidor' | 'cidadao';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

// ============================================
// DEPARTAMENTOS
// ============================================

export interface Department {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DepartmentFormData {
  name: string;
  code: string;
  active: boolean;
}

export interface DepartmentListParams {
  page?: number;
  per_page?: number;
  name?: string;
  code?: string;
  active?: 'true' | 'false' | 'all';
  sort_by?: 'name' | 'code' | 'active' | 'created_at' | 'updated_at';
  sort_direction?: 'asc' | 'desc';
  with_trashed?: boolean;
}

// ============================================
// RESPOSTAS DA API
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ValidationError {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

// ============================================
// NAVEGAÇÃO
// ============================================

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Departments: undefined;
  Profile: undefined;
  Admin: undefined;
};

export type DepartmentStackParamList = {
  DepartmentList: undefined;
  DepartmentDetail: { id: number };
  DepartmentForm: { id?: number };
};

// ============================================
// CONTEXTO DE AUTENTICAÇÃO
// ============================================

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  signed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: () => Promise<void>;
}

// ============================================
// HOOKS
// ============================================

export interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
