/**
 * Serviço de Autenticação
 * 
 * Gerencia login, logout, registro e obtenção do usuário autenticado
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
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

    // Salva token e usuário no AsyncStorage
    await AsyncStorage.multiSet([
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

    // Salva token e usuário no AsyncStorage
    await AsyncStorage.multiSet([
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

    // Atualiza dados do usuário no AsyncStorage
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return user;
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      // Tenta fazer logout no servidor
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
      // Continua com logout local mesmo se falhar no servidor
    } finally {
      // Remove dados locais
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
    }
  }

  /**
   * Verifica se existe token salvo
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  /**
   * Obtém token salvo
   */
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtém usuário salvo
   */
  async getStoredUser(): Promise<User | null> {
    const userJson = await AsyncStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}

export default new AuthService();
