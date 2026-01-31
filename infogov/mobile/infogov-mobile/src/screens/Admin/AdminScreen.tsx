/**
 * Tela de Administração
 * Visível apenas para Administradores
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import theme from '../../theme';

export default function AdminScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={48} color={theme.colors.error.main} />
        <Text style={styles.title}>Painel Administrativo</Text>
        <Text style={styles.subtitle}>
          Área restrita para administradores do sistema
        </Text>
      </View>

      <Card variant="elevated">
        <View style={styles.featureItem}>
          <Ionicons name="people" size={24} color={theme.colors.primary.main} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Gerenciar Usuários</Text>
            <Text style={styles.featureDescription}>
              Criar, editar e remover usuários do sistema
            </Text>
          </View>
        </View>
      </Card>

      <Card variant="elevated">
        <View style={styles.featureItem}>
          <Ionicons name="business" size={24} color={theme.colors.primary.main} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Gerenciar Departamentos</Text>
            <Text style={styles.featureDescription}>
              Criar, editar e remover departamentos
            </Text>
          </View>
        </View>
      </Card>

      <Card variant="elevated">
        <View style={styles.featureItem}>
          <Ionicons name="bar-chart" size={24} color={theme.colors.primary.main} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Relatórios</Text>
            <Text style={styles.featureDescription}>
              Visualizar estatísticas e gerar relatórios
            </Text>
          </View>
        </View>
      </Card>

      <Card variant="flat" style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color={theme.colors.warning.main} />
        <Text style={styles.infoText}>
          Esta seção está em desenvolvimento. Em breve novas funcionalidades estarão disponíveis.
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.warning.main}10`,
    marginTop: theme.spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});
