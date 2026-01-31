/**
 * Tela Home
 * Dashboard com informações gerais e acesso rápido
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import theme from '../../theme';
import { getRoleName, getRoleColor } from '../../utils/helpers';

export default function HomeScreen() {
  const { user } = useAuth();

  const quickActions = [
    {
      id: 'departments',
      title: 'Departamentos',
      icon: 'business' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.primary.main,
      description: 'Visualizar departamentos',
    },
    {
      id: 'profile',
      title: 'Meu Perfil',
      icon: 'person' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.secondary.main,
      description: 'Ver informações pessoais',
    },
  ];

  if (user?.role?.name === 'administrador') {
    quickActions.push({
      id: 'admin',
      title: 'Administração',
      icon: 'settings' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.error.main,
      description: 'Painel administrativo',
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabeçalho de Boas-vindas */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{user?.name}</Text>
        
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

      {/* Estatísticas Rápidas */}
      <View style={styles.statsSection}>
        <Card variant="elevated" style={styles.statCard}>
          <Ionicons
            name="business"
            size={32}
            color={theme.colors.primary.main}
          />
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>Departamentos</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <Ionicons name="people" size={32} color={theme.colors.secondary.main} />
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>Usuários</Text>
        </Card>
      </View>

      {/* Acesso Rápido */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>

        {quickActions.map((action) => (
          <Card key={action.id} variant="outlined">
            <View style={styles.actionCard}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${action.color}20` },
                ]}
              >
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>

              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.gray[400]}
              />
            </View>
          </Card>
        ))}
      </View>

      {/* Informações do Sistema */}
      <Card variant="flat" style={styles.infoCard}>
        <Ionicons
          name="information-circle"
          size={20}
          color={theme.colors.info.main}
        />
        <Text style={styles.infoText}>
          Sistema de Informações Governamentais - InfoGov Mobile v1.0.0
        </Text>
      </Card>
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
  welcomeSection: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  userName: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  roleText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: '#fff',
  },
  statsSection: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  actionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.info.main}10`,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});
