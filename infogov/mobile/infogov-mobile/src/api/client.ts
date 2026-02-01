/**
 * Cliente Axios configurado para comunicação com a API Laravel
 * 
 * Características:
 * - Base URL configurável via ambiente
 * - Interceptors para adicionar token automaticamente
 * - Tratamento centralizado de erros
 * - Suporte a refresh em caso de 401
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import storage from '../utils/storage';

// URL base da API
// Android Emulator: http://10.0.2.2:8000/api/v1
// iOS Simulator: http://localhost:8000/api/v1
// Web: http://localhost:8000/api/v1
// Dispositivo físico: http://SEU_IP:8000/api/v1
const API_URL = __DEV__
  ? (typeof window !== 'undefined' 
      ? 'http://192.168.100.64:8000/api/v1'  // Web
      : 'http://192.168.100.64:8000/api/v1')  // Mobile
  : 'https://sua-api-producao.com/api/v1';

/**
 * Instância do Axios configurada
 */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de requisição
 * Adiciona o token de autenticação automaticamente
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await storage.getItem('@InfoGov:token');
      
      console.log('🔐 [Axios Request] URL:', config.url);
      console.log('🔐 [Axios Request] Método:', config.method?.toUpperCase());
      console.log('🔐 [Axios Request] Token existente:', token ? `✓ ${token.substring(0, 30)}...` : '✗ Nenhum');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ [Axios Request] Authorization header adicionado');
        console.log('📝 [Axios Request] Headers:', {
          'Content-Type': config.headers['Content-Type'],
          'Authorization': `Bearer ${token.substring(0, 30)}...`,
          'Accept': config.headers['Accept'],
        });
      } else {
        // Não mostra aviso para /auth/logout pois removemos o token antes intencionalmente
        if (!config.url?.includes('/auth/logout')) {
          console.warn('⚠️ [Axios Request] Token não encontrado no storage para:', config.url);
        }
      }
    } catch (error) {
      console.error('❌ [Axios Request] Erro ao recuperar token:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [Axios Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta
 * Trata erros globalmente
 */
api.interceptors.response.use(
  (response) => {
    console.log('✅ [Axios Response] Status:', response.status);
    console.log('✅ [Axios Response] URL:', response.config.url);
    console.log('✅ [Axios Response] Data:', response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    console.error('❌ [Axios Response Error]');
    console.error('❌ [Axios Response Error] URL:', error.config?.url);
    console.error('❌ [Axios Response Error] Status:', error.response?.status);
    console.error('❌ [Axios Response Error] Message:', error.message);
    console.error('❌ [Axios Response Error] Data:', error.response?.data);

    // Erro de rede (servidor inacessível)
    if (!error.response) {
      // Transforma erro de rede em mensagem mais amigável
      console.error('❌ [Axios Response Error] ERRO DE REDE - Servidor inacessível');
      const networkError = new Error('Network Error');
      networkError.message = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.';
      return Promise.reject(networkError);
    }

    // Token inválido ou expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn('⚠️ [Axios Response Error] Token inválido/expirado (401) - Limpando storage...');
      originalRequest._retry = true;

      try {
        // Remove token e dados do usuário
        await storage.multiRemove([
          '@InfoGov:token',
          '@InfoGov:user',
        ]);
        console.log('✅ [Axios Response Error] Storage limpo com sucesso');

        // Emite evento para navegação fazer logout
        // (será capturado pelo AuthContext)
      } catch (clearError) {
        console.error('❌ [Axios Response Error] Erro ao limpar storage:', clearError);
      }
    }

    // Erro de validação (422)
    if (error.response?.status === 422) {
      const validationError = error.response.data as {
        success: false;
        message: string;
        errors: Record<string, string[]>;
      };
      
      console.log('Erros de validação:', validationError.errors);
    }

    // Erro de autorização (403)
    if (error.response?.status === 403) {
      console.log('Acesso negado');
    }

    return Promise.reject(error);
  }
);

/**
 * Helper para obter mensagem de erro
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string };
    return data?.message || error.message || 'Erro ao processar requisição';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Erro desconhecido';
};

/**
 * Helper para obter erros de validação
 */
export const getValidationErrors = (error: unknown): Record<string, string[]> => {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    const data = error.response.data as { errors?: Record<string, string[]> };
    return data?.errors || {};
  }
  
  return {};
};

export default api;
