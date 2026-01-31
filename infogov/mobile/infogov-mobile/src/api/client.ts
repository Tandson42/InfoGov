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
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base da API
// Android Emulator: http://10.0.2.2:8000/api/v1
// iOS Simulator: http://localhost:8000/api/v1
// Dispositivo físico: http://SEU_IP:8000/api/v1
const API_URL = __DEV__
  ? 'http://10.0.2.2:8000/api/v1'
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
      const token = await AsyncStorage.getItem('@InfoGov:token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta
 * Trata erros globalmente
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Token inválido ou expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Remove token e dados do usuário
        await AsyncStorage.multiRemove([
          '@InfoGov:token',
          '@InfoGov:user',
        ]);

        // Emite evento para navegação fazer logout
        // (será capturado pelo AuthContext)
      } catch (clearError) {
        console.error('Erro ao limpar storage:', clearError);
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
