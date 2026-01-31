/**
 * Tela de Listagem de Departamentos
 * Com busca, filtros e paginação
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import departmentService from '../../api/department.service';
import { Department } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import theme from '../../theme';
import { formatDate } from '../../utils/helpers';

type FilterType = 'all' | 'active' | 'inactive';

export default function DepartmentListScreen() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const isAdmin = user?.role?.name === 'administrador';

  useEffect(() => {
    loadDepartments();
  }, [filter]);

  const loadDepartments = async () => {
    try {
      const params: any = {
        per_page: 50,
        sort_by: 'name',
        sort_direction: 'asc',
      };

      if (search) {
        params.name = search;
      }

      if (filter !== 'all') {
        params.active = filter === 'active' ? 'true' : 'false';
      }

      const response = await departmentService.list(params);
      setDepartments(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os departamentos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDepartments();
  }, [filter, search]);

  const handleSearch = () => {
    loadDepartments();
  };

  const handleDelete = async (id: number, name: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o departamento "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await departmentService.delete(id);
              Alert.alert('Sucesso', 'Departamento excluído com sucesso');
              loadDepartments();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o departamento');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Department }) => (
    <Card variant="elevated">
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.departmentName}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              item.active ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {item.active ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        </View>

        {isAdmin && (
          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.name)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash" size={20} color={theme.colors.error.main} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.departmentCode}>Código: {item.code}</Text>
      <Text style={styles.departmentDate}>
        Criado em: {formatDate(item.created_at)}
      </Text>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="business-outline"
        size={64}
        color={theme.colors.gray[300]}
      />
      <Text style={styles.emptyText}>Nenhum departamento encontrado</Text>
      <Text style={styles.emptySubtext}>
        {search ? 'Tente buscar com outros termos' : 'Não há departamentos cadastrados'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.gray[500]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar departamento..."
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'active' && styles.filterActive,
          ]}
          onPress={() => setFilter('active')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'active' && styles.filterTextActive,
            ]}
          >
            Ativos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'inactive' && styles.filterActive,
          ]}
          onPress={() => setFilter('inactive')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'inactive' && styles.filterTextActive,
            ]}
          >
            Inativos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={departments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.main]}
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  departmentName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  activeBadge: {
    backgroundColor: theme.colors.success.main,
  },
  inactiveBadge: {
    backgroundColor: theme.colors.gray[500],
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: '#fff',
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  departmentCode: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  departmentDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.disabled,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.disabled,
    marginTop: theme.spacing.xs,
  },
});
