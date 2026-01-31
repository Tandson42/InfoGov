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
    // Reset errors
    setErrors({});

    // Validação básica
    if (!email || !password) {
      setErrors({
        email: !email ? 'E-mail é obrigatório' : undefined,
        password: !password ? 'Senha é obrigatória' : undefined,
      });
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      // Login bem-sucedido - navegação automática pelo AuthContext
    } catch (error) {
      // Tratamento de erros com mensagens específicas
      handleAuthError(error);
    } finally {
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
            <Text style={styles.logoIcon}>🏛️</Text>
          </View>
          <Text style={styles.title}>InfoGov</Text>
          <Text style={styles.subtitle}>Sistema de Informações Governamentais</Text>
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
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  logoIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  infoText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
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
