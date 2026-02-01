/**
 * Tela de Login
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import theme from '../../theme';
import { handleAuthError } from '../../utils/toast';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    console.log('🔐 [LoginScreen] handleLogin() chamado');
    
    // Reset errors
    setErrors({});

    // Validação básica
    if (!email || !password) {
      console.warn('⚠️ [LoginScreen] Validação falhou - campos vazios');
      console.warn('⚠️ [LoginScreen] Email:', email ? '✓ preenchido' : '✗ vazio');
      console.warn('⚠️ [LoginScreen] Senha:', password ? '✓ preenchida' : '✗ vazia');
      
      setErrors({
        email: !email ? 'E-mail é obrigatório' : undefined,
        password: !password ? 'Senha é obrigatória' : undefined,
      });
      return;
    }

    console.log('✅ [LoginScreen] Validação passou - credenciais preenchidas');
    console.log('📊 [LoginScreen] Dados do login:', { email, password: '***' });

    setLoading(true);
    console.log('⏳ [LoginScreen] Estado loading definido como true');

    try {
      console.log('🔄 [LoginScreen] Chamando signIn()...');
      await signIn(email, password);
      console.log('✅ [LoginScreen] signIn() concluído com sucesso');
      // Login bem-sucedido - navegação automática pelo AuthContext
    } catch (error) {
      console.error('❌ [LoginScreen] Erro no signIn():', error);
      // Tratamento de erros com mensagens específicas
      handleAuthError(error);
    } finally {
      console.log('🏁 [LoginScreen] Finally - definindo loading como false');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <Text style={styles.logoIcon}>🏛️</Text>
            </View>
          </View>
          <Text style={styles.title}>InfoGov</Text>
          <Text style={styles.subtitle}>Sistema de Informações Governamentais</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            icon="mail"
            error={errors.email}
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed"
            error={errors.password}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="large"
            style={styles.loginButton}
          />

          <Text style={styles.infoText}>
            💡 Use as credenciais fornecidas pelo administrador do sistema
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.xl,
    borderWidth: 4,
    borderColor: theme.colors.primary.light,
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 56,
  },
  title: {
    fontSize: theme.fontSize.xxxl + 4,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: theme.fontWeight.medium,
    marginTop: theme.spacing.xs,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  form: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  loginButton: {
    marginTop: theme.spacing.lg,
  },
  infoText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  version: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.disabled,
  },
});
