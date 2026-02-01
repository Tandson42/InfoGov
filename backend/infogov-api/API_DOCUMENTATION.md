# 🔐 API de Autenticação - Documentação

Sistema de autenticação RESTful implementado com Laravel 11 e Sanctum.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Endpoints](#endpoints)
- [Exemplos de Uso](#exemplos-de-uso)
- [Códigos de Resposta](#códigos-de-resposta)
- [Segurança](#segurança)

---

## 🎯 Visão Geral

### Base URL
```
http://seu-dominio.com/api/v1/auth
```

### Autenticação
O sistema utiliza **Laravel Sanctum** com tokens pessoais (Personal Access Tokens).

### Headers Necessários
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}  # Apenas para rotas protegidas
```

---

## 🚀 Endpoints

### 1. Registrar Novo Usuário

**POST** `/api/v1/auth/register`

Cria uma nova conta de usuário no sistema.

#### Request Body
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "password_confirmation": "senha123"
}
```

#### Validações
- `name`: obrigatório, string, máximo 255 caracteres
- `email`: obrigatório, email válido, único, máximo 255 caracteres
- `password`: obrigatório, string, mínimo 6 caracteres, confirmação obrigatória

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "email_verified_at": null,
      "created_at": "2026-01-31 10:30:00",
      "updated_at": "2026-01-31 10:30:00"
    },
    "token": "1|abcdefghijklmnopqrstuvwxyz123456789",
    "token_type": "Bearer"
  }
}
```

---

### 2. Login

**POST** `/api/v1/auth/login`

Autentica um usuário e retorna um token de acesso.

#### Request Body
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

#### Validações
- `email`: obrigatório, email válido, máximo 255 caracteres
- `password`: obrigatório, string, mínimo 6 caracteres

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "email_verified_at": null,
      "created_at": "2026-01-31 10:30:00",
      "updated_at": "2026-01-31 10:30:00"
    },
    "token": "2|xyz789abcdefghijklmnopqrstuvwxyz456",
    "token_type": "Bearer"
  }
}
```

#### Response (401 Unauthorized) - Credenciais Inválidas
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

---

### 3. Obter Usuário Autenticado

**GET** `/api/v1/auth/me`

🔒 **Rota Protegida** - Requer autenticação

Retorna os dados do usuário atualmente autenticado.

#### Headers
```http
Authorization: Bearer {seu_token}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Usuário autenticado",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "email_verified_at": null,
      "created_at": "2026-01-31 10:30:00",
      "updated_at": "2026-01-31 10:30:00"
    }
  }
}
```

#### Response (401 Unauthorized)
```json
{
  "message": "Unauthenticated."
}
```

---

### 4. Logout

**POST** `/api/v1/auth/logout`

🔒 **Rota Protegida** - Requer autenticação

Invalida o token atual do usuário (apenas o token usado na requisição).

#### Headers
```http
Authorization: Bearer {seu_token}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 💡 Exemplos de Uso

### cURL

#### Registro
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

#### Obter Usuário Autenticado
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### Logout
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### JavaScript (Fetch API)

```javascript
// Registro
const register = async () => {
  const response = await fetch('http://localhost:8000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      password: 'senha123',
      password_confirmation: 'senha123'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Login
const login = async () => {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: 'joao@exemplo.com',
      password: 'senha123'
    })
  });
  
  const data = await response.json();
  const token = data.data.token;
  
  // Salvar token no localStorage
  localStorage.setItem('auth_token', token);
  
  return data;
};

// Obter usuário autenticado
const getMe = async () => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/v1/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
};

// Logout
const logout = async () => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/v1/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  // Remover token do localStorage
  localStorage.removeItem('auth_token');
  
  return data;
};
```

---

## 📊 Códigos de Resposta

| Código | Descrição |
|--------|-----------|
| **200** | Requisição bem-sucedida |
| **201** | Recurso criado com sucesso |
| **401** | Não autenticado ou credenciais inválidas |
| **422** | Erro de validação nos dados enviados |
| **500** | Erro interno do servidor |

### Estrutura de Erro de Validação (422)

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "email": [
      "O campo e-mail é obrigatório.",
      "O e-mail informado não é válido."
    ],
    "password": [
      "A senha deve ter no mínimo 6 caracteres."
    ]
  }
}
```

---

## 🔒 Segurança

### Características de Segurança

✅ **Autenticação Stateless**
- Tokens pessoais via Laravel Sanctum
- Não utiliza sessões ou cookies
- Ideal para APIs RESTful

✅ **Hash de Senhas**
- Bcrypt automático via cast do Laravel
- Senhas nunca armazenadas em texto plano

✅ **Validação de Dados**
- Form Requests com regras personalizadas
- Mensagens de erro em português
- Validação de email único

✅ **Proteção de Rotas**
- Middleware `auth:sanctum` para rotas protegidas
- Token obrigatório para acessar recursos protegidos

✅ **Respostas Padronizadas**
- UserResource oculta dados sensíveis
- Nunca expõe senha ou remember_token
- Formato JSON consistente

### Boas Práticas Implementadas

1. **Single Responsibility Principle**
   - Controllers enxutos, apenas coordenam requisições
   - Validações isoladas em Form Requests
   - Formatação de resposta em Resources

2. **Código Limpo**
   - Comentários explicativos em português
   - Nomenclatura clara e descritiva
   - Separação de responsabilidades

3. **PostgreSQL Ready**
   - Sistema compatível com PostgreSQL
   - Migrações preparadas para produção

4. **Logout Seguro**
   - Invalida apenas o token atual
   - Mantém outros dispositivos conectados
   - Possibilita múltiplas sessões simultâneas

---

## 🛠️ Arquivos Implementados

```
backend/infogov-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── AuthController.php
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   └── RegisterRequest.php
│   │   └── Resources/
│   │       └── UserResource.php
│   └── Models/
│       └── User.php (atualizado)
├── routes/
│   └── api.php
└── bootstrap/
    └── app.php (atualizado)
```

---

## 📝 Notas Importantes

1. **Tokens Não Expiram**: Por padrão, os tokens não têm expiração. Configure `expiration` em `config/sanctum.php` se necessário.

2. **CORS**: Configure o CORS adequadamente para permitir requisições do frontend.

3. **HTTPS**: Em produção, sempre utilize HTTPS para proteger os tokens em trânsito.

4. **Rate Limiting**: Considere implementar rate limiting para prevenir ataques de força bruta.

---

## ✅ Checklist de Implementação

- [x] Model User com HasApiTokens
- [x] LoginRequest com validações
- [x] RegisterRequest com validações
- [x] UserResource para respostas
- [x] AuthController completo
- [x] Rotas versionadas (/api/v1/auth)
- [x] Middleware auth:sanctum
- [x] Hash automático de senhas
- [x] Compatibilidade PostgreSQL
- [x] Respostas JSON padronizadas
- [x] Tratamento de erros (401, 422)
- [x] Código comentado e limpo

---

**Desenvolvido com ❤️ seguindo as melhores práticas do Laravel 11**
