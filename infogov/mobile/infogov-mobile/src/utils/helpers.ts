/**
 * Funções utilitárias
 */

import { RoleName } from '../types';

/**
 * Formata data para padrão brasileiro
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata data e hora para padrão brasileiro
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}

/**
 * Retorna nome amigável do papel
 */
export function getRoleName(role: RoleName): string {
  const roleNames: Record<RoleName, string> = {
    administrador: 'Administrador',
    servidor: 'Servidor',
    cidadao: 'Cidadão',
  };

  return roleNames[role] || role;
}

/**
 * Retorna cor do papel
 */
export function getRoleColor(role: RoleName): string {
  const roleColors: Record<RoleName, string> = {
    administrador: '#DC2626',
    servidor: '#2563EB',
    cidadao: '#059669',
  };

  return roleColors[role] || '#6B7280';
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Trunca texto com reticências
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Formata código para maiúsculas
 */
export function formatCode(code: string): string {
  return code.toUpperCase().trim();
}

/**
 * Delay assíncrono
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
