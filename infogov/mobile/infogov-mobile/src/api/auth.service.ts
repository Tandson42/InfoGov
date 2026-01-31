/**
 * Serviço de Autenticação
 * 
 * Gerencia login, logout, registro e obtenção do usuário autenticado
 */

import storage from '../utils/storage';
import api from './client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
} from '../types';

class AuthService {
  private readonly TOKEN_KEY = '@InfoGov:token';
  private readonly USER_KEY = '@InfoGov:user';

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);

    if (!data.success) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    const { user, token } = data.data;

    // Salva token e usuário no storage
    await storage.multiSet([
      [this.TOKEN_KEY, token],
      [this.USER_KEY, JSON.stringify(user)],
    ]);

    return { user, token };
  }

  /**
   * Registra novo usuário
   */
  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);

    if (!data.success) {
      throw new Error(data.message || 'Erro ao registrar');
    }

    const { user, token } = data.data;

    // Salva token e usuário no storage
    await storage.multiSet([
      [this.TOKEN_KEY, token],
      [this.USER_KEY, JSON.stringify(user)],
    ]);

    return { user, token };
  }

  /**
   * Obtém dados do usuário autenticado
   */
  async me(): Promise<User> {
    const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/me');

    if (!data.success || !data.data) {
      throw new Error('Erro ao buscar usuário');
    }

    const { user } = data.data;

    // Atualiza dados do usuário no storage
    await storage.setItem(this.USER_KEY, JSON.stringify(user));

    return user;
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    // Remove dados locais primeiro (importante para garantir limpeza)
    await storage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
    
    console.log('🔓 Logout: Token e usuário removidos do storage');
    
    try {
      // Tenta fazer logout no servidor (opcional, já limpamos localmente)
      // Nota: Pode retornar 401 pois removemos o token antes, mas isso é esperado
      await api.post('/auth/logout');
      console.log('✅ Logout: Servidor notificado com sucesso');
    } catch (error: any) {
      // Ignora erro do servidor (especialmente 401), já limpamos localmente
      // 401 é esperado pois removemos o token antes de chamar o servidor
      if (error?.response?.status === 401) {
        console.log('ℹ️ Logout: Token já removido (esperado)');
      } else {
        console.warn('⚠️ Logout: Servidor não foi notificado (não crítico):', error);
      }
    }
  }

  /**
   * Verifica se existe token salvo
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await storage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  /**
   * Obtém token salvo
   */
  async getToken(): Promise<string | null> {
    return await storage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtém usuário salvo
   */
  async getStoredUser(): Promise<User | null> {
    const userJson = await storage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}

export default new AuthService();
