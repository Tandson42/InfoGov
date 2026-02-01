# 🔗 Integração Frontend - Backend Laravel com Sanctum

Guia completo para integração do backend Laravel com aplicações React, React Native e outras SPAs.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração do Backend](#configuração-do-backend)
- [React Native](#react-native)
- [React Web](#react-web)
- [Axios vs Fetch](#axios-vs-fetch)
- [Tratamento de Erros](#tratamento-de-erros)
- [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

### Tipos de Autenticação Implementados

| Plataforma | Método | CSRF | Cookies | Configuração |
|------------|--------|------|---------|--------------|
| **React Native** | Bearer Token | ❌ Não | ❌ Não | Simples |
| **React Web (SPA)** | Bearer Token | ❌ Não | ❌ Não | Simples |
| **React Web (Sessão)** | Cookie Session | ✅ Sim | ✅ Sim | Complexa |

**Recomendação:** Use **Bearer Tokens** para simplicidade e compatibilidade universal.

---

## ⚙️ Configuração do Backend

### 1. Configurações Realizadas

#### ✅ CORS (`config/cors.php`)
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => env('FRONTEND_URL') ? explode(',', env('FRONTEND_URL')) : ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => ['Authorization', 'Content-Type', 'X-Requested-With'],
'max_age' => 86400,
'supports_credentials' => env('CORS_SUPPORTS_CREDENTIALS', false),
```

#### ✅ Sanctum (`config/sanctum.php`)
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', '')),
'expiration' => env('SANCTUM_EXPIRATION', null),
```

#### ✅ Variáveis de Ambiente (`.env`)
```env
# Desenvolvimento (permite todas origens)
# Deixe comentado ou vazio para desenvolvimento

# Produção (especifique origens)
FRONTEND_URL=https://seu-app.com,https://app.seu-dominio.com
CORS_SUPPORTS_CREDENTIALS=false

# Sanctum (opcional)
SANCTUM_EXPIRATION=null  # null = sem expiração
```

### 2. Estrutura da API

**Base URL:** `http://localhost:8000/api/v1`

**Autenticação:** Bearer Token no header `Authorization`

**Formato:** JSON (`Content-Type: application/json`)

---

## 📱 React Native

### Instalação de Dependências

```bash
# Axios (recomendado)
npm install axios

# ou React Native Async Storage para persistir token
npm install @react-native-async-storage/async-storage
```

### Configuração do Cliente API

```javascript
// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure a URL base da API
const API_URL = 'http://10.0.2.2:8000/api/v1'; // Android Emulator
// const API_URL = 'http://localhost:8000/api/v1'; // iOS Simulator
// const API_URL = 'https://sua-api.com/api/v1'; // Produção

// Cria instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      await AsyncStorage.removeItem('auth_token');
      // Redirecionar para login
      // navigation.navigate('Login');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Serviço de Autenticação

```javascript
// src/services/authService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  /**
   * Registrar novo usuário
   */
  async register(name, email, password, passwordConfirmation, roleId = null) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role_id: roleId,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Salvar token
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user, token };
      }
      
      return { success: false, message: 'Erro no registro' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao registrar',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Fazer login
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Salvar token e usuário
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user, token };
      }
      
      return { success: false, message: 'Credenciais inválidas' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Obter usuário autenticado
   */
  async me() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const { user } = response.data.data;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao buscar usuário',
      };
    }
  }

  /**
   * Fazer logout
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Erro ao fazer logout no servidor:', error);
    } finally {
      // Remove dados locais mesmo se houver erro
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    }
  }

  /**
   * Verifica se está autenticado
   */
  async isAuthenticated() {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Obter token atual
   */
  async getToken() {
    return await AsyncStorage.getItem('auth_token');
  }

  /**
   * Obter usuário atual
   */
  async getUser() {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}

export default new AuthService();
```

### Exemplo de Tela de Login

```javascript
// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import authService from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    const result = await authService.login(email, password);

    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Senha:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button
        title={loading ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
```

### Serviço de Departamentos (Exemplo)

```javascript
// src/services/departmentService.js
import api from './api';

class DepartmentService {
  /**
   * Listar departamentos com filtros
   */
  async list(params = {}) {
    try {
      const response = await api.get('/departments', { params });
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao listar departamentos',
      };
    }
  }

  /**
   * Obter um departamento
   */
  async get(id) {
    try {
      const response = await api.get(`/departments/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao buscar departamento',
      };
    }
  }

  /**
   * Criar departamento
   */
  async create(data) {
    try {
      const response = await api.post('/departments', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar departamento',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Atualizar departamento
   */
  async update(id, data) {
    try {
      const response = await api.put(`/departments/${id}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar departamento',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Deletar departamento
   */
  async delete(id) {
    try {
      const response = await api.delete(`/departments/${id}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao deletar departamento',
      };
    }
  }
}

export default new DepartmentService();
```

---

## 🌐 React Web

### Configuração Similar ao React Native

A configuração é praticamente idêntica, com poucas diferenças:

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Uso com React Context

```javascript
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }

  async function login(email, password) {
    const result = await authService.login(email, password);
    
    if (result.success) {
      setUser(result.user);
    }
    
    return result;
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## 🔄 Axios vs Fetch

### Axios (Recomendado)

**Vantagens:**
- ✅ Interceptors nativos
- ✅ Timeout configurável
- ✅ Transformação automática de JSON
- ✅ Cancelamento de requisições
- ✅ Progress tracking

```javascript
// Exemplo com Axios
import axios from 'axios';

const response = await axios.post('/auth/login', {
  email: 'user@example.com',
  password: 'senha123'
}, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(response.data);
```

### Fetch API (Nativo)

```javascript
// Exemplo com Fetch
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'senha123'
  })
});

const data = await response.json();
console.log(data);
```

---

## ⚠️ Tratamento de Erros

### Estrutura de Erros da API

#### Erro de Validação (422)
```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "email": ["O campo e-mail é obrigatório."],
    "password": ["A senha deve ter no mínimo 6 caracteres."]
  }
}
```

#### Erro de Autenticação (401)
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

#### Erro de Autorização (403)
```json
{
  "message": "This action is unauthorized."
}
```

### Tratamento no Frontend

```javascript
try {
  const response = await api.post('/departments', data);
  // Sucesso
  console.log(response.data);
} catch (error) {
  if (error.response) {
    // Servidor respondeu com status de erro
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 422) {
      // Erros de validação
      console.log('Erros:', data.errors);
      // Exibir erros para o usuário
    } else if (status === 401) {
      // Não autenticado
      console.log('Token inválido');
      // Redirecionar para login
    } else if (status === 403) {
      // Sem permissão
      console.log('Acesso negado');
    } else {
      console.log('Erro:', data.message);
    }
  } else if (error.request) {
    // Requisição foi feita mas sem resposta
    console.log('Sem resposta do servidor');
  } else {
    // Erro ao configurar requisição
    console.log('Erro:', error.message);
  }
}
```

---

## ✅ Boas Práticas

### 1. Segurança

- ✅ **Nunca** armazene tokens em código
- ✅ Use HTTPS em produção
- ✅ Implemente refresh tokens para sessões longas
- ✅ Valide entrada do usuário no frontend
- ✅ Trate erros apropriadamente

### 2. Performance

- ✅ Use cache quando apropriado
- ✅ Implemente debounce em buscas
- ✅ Pagine resultados longos
- ✅ Use loading states

### 3. UX

- ✅ Mostre feedback de loading
- ✅ Exiba mensagens de erro claras
- ✅ Implemente retry em falhas de rede
- ✅ Persista dados localmente quando possível

### 4. Código

- ✅ Centralize configuração da API
- ✅ Use serviços para cada recurso
- ✅ Mantenha lógica de negócio fora de componentes
- ✅ Use TypeScript para type safety

---

## 🧪 Testando a Integração

### 1. Teste de Conectividade

```javascript
// Teste simples
async function testConnection() {
  try {
    const response = await api.get('/auth/me');
    console.log('✅ Conectado:', response.data);
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}
```

### 2. Teste de Autenticação

```bash
# No terminal, teste o backend
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"senha123"}'
```

---

## 📚 URLs de Desenvolvimento

| Plataforma | URL da API |
|------------|-----------|
| **React Web (localhost)** | `http://localhost:8000/api/v1` |
| **React Native (Android Emulator)** | `http://10.0.2.2:8000/api/v1` |
| **React Native (iOS Simulator)** | `http://localhost:8000/api/v1` |
| **React Native (Dispositivo Físico)** | `http://SEU_IP:8000/api/v1` |

**Dica:** Para encontrar seu IP:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

---

## 🎉 Pronto para Integrar!

O backend está configurado e pronto para receber requisições do seu frontend React ou React Native.

**Próximos passos:**
1. Configure as variáveis de ambiente
2. Implemente os serviços no frontend
3. Teste a autenticação
4. Comece a consumir os endpoints

**Dúvidas?** Consulte a documentação da API em `README_AUTH.md` e `README_DEPARTMENTS.md`.
