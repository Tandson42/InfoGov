# 🔍 Diagnóstico do Sistema de Login - InfoGov

## 📋 Resumo Executivo

O projeto possui logs detalhados implementados em **TODOS** os arquivos críticos de autenticação. Esses logs permitem rastrear o fluxo completo do login desde a tela até a API.

---

## 🎯 Pontos de Debug Implementados

### 1. **Frontend - Tela de Login** (`src/screens/Auth/LoginScreen.tsx`)

```
🔐 [LoginScreen] handleLogin() chamado
⚠️ [LoginScreen] Validação falhou - campos vazios (se houver)
✅ [LoginScreen] Validação passou - credenciais preenchidas
📊 [LoginScreen] Dados do login: { email, password: '***' }
⏳ [LoginScreen] Estado loading definido como true
🔄 [LoginScreen] Chamando signIn()...
✅ [LoginScreen] signIn() concluído com sucesso
❌ [LoginScreen] Erro no signIn()
🏁 [LoginScreen] Finally - definindo loading como false
```

### 2. **Context de Autenticação** (`src/contexts/AuthContext.tsx`)

```
🔄 [AuthContext] loadStorageData() chamado
💾 [AuthContext] Buscando token e usuário do storage...
📊 [AuthContext] Dados carregados: { token: ..., usuario: ... }
✅ [AuthContext] Token e usuário encontrados
🔄 [AuthContext] Atualizando dados do usuário do servidor...
✅ [AuthContext] Dados do usuário atualizados com sucesso
⚠️ [AuthContext] Erro ao atualizar usuário
ℹ️ [AuthContext] Nenhum token ou usuário encontrado

🔐 [AuthContext] signIn() chamado para: email
⏳ [AuthContext] Chamando authService.login()...
✅ [AuthContext] Login bem-sucedido
👤 [AuthContext] Usuário definido no estado

🔓 [AuthContext] signOut() chamado
⏳ [AuthContext] Chamando authService.logout()...
✅ [AuthContext] authService.logout() concluído
🧹 [AuthContext] Limpando estado da aplicação...
```

### 3. **Serviço de Autenticação** (`src/api/auth.service.ts`)

```
🔐 [AuthService] login() chamado com: { email }
📤 [AuthService] Enviando POST /auth/login...
📥 [AuthService] Resposta recebida: { success, message }
❌ [AuthService] Login falhou: mensagem
💾 [AuthService] Salvando token no storage...
✅ [AuthService] Login bem-sucedido para: email
🔑 [AuthService] Token salvo: token...

🔐 [AuthService] register() chamado
👤 [AuthService] me() chamado
🔓 [AuthService] logout() chamado
💾 [AuthService] Removendo token e usuário do storage...
📤 [AuthService] Notificando servidor sobre logout...
```

### 4. **Cliente Axios** (`src/api/client.ts`) - MAIS IMPORTANTE! ⭐

```
🔐 [Axios Request] URL: /auth/login
🔐 [Axios Request] Método: POST
🔐 [Axios Request] Token existente: ✓ token... (ou ✗ Nenhum)
✅ [Axios Request] Authorization header adicionado
📝 [Axios Request] Headers: { 'Content-Type': ..., 'Authorization': ..., 'Accept': ... }
⚠️ [Axios Request] Token não encontrado no storage

✅ [Axios Response] Status: 200
✅ [Axios Response] URL: /auth/login
✅ [Axios Response] Data: { success, message, data: { user, token } }

❌ [Axios Response Error]
❌ [Axios Response Error] URL: /auth/login
❌ [Axios Response Error] Status: 401 (ou outro)
❌ [Axios Response Error] Message: erro...
❌ [Axios Response Error] Data: { ... }
❌ [Axios Response Error] ERRO DE REDE - Servidor inacessível
⚠️ [Axios Response Error] Token inválido/expirado (401)
```

---

## 🔧 Como Usar os Logs para Debugar

### **Passo 1: Abrir o Console de Debug**

**React Native (Expo):**
```bash
# Terminal 1: Iniciar Expo
npm start
# ou
expo start

# Terminal 2: Pressionar 'j' para abrir debugger
# Abrir browser: http://localhost:19000
# Abrir DevTools (F12)
# Ir para Console
```

**Web (React):**
```bash
# Abrir DevTools (F12)
# Ir para Console (Tab Console)
```

### **Passo 2: Tentar Fazer Login**

1. Preencha email e senha
2. Clique em "Entrar"
3. Observe a sequência de logs no console

### **Passo 3: Interpretar os Logs**

#### **Cenário 1: Sucesso Total** ✅
```
🔐 [LoginScreen] handleLogin() chamado
✅ [LoginScreen] Validação passou
🔄 [LoginScreen] Chamando signIn()...
🔐 [AuthContext] signIn() chamado para: seu@email.com
⏳ [AuthContext] Chamando authService.login()...
🔐 [AuthService] login() chamado com: { email: seu@email.com }
📤 [AuthService] Enviando POST /auth/login...
🔐 [Axios Request] URL: /auth/login
🔐 [Axios Request] Método: POST
⚠️ [Axios Request] Token não encontrado no storage (esperado para login)
📝 [Axios Request] Headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
📥 [AuthService] Resposta recebida: { success: true, message: 'Login realizado com sucesso' }
💾 [AuthService] Salvando token no storage...
✅ [Axios Response] Status: 200
🔑 [AuthService] Token salvo: eyJhbGc...
✅ [AuthService] Login bem-sucedido para: seu@email.com
✅ [AuthContext] Login bem-sucedido
👤 [AuthContext] Usuário definido no estado: seu@email.com
```

#### **Cenário 2: Erro de Credenciais** ❌
```
🔐 [Axios Request] URL: /auth/login
📤 [AuthService] Enviando POST /auth/login...
❌ [Axios Response Error] Status: 401
❌ [Axios Response Error] Data: { success: false, message: 'Credenciais inválidas' }
❌ [AuthService] Login falhou: Credenciais inválidas
❌ [AuthContext] Erro no login: Error: Credenciais inválidas
❌ [LoginScreen] Erro no signIn(): Error: Credenciais inválidas
```

**O que fazer:**
- Verificar se o email está correto
- Verificar se a senha está correta
- Confirmar que o usuário existe no banco de dados

#### **Cenário 3: Token Não é Enviado** ⚠️
```
🔐 [Axios Request] URL: /auth/me
⚠️ [Axios Request] Token não encontrado no storage para: /auth/me
❌ [Axios Response Error] Status: 401
❌ [Axios Response Error] ERRO: Unauthorized
```

**O que fazer:**
- Verificar se o token foi salvo corretamente:
  ```javascript
  // No console do DevTools:
  // Para React Native (Expo):
  await AsyncStorage.getItem('@InfoGov:token')
  
  // Para Web:
  localStorage.getItem('auth_token')
  ```
- Se não estiver salvo, o problema está em `auth.service.ts`

#### **Cenário 4: Erro de Conexão** 🌐
```
❌ [Axios Request] URL: http://192.168.100.64:8000/api/v1/auth/login
❌ [Axios Response Error] ERRO DE REDE - Servidor inacessível
❌ [Axios Response Error] Message: Network Error
```

**O que fazer:**
- Verificar se o servidor Laravel está rodando:
  ```bash
  # No terminal do backend:
  php artisan serve
  ```
- Verificar se o IP/URL em `client.ts` está correto:
  ```typescript
  const API_URL = __DEV__
    ? 'http://192.168.100.64:8000/api/v1'  // ← Verifique este IP
    : 'https://sua-api-producao.com/api/v1';
  ```
- Testar conexão com `curl` ou Postman:
  ```bash
  curl -X GET http://192.168.100.64:8000/api/v1/auth/login -v
  ```

#### **Cenário 5: Token NÃO é Adicionado ao Header** ⚠️ CRÍTICO!
```
🔐 [Axios Request] URL: /auth/me
🔐 [Axios Request] Token existente: ✓ eyJhbGc...
📝 [Axios Request] Headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
  // ← FALTA 'Authorization' aqui!
}
```

**O que fazer:**
- Verificar se o token está sendo salvo:
  ```typescript
  // Em auth.service.ts, após login:
  await storage.multiSet([
    ['@InfoGov:token', token],  // ← Verificar aqui
    ['@InfoGov:user', JSON.stringify(user)],
  ]);
  ```

---

## 🚨 Problemas Comuns e Soluções

### **Problema 1: "Credenciais inválidas" sempre**

**Verificações:**
1. Banco de dados tem usuários?
   ```bash
   # No backend:
   php artisan tinker
   >>> App\Models\User::all()
   ```

2. Email está registrado corretamente?
   ```bash
   # No tinker:
   >>> App\Models\User::where('email', 'seu@email.com')->first()
   ```

3. Senha está correta?
   ```bash
   # A senha deve ser hashada com bcrypt
   # Verifique se a senha do usuário está hashada:
   >>> $user = App\Models\User::first()
   >>> $user->password
   # Deve ser algo como: $2y$12$...
   ```

4. Se precisar resetar senha:
   ```bash
   # No tinker:
   >>> $user = App\Models\User::first()
   >>> $user->update(['password' => 'senhaNovaAqui'])
   >>> $user->password
   ```

### **Problema 2: Token salvo mas endpoints protegidos retornam 401**

**Verificações:**
1. Verificar se token está no header:
   - Procurar por `✅ [Axios Request] Authorization header adicionado` nos logs

2. Verificar se Sanctum está configurado:
   ```bash
   # No backend:
   php artisan config:publish sanctum
   ```

3. Verificar se middleware está aplicado:
   ```php
   // Em routes/api.php:
   Route::middleware('auth:sanctum')->get('/auth/me', [AuthController::class, 'me']);
   ```

### **Problema 3: Erro de rede recorrente**

**Verificações:**
1. Servidor está rodando?
   ```bash
   php artisan serve
   ```

2. IP/URL está correto?
   ```typescript
   // Em client.ts:
   // Para Android Emulator: http://10.0.2.2:8000
   // Para iOS Simulator: http://localhost:8000
   // Para dispositivo físico: http://SEU_IP_LOCAL:8000
   ```

3. CORS está habilitado?
   ```php
   // Em config/cors.php:
   'allowed_origins' => ['*'],
   'allowed_methods' => ['*'],
   'allowed_headers' => ['*'],
   ```

---

## 📱 Logs em Tempo Real

### **React Native (Expo)**
```bash
# Terminal 1: Iniciar app
npm start

# Terminal 2: Pressionar 'j' no terminal do Expo
# Debugger abre em http://localhost:19000

# Ou, abrir DevTools no browser:
# DevTools (F12) → Console
```

### **Web (React)**
```bash
# Terminal 1: Iniciar app
npm start

# Abrir DevTools (F12)
# Ir para Console
```

---

## ✅ Checklist de Debug

Ao investigar problemas de login, siga esta ordem:

- [ ] **Verificar Console:** Há logs de erro?
- [ ] **Validação:** Email e senha estão preenchidos?
- [ ] **Request Axios:** Token está sendo enviado?
- [ ] **Response Status:** Qual é o status HTTP (200, 401, 500, etc)?
- [ ] **Backend Logs:** Há logs de erro no Laravel?
  ```bash
  # Ver logs em tempo real:
  tail -f storage/logs/laravel.log
  ```
- [ ] **Database:** Usuário existe no banco?
- [ ] **Token Storage:** Token está sendo salvo?
- [ ] **Network:** Servidor está acessível?

---

## 📝 Exemplo Completo de Sessão de Debug

### **Teste Local Recomendado**

1. **Criar usuário de teste:**
   ```bash
   cd infogov/backend/infogov-api
   php artisan tinker
   >>> $user = App\Models\User::create([
     'name' => 'Teste',
     'email' => 'teste@infogov.com',
     'password' => 'senha123',
     'role_id' => 1,
   ])
   ```

2. **Iniciar servidor:**
   ```bash
   php artisan serve
   ```

3. **Iniciar app frontend:**
   ```bash
   npm start
   ```

4. **Abrir DevTools:**
   - Pressione F12
   - Vá para Console

5. **Fazer login:**
   - Email: `teste@infogov.com`
   - Senha: `senha123`

6. **Observar logs:**
   - Colar no console:
   ```javascript
   // Copiar e colar no console para ver logs em tempo real
   window.addEventListener('console', (e) => {
     console.log('LOG CAPTURADO:', e);
   });
   ```

---

## 🔐 Estrutura de Fluxo do Token

```
┌─────────────────┐
│  LoginScreen    │ → handleLogin()
└────────┬────────┘
         │
         ↓
┌─────────────────────┐
│  AuthContext        │ → signIn(email, password)
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  AuthService        │ → login(credentials)
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  Axios Client       │ → POST /auth/login
│  + Interceptor      │   Headers: { Authorization: Bearer token }
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  Backend Laravel    │ → AuthController.login()
│  + Sanctum         │   Hash::check(password)
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  Response 200       │ → { user, token }
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  Storage            │ → salvar token
│  (AsyncStorage)     │   @InfoGov:token
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  AuthContext        │ → setUser(user)
│  Estado Global      │   Autenticado ✅
└─────────────────────┘
```

---

## 🛠️ Ferramentas Úteis

### **Postman/Insomnia - Testar API Manualmente**

1. **POST /auth/login**
```bash
URL: http://localhost:8000/api/v1/auth/login
Method: POST
Headers:
  Content-Type: application/json
  Accept: application/json
Body:
{
  "email": "teste@infogov.com",
  "password": "senha123"
}
```

2. **GET /auth/me** (com token)
```bash
URL: http://localhost:8000/api/v1/auth/me
Method: GET
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Accept: application/json
```

### **Laravel Tinker - Verificar Database**

```bash
php artisan tinker

# Ver todos os usuários
>>> App\Models\User::all()

# Ver usuário específico
>>> App\Models\User::where('email', 'teste@infogov.com')->first()

# Verificar hash de senha
>>> $user = App\Models\User::first()
>>> Hash::check('senha123', $user->password)  # true/false

# Resetar senha
>>> $user->update(['password' => 'novaSenha123'])
```

### **Laravel Logs - Ver Erros do Backend**

```bash
# Ver logs em tempo real
tail -f storage/logs/laravel.log

# Ou, na pasta do projeto:
cat storage/logs/laravel.log | tail -100
```

---

## 📞 Resumo dos Arquivos Modificados

| Arquivo | Mudança | Motivo |
|---------|---------|--------|
| `client.ts` | Logs detalhados no interceptor | Rastrear token e headers |
| `auth.service.ts` | Logs em login, register, logout | Acompanhar fluxo de auth |
| `AuthContext.tsx` | Logs em signIn, signOut, loadStorage | Estado global |
| `LoginScreen.tsx` | Logs em handleLogin | Ponto de entrada |

---

## 🎯 Próximos Passos

1. **Executar login com os logs ativados**
2. **Coletar todos os logs da console**
3. **Comparar com os cenários acima**
4. **Identificar onde o fluxo quebra**
5. **Reportar com print dos logs**

---

*Documento criado para Debug do Sistema InfoGov - Versão 1.0*
