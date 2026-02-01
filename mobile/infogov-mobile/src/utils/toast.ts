/**
 * Utilitário para exibir notificações Toast
 */

import { Alert } from 'react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
}

/**
 * Exibe um toast/alerta
 */
export function showToast({ title, message, type = 'info' }: ToastOptions) {
  Alert.alert(title, message);
}

/**
 * Exibe toast de sucesso
 */
export function showSuccess(title: string, message?: string) {
  Alert.alert('✅ ' + title, message);
}

/**
 * Exibe toast de erro
 */
export function showError(title: string, message?: string) {
  Alert.alert('❌ ' + title, message);
}

/**
 * Exibe toast de aviso
 */
export function showWarning(title: string, message?: string) {
  Alert.alert('⚠️ ' + title, message);
}

/**
 * Exibe toast de info
 */
export function showInfo(title: string, message?: string) {
  Alert.alert('ℹ️ ' + title, message);
}

/**
 * Trata erros de autenticação e exibe mensagem apropriada
 */
export function handleAuthError(error: unknown) {
  if (!error) {
    showError('Erro desconhecido', 'Tente novamente');
    return;
  }

  // Erro de rede (servidor fora do ar)
  if (error instanceof Error) {
    if (
      error.message.includes('Network Error') ||
      error.message.includes('Network request failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('timeout')
    ) {
      showError(
        'Servidor Fora do Ar',
        'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
      );
      return;
    }
  }

  // Erro de credenciais inválidas
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (
    errorMessage.includes('Credenciais inválidas') ||
    errorMessage.includes('401') ||
    errorMessage.includes('Unauthorized')
  ) {
    showError(
      'Login ou Senha Incorretos',
      'Verifique suas credenciais e tente novamente.'
    );
    return;
  }

  // Erro de validação
  if (errorMessage.includes('validação') || errorMessage.includes('422')) {
    showError(
      'Dados Inválidos',
      'Verifique os campos e tente novamente.'
    );
    return;
  }

  // Erro genérico
  showError(
    'Erro ao Fazer Login',
    errorMessage || 'Ocorreu um erro inesperado. Tente novamente.'
  );
}

/**
 * Trata erros de requisições gerais
 */
export function handleRequestError(error: unknown, context: string = 'operação') {
  if (!error) {
    showError('Erro desconhecido', 'Tente novamente');
    return;
  }

  // Erro de rede
  if (error instanceof Error) {
    if (
      error.message.includes('Network Error') ||
      error.message.includes('Network request failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('timeout')
    ) {
      showError(
        'Servidor Fora do Ar',
        'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
      );
      return;
    }
  }

  // Erro genérico
  const errorMessage = error instanceof Error ? error.message : String(error);
  showError(
    `Erro ao ${context}`,
    errorMessage || 'Ocorreu um erro inesperado.'
  );
}
