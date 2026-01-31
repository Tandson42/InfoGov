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
    try {
      const [token, storedUser] = await Promise.all([
        authService.getToken(),
        authService.getStoredUser(),
      ]);

      if (token && storedUser) {
        setUser(storedUser);
        
        // Atualiza dados do usuário do servidor
        try {
          const updatedUser = await authService.me();
          setUser(updatedUser);
        } catch (error) {
          // Se falhar, mantém dados locais
          console.log('Erro ao atualizar usuário:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Realiza login
   */
  async function signIn(email: string, password: string) {
    try {
      const { user: loggedUser } = await authService.login({ email, password });
      setUser(loggedUser);
    } catch (error) {
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
    try {
      // Remove dados locais primeiro para garantir que o estado seja atualizado
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo se falhar no servidor, remove dados locais
      try {
        await authService.logout();
      } catch (e) {
        console.error('Erro ao limpar dados locais:', e);
      }
    }
    
    // Garante que o estado seja limpo (fora do finally para sempre executar)
    setUser(null);
    setLoading(false);
    
    console.log('✅ Logout concluído - usuário removido do estado, redirecionando para login...');
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
