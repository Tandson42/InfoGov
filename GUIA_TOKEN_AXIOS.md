# 🔑 Guia Completo: Token no Axios - InfoGov

## ⚠️ Sobre o Código que Você Mencionou

```javascript
// ❌ PROBLEMA: Este código estava faltando ou incorreto
api.defaults.headers.common.Authorization = `Bearer ${token}`;
```

Este era o **problema crítico**! O token NÃO estava sendo adicionado ao header `Authorization`.

---

## ✅ SOLUÇÃO IMPLEMENTADA

### Antes (Problema) ❌

```typescript
// Estava comentado ou removido
// api.defaults.headers.common.Authorization = `Bearer ${token}`;
```

### Depois (Correto) ✅

```typescript
/**
 * Interceptor de requisição
 * Adiciona o token de autenticação automaticamente
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await storage.getItem('@InfoGov:token');
      
      if (token && config.headers) {
        // ✅ AGORA O TOKEN É ADICIONADO CORRETAMENTE
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ [Axios Request] Authorization header adicionado');
      }
    } catch (error) {
      console.error('❌ [Axios Request] Erro ao recuperar token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

## 🔍 Como Funciona o Token

### **Fluxo Completo**

```
1. LOGIN
├── POST /auth/login { email, password }
├── Backend valida credenciais
├── Gera token (Sanctum)
└── Retorna { user, token }

2. ARMAZENAR TOKEN
├── Token salvo em storage
│   └── @InfoGov:token = "eyJhbGc..."
└── Headers.Authorization = "Bearer eyJhbGc..."

3. REQUISIÇÕES AUTENTICADAS
├── GET /auth/me
├── Axios interceptor pega token
├── Adiciona header: Authorization: Bearer token
└── Backend valida token (Sanctum)

4. LOGOUT
├── Token removido do storage
├── Próximas requisições: ⚠️ Token não encontrado
└── Endpoints protegidos retornam 401
```

---

## 📝 Diferentes Formas de Adicionar Token

### **Opção 1: Usando api.defaults (Estático) ❌**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// ❌ NÃO FUNCIONA BEM COM ASYNC
const token = await storage.getItem('@InfoGov:token');
api.defaults.headers.common.Authorization = `Bearer ${token}`;

// Problema: Token é nulo na primeira requisição
// Não atualiza quando token muda
```

### **Opção 2: Usando Interceptor (Dinâmico) ✅ RECOMENDADO**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// ✅ FUNCIONA PERFEITAMENTE COM ASYNC
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('@InfoGov:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }
);

// Vantagens:
// ✓ Busca token toda vez (sempre atualizado)
// ✓ Funciona com async storage
// ✓ Atualiza quando token muda
// ✓ Limpo quando token é removido
```

### **Opção 3: Manual em cada requisição ❌**

```typescript
// ❌ NÃO RECOMENDADO - Muito código repetido
const token = await storage.getItem('@InfoGov:token');
api.get('/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 🛠️ Configuração Atual do Projeto

### **Arquivo: `src/api/client.ts`**

```typescript
// 1. Criar instância do Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Interceptor de REQUISIÇÃO (adiciona token)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getItem('@InfoGov:token');
    
    if (token && config.headers) {
      // ✅ ADICIONA TOKEN AO HEADER
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }
);

// 3. Interceptor de RESPOSTA (trata erros)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Se 401 (token expirado), remove token
    if (error.response?.status === 401) {
      await storage.multiRemove([
        '@InfoGov:token',
        '@InfoGov:user',
      ]);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Headers Enviados em Cada Requisição

### **Requisição de Login (SEM token)**

```http
POST /api/v1/auth/login HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Accept: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": { "id": 1, "email": "user@example.com", ... },
    "token": "1|abcdef123456..."
  }
}
```

### **Requisição Autenticada (COM token)**

```http
GET /api/v1/auth/me HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Accept: application/json
Authorization: Bearer 1|abcdef123456...  ← ✅ TOKEN AQUI!

```

**Response:**
```json
{
  "success": true,
  "message": "Usuário autenticado",
  "data": {
    "user": { "id": 1, "email": "user@example.com", ... }
  }
}
```

### **Requisição SEM Token (Erro)**

```http
GET /api/v1/auth/me HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Accept: application/json
Authorization: Bearer undefined  ← ❌ ERRO!
```

**Response (401):**
```json
{
  "message": "Unauthenticated",
  "errors": [ ... ]
}
```

---

## 🧪 Teste do Token

### **No Console do DevTools**

```javascript
// 1. Ver token armazenado
// React Native:
await AsyncStorage.getItem('@InfoGov:token')

// Web:
localStorage.getItem('auth_token')

// 2. Ver headers da próxima requisição
// Abra DevTools → Network
// Faça uma requisição: await api.get('/auth/me')
// Clique na requisição
// Vá para Headers → Request Headers
// Procure por: Authorization: Bearer ...
```

### **No Postman/Insomnia**

```
1. Fazer login:
   POST http://localhost:8000/api/v1/auth/login
   Body: { "email": "...", "password": "..." }
   Response: { "data": { "token": "1|abc..." } }

2. Copiar token

3. Fazer requisição com token:
   GET http://localhost:8000/api/v1/auth/me
   Headers:
     Authorization: Bearer 1|abc...
   Response: { "data": { "user": { ... } } }

4. Testar SEM token:
   GET http://localhost:8000/api/v1/auth/me
   (sem Authorization header)
   Response: 401 Unauthorized
```

---

## ⚠️ Problemas Comuns com Token

### **Problema 1: Token Não É Adicionado**

**Sintoma:**
```
❌ [Axios Request] Token não encontrado no storage
```

**Solução:**
1. Verificar se token foi salvo após login:
   ```javascript
   await storage.getItem('@InfoGov:token')  // Deve retornar string
   ```

2. Verificar se storage está funcionando:
   ```typescript
   // Em auth.service.ts:
   await storage.multiSet([
     [this.TOKEN_KEY, token],  // ← Verificar aqui
     [this.USER_KEY, JSON.stringify(user)],
   ]);
   ```

### **Problema 2: Token Salvo Mas Não Enviado no Header**

**Sintoma:**
```
✓ Token existente: ✓ eyJhbGc...
❌ Authorization header NÃO foi adicionado
```

**Solução:**
```typescript
// Verificar no interceptor:
if (token && config.headers) {  // ← Ambas as condições devem ser true
  config.headers.Authorization = `Bearer ${token}`;
}
```

### **Problema 3: Token Enviado Mas Retorna 401**

**Sintoma:**
```
✅ Authorization header adicionado
❌ [Axios Response Error] Status: 401
```

**Solução:**
1. Verificar se token é válido no backend:
   ```bash
   # Laravel Tinker:
   >>> $token = '1|abc...'
   >>> Laravel\Sanctum\PersonalAccessToken::findToken($token)
   ```

2. Verificar se Sanctum está configurado:
   ```bash
   php artisan config:publish sanctum
   ```

3. Verificar se middleware está aplicado:
   ```php
   // Em routes/api.php:
   Route::middleware('auth:sanctum')->get('/auth/me', ...);
   ```

---

## 🔄 Ciclo de Vida do Token

```
┌─────────────────┐
│  App Iniciado   │
│  Token = null   │
└────────┬────────┘
         │
    Usuário faz login
         │
         ↓
┌─────────────────┐
│  POST /login    │ → 200 OK + Token
└────────┬────────┘
         │
    Token salvo no Storage
         │
         ↓
┌─────────────────────┐
│  Token ativo        │
│  Headers:           │
│  Authorization:     │
│  Bearer 1|abc...    │
└────────┬────────────┘
         │
    Requisições protegidas funcionam
         │
         ↓
┌─────────────────┐
│  Usuário faz    │
│  logout         │
└────────┬────────┘
         │
    Token removido do Storage
         │
         ↓
┌─────────────────────┐
│  Token = null       │
│  Headers:           │
│  Authorization:     │
│  Bearer undefined   │
└────────┬────────────┘
         │
    Requisições protegidas retornam 401
         │
         ↓
┌─────────────────┐
│  Redireciona    │
│  para Login     │
└─────────────────┘
```

---

## ✅ Checklist: Token Funcionando Corretamente

- [ ] Token é retornado após login (200 OK)
- [ ] Token é salvo em storage (@InfoGov:token)
- [ ] Logs mostram: `✅ [Axios Request] Authorization header adicionado`
- [ ] Header Authorization contém: `Bearer 1|abc...`
- [ ] Requisições protegidas retornam 200 OK
- [ ] Logout remove token do storage
- [ ] Após logout, requisições retornam 401

---

## 📚 Referências

### **Sanctum (Laravel)**
```php
// Token é gerado assim:
$token = $user->createToken('auth_token')->plainTextToken;
// Retorna: "1|abcdef123456..."
// Formato: id|token_hash
```

### **Axios Interceptors**
```typescript
// Interceptor sempre é chamado antes de cada requisição
// Perfeito para adicionar headers dinâmicos
api.interceptors.request.use(
  async (config) => {
    // Seu código aqui
    return config;
  }
);
```

### **Storage (React Native)**
```typescript
// AsyncStorage é async por padrão
const token = await storage.getItem('@InfoGov:token');
// ✓ Funciona perfeitamente com interceptor async
```

---

## 🎯 Próximos Passos

1. **Execute o login** com os novos logs
2. **Procure por:** `✅ [Axios Request] Authorization header adicionado`
3. **Se vir:** Login deve funcionar ✅
4. **Se NÃO vir:** Há um problema no fluxo (veja diagnostico)

---

*Guia de Token - InfoGov v1.0*
