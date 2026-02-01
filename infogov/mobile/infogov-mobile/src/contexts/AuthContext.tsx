/**
 * Context de Autenticação
 * 
 * Gerencia o estado global de autenticação da aplicação
 */

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from '../api/auth.service';
import { User, RegisterRequest, AuthContextData } from '../types';
import { getErrorMessage } from '../api/client';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Carrega dados salvos ao iniciar o app
   */
  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    console.log('🔄 [AuthContext] loadStorageData() chamado - carregando dados armazenados');
    
    try {
      console.log('💾 [AuthContext] Buscando token e usuário do storage...');
      const [token, storedUser] = await Promise.all([
        authService.getToken(),
        authService.getStoredUser(),
      ]);

      console.log('📊 [AuthContext] Dados carregados:', {
        token: token ? `✓ ${token.substring(0, 30)}...` : '✗ Não encontrado',
        usuario: storedUser ? `✓ ${storedUser.email}` : '✗ Não encontrado',
      });

      if (token && storedUser) {
        console.log('✅ [AuthContext] Token e usuário encontrados - carregando usuário local');
        setUser(storedUser);
        
        // Atualiza dados do usuário do servidor
        try {
          console.log('🔄 [AuthContext] Atualizando dados do usuário do servidor...');
          const updatedUser = await authService.me();
          console.log('✅ [AuthContext] Dados do usuário atualizados com sucesso');
          setUser(updatedUser);
        } catch (error) {
          // Se falhar, mantém dados locais
          console.log('⚠️ [AuthContext] Erro ao atualizar usuário (mantendo dados locais):', error);
        }
      } else {
        console.log('ℹ️ [AuthContext] Nenhum token ou usuário encontrado - usuário não autenticado');
      }
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao carregar dados:', error);
    } finally {
      console.log('✅ [AuthContext] Loading finalizado');
      setLoading(false);
    }
  }

  /**
   * Realiza login
   */
  async function signIn(email: string, password: string) {
    console.log('🔐 [AuthContext] signIn() chamado para:', email);
    
    try {
      console.log('⏳ [AuthContext] Chamando authService.login()...');
      const { user: loggedUser } = await authService.login({ email, password });
      
      console.log('✅ [AuthContext] Login bem-sucedido - atualizando estado');
      setUser(loggedUser);
      console.log('👤 [AuthContext] Usuário definido no estado:', loggedUser.email);
    } catch (error) {
      console.error('❌ [AuthContext] Erro no login:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Realiza registro
   */
  async function signUp(data: RegisterRequest) {
    try {
      const { user: registeredUser } = await authService.register(data);
      setUser(registeredUser);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Realiza logout
   */
  async function signOut() {
    console.log('🔓 [AuthContext] signOut() chamado');
    
    try {
      // Remove dados locais primeiro para garantir que o estado seja atualizado
      console.log('⏳ [AuthContext] Chamando authService.logout()...');
      await authService.logout();
      console.log('✅ [AuthContext] authService.logout() concluído');
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao fazer logout:', error);
      // Mesmo se falhar no servidor, remove dados locais
      try {
        console.log('🔄 [AuthContext] Tentando limpar dados novamente...');
        await authService.logout();
        console.log('✅ [AuthContext] Dados limpos com sucesso');
      } catch (e) {
        console.error('❌ [AuthContext] Erro ao limpar dados locais:', e);
      }
    }
    
    // Garante que o estado seja limpo (fora do finally para sempre executar)
    console.log('🧹 [AuthContext] Limpando estado da aplicação...');
    setUser(null);
    setLoading(false);
    
    console.log('✅ [AuthContext] Logout concluído - usuário removido do estado, redirecionando para login...');
  }

  /**
   * Atualiza dados do usuário
   */
  async function updateUser() {
    try {
      const updatedUser = await authService.me();
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signed: !!user,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
