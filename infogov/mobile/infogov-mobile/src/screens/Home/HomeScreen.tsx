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
      <Card variant="elevated" style={styles.welcomeCard}>
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.greeting}>Bem-vindo,</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color={theme.colors.primary.main} />
            </View>
          </View>
          
          {user?.role && (
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: getRoleColor(user.role.name as any) },
              ]}
            >
              <Ionicons 
                name="shield-checkmark" 
                size={16} 
                color="#fff" 
                style={styles.roleIcon}
              />
              <Text style={styles.roleText}>
                {getRoleName(user.role.name as any)}
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* Estatísticas Rápidas */}
      <View style={styles.statsSection}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.primary.main}15` }]}>
            <Ionicons
              name="business"
              size={28}
              color={theme.colors.primary.main}
            />
          </View>
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>Departamentos</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.secondary.main}15` }]}>
            <Ionicons 
              name="people" 
              size={28} 
              color={theme.colors.secondary.main} 
            />
          </View>
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
  welcomeCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary.main,
    borderWidth: 0,
  },
  welcomeSection: {
    padding: theme.spacing.sm,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  greeting: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.fontWeight.medium,
  },
  userName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
    marginTop: theme.spacing.xs,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  roleIcon: {
    marginRight: 2,
  },
  roleText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: '#fff',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
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
    minHeight: 140,
  },
  statValue: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
    letterSpacing: 0.3,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  actionIcon: {
    width: 52,
    height: 52,
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
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
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
