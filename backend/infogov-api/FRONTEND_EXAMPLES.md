# 🚀 Exemplos Práticos de Integração Frontend

Exemplos prontos para copiar e usar em React e React Native.

---

## 📱 React Native - Projeto Completo

### Estrutura de Pastas Sugerida

```
src/
├── services/
│   ├── api.js              # Configuração do Axios
│   ├── authService.js      # Serviço de autenticação
│   └── departmentService.js # Serviço de departamentos
├── contexts/
│   └── AuthContext.js      # Context de autenticação
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   └── DepartmentsScreen.js
└── components/
    └── DepartmentCard.js
```

### 1. Configuração do Axios

```javascript
// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = __DEV__
  ? 'http://10.0.2.2:8000/api/v1'  // Android Emulator
  : 'https://sua-api-producao.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expirado ou inválido
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      // Emitir evento ou navegar para login
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 2. Context de Autenticação

```javascript
// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        const { token, user } = response.data.data;

        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        setUser(user);

        return { success: true };
      }

      return {
        success: false,
        message: 'Credenciais inválidas',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
        errors: error.response?.data?.errors,
      };
    }
  }

  async function signUp(name, email, password, passwordConfirmation) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        setUser(user);

        return { success: true };
      }

      return { success: false, message: 'Erro no registro' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao registrar',
        errors: error.response?.data?.errors,
      };
    }
  }

  async function signOut() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      setUser(null);
    }
  }

  async function updateUser() {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const { user } = response.data.data;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.log('Erro ao atualizar usuário:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

### 3. Tela de Login Completa

```javascript
// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    setErrors({});

    if (!email || !password) {
      setErrors({
        email: !email ? ['O e-mail é obrigatório'] : [],
        password: !password ? ['A senha é obrigatória'] : [],
      });
      return;
    }

    setLoading(true);

    const result = await signIn(email, password);

    setLoading(false);

    if (result.success) {
      // Navegação é feita automaticamente pelo AuthContext
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        Alert.alert('Erro', result.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>InfoGov</Text>
        <Text style={styles.subtitle}>Sistema de Informações Governamentais</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email[0]}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password[0]}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>
            Não tem conta? <Text style={styles.linkTextBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3498DB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#3498DB',
    fontWeight: 'bold',
  },
});
```

### 4. Tela de Lista de Departamentos

```javascript
// src/screens/DepartmentsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import api from '../services/api';

export default function DepartmentsScreen({ navigation }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    loadDepartments();
  }, [filter]);

  const loadDepartments = async () => {
    try {
      const params = {
        per_page: 20,
        sort_by: 'name',
        sort_direction: 'asc',
      };

      if (search) {
        params.name = search;
      }

      if (filter !== 'all') {
        params.active = filter === 'active';
      }

      const response = await api.get('/departments', { params });

      if (response.data.data) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.log('Erro ao carregar departamentos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDepartments();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DepartmentDetail', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View
          style={[
            styles.badge,
            item.active ? styles.badgeActive : styles.badgeInactive,
          ]}
        >
          <Text style={styles.badgeText}>
            {item.active ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
      <Text style={styles.cardCode}>Código: {item.code}</Text>
      <Text style={styles.cardDate}>
        Criado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar departamento..."
          onSubmitEditing={loadDepartments}
          returnKeyType="search"
        />
      </View>

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

      <FlatList
        data={departments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum departamento encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeActive: {
    backgroundColor: '#27AE60',
  },
  badgeInactive: {
    backgroundColor: '#95A5A6',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
```

---

## 🌐 React Web - Exemplo com Hooks

### Hook Customizado para API

```javascript
// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import api from '../services/api';

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (method = 'get', body = null, params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const config = { params };
        
        let response;
        if (method === 'get' || method === 'delete') {
          response = await api[method](endpoint, config);
        } else {
          response = await api[method](endpoint, body, config);
        }

        setData(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: err.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { data, loading, error, request };
}
```

### Componente de Departamentos com Hook

```javascript
// src/components/DepartmentList.jsx
import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

export default function DepartmentList() {
  const { data, loading, error, request } = useApi('/departments');
  const [filters, setFilters] = useState({
    active: 'all',
    search: '',
  });

  useEffect(() => {
    loadDepartments();
  }, [filters]);

  const loadDepartments = () => {
    const params = { per_page: 20 };
    
    if (filters.search) {
      params.name = filters.search;
    }
    
    if (filters.active !== 'all') {
      params.active = filters.active === 'true';
    }

    request('get', null, params);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="department-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        
        <select
          value={filters.active}
          onChange={(e) => setFilters({ ...filters, active: e.target.value })}
        >
          <option value="all">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      <div className="departments">
        {data?.data?.map((dept) => (
          <div key={dept.id} className="department-card">
            <h3>{dept.name}</h3>
            <p>Código: {dept.code}</p>
            <span className={dept.active ? 'active' : 'inactive'}>
              {dept.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Integração

- [ ] Instalar dependências (axios, async-storage)
- [ ] Configurar API_URL correta para seu ambiente
- [ ] Criar serviço de API com interceptors
- [ ] Criar serviço de autenticação
- [ ] Implementar Context de autenticação
- [ ] Criar telas de login/registro
- [ ] Testar fluxo de autenticação
- [ ] Implementar persistência de token
- [ ] Testar chamadas autenticadas
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states
- [ ] Testar em diferentes cenários (offline, erro de rede, etc)

---

## 🎉 Pronto para Desenvolver!

Com esses exemplos você tem uma base sólida para integrar seu frontend React/React Native com o backend Laravel.

**Dica:** Comece pelo fluxo de autenticação e depois expanda para os outros recursos.
