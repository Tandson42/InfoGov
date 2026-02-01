# 🚀 Sistema de Autenticação - Guia Rápido

## ✅ Implementação Completa

Sistema de autenticação RESTful implementado com **Laravel 11** e **Laravel Sanctum**.

---

## 📦 O que foi implementado?

### 1️⃣ **Model User** 
- ✅ Trait `HasApiTokens` do Sanctum configurada
- ✅ Hash automático de senhas via cast `'hashed'`
- ✅ Atributos sensíveis ocultos (password, remember_token)

**Arquivo:** `app/Models/User.php`

---

### 2️⃣ **Form Requests (Validações)**

#### LoginRequest
- ✅ Validação de email (obrigatório, formato válido)
- ✅ Validação de senha (obrigatório, mínimo 6 caracteres)
- ✅ Mensagens de erro personalizadas em português
- ✅ Resposta JSON em caso de erro (422)

**Arquivo:** `app/Http/Requests/LoginRequest.php`

#### RegisterRequest
- ✅ Validação de nome (obrigatório, máximo 255 caracteres)
- ✅ Validação de email (obrigatório, formato válido, único)
- ✅ Validação de senha (obrigatório, mínimo 6 caracteres, confirmação)
- ✅ Mensagens de erro personalizadas em português
- ✅ Resposta JSON em caso de erro (422)

**Arquivo:** `app/Http/Requests/RegisterRequest.php`

---

### 3️⃣ **UserResource**
- ✅ Padronização de respostas JSON
- ✅ Remove dados sensíveis (password, remember_token)
- ✅ Formata datas no padrão ISO 8601
- ✅ Retorna apenas dados necessários

**Arquivo:** `app/Http/Resources/UserResource.php`

---

### 4️⃣ **AuthController**

Controller com 4 métodos principais:

#### `register(RegisterRequest $request)`
- Cria novo usuário
- Hash automático da senha
- Gera token pessoal
- Retorna usuário + token (201)

#### `login(LoginRequest $request)`
- Valida credenciais
- Verifica senha com Hash::check()
- Gera token pessoal
- Retorna usuário + token (200)
- Retorna erro 401 se credenciais inválidas

#### `me(Request $request)`
- 🔒 Rota protegida (requer auth:sanctum)
- Retorna dados do usuário autenticado
- Token necessário no header Authorization

#### `logout(Request $request)`
- 🔒 Rota protegida (requer auth:sanctum)
- Invalida apenas o token atual
- Outros tokens/dispositivos permanecem ativos
- Retorna sucesso (200)

**Arquivo:** `app/Http/Controllers/Api/AuthController.php`

---

### 5️⃣ **Rotas API** (Versionadas)

```php
// Rotas públicas
POST   /api/v1/auth/register  - Registrar novo usuário
POST   /api/v1/auth/login     - Fazer login

// Rotas protegidas (requerem token)
GET    /api/v1/auth/me        - Obter usuário autenticado
POST   /api/v1/auth/logout    - Fazer logout
```

**Arquivo:** `routes/api.php`

---

### 6️⃣ **Configuração Bootstrap**
- ✅ Rotas API registradas no `bootstrap/app.php`
- ✅ Prefixo automático `/api` aplicado

**Arquivo:** `bootstrap/app.php`

---

## 🔧 Como Testar

### 1. Verificar Rotas
```bash
php artisan route:list --path=api
```

### 2. Testar com cURL

#### Registrar usuário
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@exemplo.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

#### Fazer login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123"
  }'
```

#### Obter usuário autenticado (substitua SEU_TOKEN)
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer SEU_TOKEN"
```

#### Fazer logout
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🗂️ Estrutura de Arquivos

```
backend/infogov-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── AuthController.php          ← 4 métodos (register, login, me, logout)
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php                ← Validações de login
│   │   │   └── RegisterRequest.php             ← Validações de registro
│   │   └── Resources/
│   │       └── UserResource.php                ← Formatação de respostas
│   └── Models/
│       └── User.php                            ← HasApiTokens configurado
├── routes/
│   └── api.php                                 ← Rotas /api/v1/auth
├── bootstrap/
│   └── app.php                                 ← Registro das rotas API
└── config/
    └── sanctum.php                             ← Configuração do Sanctum
```

---

## 🔐 Segurança Implementada

| Recurso | Status |
|---------|--------|
| **Laravel Sanctum** | ✅ Configurado |
| **Tokens Pessoais** | ✅ Implementado |
| **Hash Bcrypt** | ✅ Automático via cast |
| **Middleware auth:sanctum** | ✅ Rotas protegidas |
| **Validação de Dados** | ✅ Form Requests |
| **Ocultação de Senhas** | ✅ UserResource |
| **Respostas JSON** | ✅ Padronizadas |
| **Tratamento de Erros** | ✅ 401, 422, 500 |
| **PostgreSQL** | ✅ Compatível |

---

## 📋 Respostas Padrão

### ✅ Sucesso (200/201)
```json
{
  "success": true,
  "message": "Mensagem de sucesso",
  "data": {
    "user": { ... },
    "token": "...",
    "token_type": "Bearer"
  }
}
```

### ❌ Erro de Validação (422)
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

### ❌ Não Autenticado (401)
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

ou

```json
{
  "message": "Unauthenticated."
}
```

---

## 💡 Boas Práticas Aplicadas

### ✅ SOLID Principles
- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Open/Closed**: Fácil extensão sem modificação
- **Dependency Inversion**: Usa interfaces do Laravel

### ✅ Clean Code
- Código comentado em português
- Nomenclatura clara e descritiva
- Métodos pequenos e focados
- Sem lógica de negócio no controller

### ✅ Laravel Best Practices
- Form Requests para validação
- Resources para formatação
- Middleware para proteção
- Eloquent para persistência
- Cast automático de senha

### ✅ RESTful API
- Verbos HTTP corretos (GET, POST)
- Status codes apropriados
- Versionamento de API (/v1)
- Respostas JSON consistentes

---

## 🎯 O que NÃO foi usado (conforme solicitado)

- ❌ Sessões (stateless)
- ❌ Cookies de autenticação
- ❌ Pacotes externos além do Sanctum
- ❌ Autenticação baseada em sessão

---

## 📚 Próximos Passos Sugeridos

1. **Configurar PostgreSQL**
   ```bash
   # Edite .env com suas credenciais
   php artisan migrate
   ```

2. **Configurar CORS** (se necessário para frontend)
   ```bash
   php artisan config:publish cors
   ```

3. **Implementar Rate Limiting**
   ```php
   // Em routes/api.php
   Route::middleware(['throttle:60,1'])->group(...);
   ```

4. **Adicionar Refresh Token** (opcional)
   
5. **Implementar Verificação de Email** (opcional)

6. **Adicionar Two-Factor Authentication** (opcional)

---

## 📖 Documentação Adicional

Para exemplos detalhados de uso e mais informações, consulte:

- **API_DOCUMENTATION.md** - Documentação completa da API com exemplos em cURL e JavaScript

---

## ✅ Checklist Final

- [x] Model User com HasApiTokens
- [x] LoginRequest implementado
- [x] RegisterRequest implementado
- [x] UserResource implementado
- [x] AuthController com 4 métodos
- [x] Rotas versionadas /api/v1/auth
- [x] Rotas protegidas com auth:sanctum
- [x] Hash automático de senhas
- [x] Validações com mensagens em português
- [x] Respostas JSON padronizadas
- [x] Tratamento de erros HTTP
- [x] Código limpo e comentado
- [x] Compatibilidade PostgreSQL
- [x] Testes validados

---

## 🎉 Sistema Pronto para Uso!

O sistema de autenticação está **100% funcional** e pronto para ser utilizado em produção após configurar o banco de dados PostgreSQL.

**Desenvolvido seguindo as melhores práticas do Laravel 11** 🚀
