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
    console.log('🔐 [AuthService] login() chamado com:', { email: credentials.email });
    
    try {
      console.log('📤 [AuthService] Enviando POST /auth/login...');
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);

      console.log('📥 [AuthService] Resposta recebida:', { success: data.success, message: data.message });

      if (!data.success) {
        console.error('❌ [AuthService] Login falhou:', data.message);
        throw new Error(data.message || 'Erro ao fazer login');
      }

      const { user, token } = data.data;

      console.log('💾 [AuthService] Salvando token no storage...');
      // Salva token e usuário no storage
      await storage.multiSet([
        [this.TOKEN_KEY, token],
        [this.USER_KEY, JSON.stringify(user)],
      ]);

      console.log('✅ [AuthService] Login bem-sucedido para:', user.email);
      console.log('🔑 [AuthService] Token salvo:', token.substring(0, 30) + '...');
      
      return { user, token };
    } catch (error) {
      console.error('❌ [AuthService] Erro no login:', error);
      throw error;
    }
  }

  /**
   * Registra novo usuário
   */
  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    console.log('🔐 [AuthService] register() chamado com:', { email: userData.email });
    
    try {
      console.log('📤 [AuthService] Enviando POST /auth/register...');
      const { data } = await api.post<AuthResponse>('/auth/register', userData);

      console.log('📥 [AuthService] Resposta recebida:', { success: data.success, message: data.message });

      if (!data.success) {
        console.error('❌ [AuthService] Registro falhou:', data.message);
        throw new Error(data.message || 'Erro ao registrar');
      }

      const { user, token } = data.data;

      console.log('💾 [AuthService] Salvando token no storage...');
      // Salva token e usuário no storage
      await storage.multiSet([
        [this.TOKEN_KEY, token],
        [this.USER_KEY, JSON.stringify(user)],
      ]);

      console.log('✅ [AuthService] Registro bem-sucedido para:', user.email);
      console.log('🔑 [AuthService] Token salvo:', token.substring(0, 30) + '...');
      
      return { user, token };
    } catch (error) {
      console.error('❌ [AuthService] Erro no registro:', error);
      throw error;
    }
  }

  /**
   * Obtém dados do usuário autenticado
   */
  async me(): Promise<User> {
    console.log('👤 [AuthService] me() chamado - buscando dados do usuário autenticado');
    
    try {
      console.log('📤 [AuthService] Enviando GET /auth/me...');
      const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/me');

      console.log('📥 [AuthService] Resposta recebida:', { success: data.success, message: data.message });

      if (!data.success || !data.data) {
        console.error('❌ [AuthService] Erro ao buscar usuário');
        throw new Error('Erro ao buscar usuário');
      }

      const { user } = data.data;

      console.log('💾 [AuthService] Atualizando dados do usuário no storage...');
      // Atualiza dados do usuário no storage
      await storage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log('✅ [AuthService] Dados do usuário atualizados:', user.email);

      return user;
    } catch (error) {
      console.error('❌ [AuthService] Erro ao buscar usuário autenticado:', error);
      throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    console.log('🔓 [AuthService] logout() chamado');
    
    // Remove dados locais primeiro (importante para garantir limpeza)
    console.log('💾 [AuthService] Removendo token e usuário do storage...');
    await storage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
    console.log('✅ [AuthService] Token e usuário removidos do storage');
    
    try {
      // Tenta fazer logout no servidor (opcional, já limpamos localmente)
      // Nota: Pode retornar 401 pois removemos o token antes, mas isso é esperado
      console.log('📤 [AuthService] Notificando servidor sobre logout...');
      await api.post('/auth/logout');
      console.log('✅ [AuthService] Servidor notificado com sucesso');
    } catch (error: any) {
      // Ignora erro do servidor (especialmente 401), já limpamos localmente
      // 401 é esperado pois removemos o token antes de chamar o servidor
      if (error?.response?.status === 401) {
        console.log('ℹ️ [AuthService] Token já removido (esperado) - 401 recebido');
      } else {
        console.warn('⚠️ [AuthService] Servidor não foi notificado (não crítico):', error?.message);
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
