/**
 * Tela de Perfil do Usuário
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import theme from '../../theme';
import { formatDateTime, getRoleName, getRoleColor } from '../../utils/helpers';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = () => {
    console.log('🔴 handleLogout chamado!');
    
    // Na web, Alert pode não funcionar bem, então vamos usar confirm
    const isWeb = typeof window !== 'undefined' && typeof (window as any).confirm === 'function';
    
    if (isWeb) {
      // Na web, usa window.confirm
      const confirmed = (window as any).confirm('Deseja realmente sair da aplicação?');
      if (confirmed) {
        console.log('✅ Usuário confirmou logout');
        performLogout();
      } else {
        console.log('❌ Usuário cancelou logout');
      }
    } else {
      // No mobile, usa Alert
      Alert.alert('Sair', 'Deseja realmente sair da aplicação?', [
        { text: 'Cancelar', style: 'cancel', onPress: () => console.log('❌ Usuário cancelou logout') },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            console.log('✅ Usuário confirmou logout');
            performLogout();
          },
        },
      ]);
    }
  };

  const performLogout = async () => {
    console.log('🚀 Iniciando processo de logout...');
    setLoggingOut(true);
    
    try {
      console.log('📞 Chamando signOut()...');
      await signOut();
      console.log('✅ signOut() concluído com sucesso');
      
      // Pequeno delay para garantir que o estado seja atualizado
      setTimeout(() => {
        setLoggingOut(false);
        console.log('🏁 Logout finalizado');
      }, 100);
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      const isWeb = typeof window !== 'undefined' && typeof (window as any).alert === 'function';
      if (isWeb) {
        (window as any).alert('Erro: Não foi possível sair. Tente novamente.');
      } else {
        Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
      }
      setLoggingOut(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar e Nome */}
      <View style={styles.headerSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>

        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {user?.role && (
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: getRoleColor(user.role.name as any) },
            ]}
          >
            <Text style={styles.roleText}>
              {getRoleName(user.role.name as any)}
            </Text>
          </View>
        )}
      </View>

      {/* Informações do Perfil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        <Card variant="outlined">
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="mail"
                size={20}
                color={theme.colors.primary.main}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        <Card variant="outlined">
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={theme.colors.primary.main}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Papel no Sistema</Text>
              <Text style={styles.infoValue}>
                {user?.role ? getRoleName(user.role.name as any) : '-'}
              </Text>
              {user?.role?.description && (
                <Text style={styles.infoDescription}>
                  {user.role.description}
                </Text>
              )}
            </View>
          </View>
        </Card>

        <Card variant="outlined">
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="calendar"
                size={20}
                color={theme.colors.primary.main}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Membro desde</Text>
              <Text style={styles.infoValue}>
                {user?.created_at ? formatDateTime(user.created_at) : '-'}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Configurações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>

        <Card variant="outlined">
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons
                name="notifications"
                size={20}
                color={theme.colors.gray[600]}
              />
            </View>
            <Text style={styles.menuText}>Notificações</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.gray[400]}
            />
          </TouchableOpacity>
        </Card>

        <Card variant="outlined">
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons
                name="lock-closed"
                size={20}
                color={theme.colors.gray[600]}
              />
            </View>
            <Text style={styles.menuText}>Privacidade e Segurança</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.gray[400]}
            />
          </TouchableOpacity>
        </Card>

        <Card variant="outlined">
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons
                name="help-circle"
                size={20}
                color={theme.colors.gray[600]}
              />
            </View>
            <Text style={styles.menuText}>Ajuda e Suporte</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.gray[400]}
            />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Botão de Sair */}
      <Button
        title="Sair da Conta"
        variant="danger"
        onPress={() => {
          console.log('🖱️ Botão "Sair da Conta" clicado!');
          handleLogout();
        }}
        loading={loggingOut}
        disabled={loggingOut}
        style={styles.logoutButton}
      />

      <Text style={styles.versionText}>InfoGov Mobile v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    padding: theme.spacing.md,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  userName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  roleBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  roleText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: '#fff',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary.main}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  infoDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.disabled,
    marginTop: theme.spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  logoutButton: {
    marginBottom: theme.spacing.lg,
  },
  versionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.disabled,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
});
