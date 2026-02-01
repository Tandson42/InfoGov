# 🔐 Sistema RBAC - Documentação Completa

Sistema de controle de acesso baseado em papéis (Role-Based Access Control) para API governamental.

---

## 📋 Visão Geral

O sistema RBAC implementado permite gerenciar permissões de usuários através de **papéis (roles)**, facilitando o controle de acesso a recursos e funcionalidades da API.

### Papéis Implementados

| Papel | Descrição | Nível de Acesso |
|-------|-----------|-----------------|
| **Administrador** | Gestão completa do sistema | Total |
| **Servidor** | Funcionário público com acesso intermediário | Intermediário |
| **Cidadão** | Usuário final com acesso básico | Básico |

---

## 🏗️ Arquitetura

### Componentes Implementados

```
📦 Sistema RBAC
├── 📄 Migrations
│   ├── create_roles_table.php
│   └── add_role_id_to_users_table.php
│
├── 📊 Models
│   ├── Role.php (com constantes e métodos)
│   └── User.php (atualizado com relacionamento)
│
├── 🌱 Seeders
│   └── RoleSeeder.php (3 papéis iniciais)
│
├── 🔒 Policies
│   └── UserPolicy.php (regras de acesso)
│
├── 🛡️ Middleware
│   └── CheckRole.php (verificação de papel)
│
└── 📤 Resources
    ├── RoleResource.php
    └── UserResource.php (atualizado)
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `roles`

```sql
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_name (name)
);
```

### Relacionamento em `users`

```sql
ALTER TABLE users ADD COLUMN role_id BIGINT,
ADD FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;
```

**Relacionamento:** N:1 (Muitos usuários → Um papel)

---

## 💻 Uso dos Models

### Model Role

```php
use App\Models\Role;

// Constantes disponíveis
Role::ADMINISTRADOR; // 'administrador'
Role::SERVIDOR;      // 'servidor'
Role::CIDADAO;       // 'cidadao'

// Buscar papel por nome
$role = Role::byName('administrador')->first();

// Verificar tipo de papel
$role->isAdministrador(); // bool
$role->isServidor();      // bool
$role->isCidadao();       // bool

// Acessar usuários do papel
$usuarios = $role->users; // Collection de Users
```

### Model User (métodos adicionados)

```php
use App\Models\User;

// Acessar papel do usuário
$papel = $user->role; // Retorna Role ou null

// Verificar papel específico
$user->hasRole('administrador'); // bool

// Métodos helper
$user->isAdministrador(); // bool
$user->isServidor();      // bool
$user->isCidadao();       // bool

// Verificar múltiplos papéis
$user->hasAnyRole(['administrador', 'servidor']); // bool
```

---

## 🔒 Policies - Regras de Acesso

### UserPolicy - Matriz de Permissões

| Ação | Administrador | Servidor | Cidadão |
|------|---------------|----------|---------|
| **viewAny** (listar usuários) | ✅ Sim | ✅ Sim | ❌ Não |
| **view** (ver usuário específico) | ✅ Qualquer um | ✅ Qualquer um | ⚠️ Apenas si mesmo |
| **create** (criar usuário) | ✅ Sim | ❌ Não | ❌ Não |
| **update** (atualizar usuário) | ✅ Qualquer um | ⚠️ Apenas si mesmo | ⚠️ Apenas si mesmo |
| **delete** (deletar usuário) | ✅ Sim (exceto si mesmo) | ❌ Não | ❌ Não |
| **manageRoles** (gerenciar papéis) | ✅ Sim | ❌ Não | ❌ Não |

### Usando Policies no Controller

```php
use Illuminate\Support\Facades\Gate;

// Verificar se pode ver lista de usuários
if (Gate::allows('viewAny', User::class)) {
    // Autorizado
}

// Verificar se pode atualizar um usuário
if (Gate::allows('update', $user)) {
    // Autorizado
}

// Ou usando o helper authorize()
$this->authorize('update', $user);

// Verificar método customizado
if (Gate::allows('manageRoles', User::class)) {
    // Pode gerenciar papéis
}
```

---

## 🛡️ Middleware CheckRole

### Uso em Rotas

```php
use Illuminate\Support\Facades\Route;

// Rota acessível apenas por Administradores
Route::middleware(['auth:sanctum', 'role:administrador'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
});

// Rota acessível por Administradores OU Servidores
Route::middleware(['auth:sanctum', 'role:administrador,servidor'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

// Rota acessível por qualquer usuário autenticado (sem verificação de papel)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
});
```

### Respostas do Middleware

#### ✅ Autorizado (200-299)
Procede normalmente para o controller.

#### ❌ Não autenticado (401)
```json
{
  "success": false,
  "message": "Não autenticado"
}
```

#### ❌ Sem papel atribuído (403)
```json
{
  "success": false,
  "message": "Usuário sem papel atribuído"
}
```

#### ❌ Papel insuficiente (403)
```json
{
  "success": false,
  "message": "Acesso negado. Papel insuficiente.",
  "required_roles": ["administrador"],
  "user_role": "cidadao"
}
```

---

## 🚀 Exemplos de Rotas Implementadas

### Rotas de Administração (apenas Admin)

```
GET    /api/v1/admin/users          - Listar usuários
POST   /api/v1/admin/users          - Criar usuário
PUT    /api/v1/admin/users/{id}     - Atualizar usuário
DELETE /api/v1/admin/users/{id}     - Deletar usuário
```

### Rotas do Dashboard (Admin + Servidor)

```
GET /api/v1/dashboard/statistics - Estatísticas do sistema
GET /api/v1/dashboard/processes  - Processos governamentais
```

### Rotas Públicas (qualquer usuário autenticado)

```
GET /api/v1/public/services - Serviços públicos disponíveis
```

---

## 📝 Como Atribuir Papéis

### No Registro de Usuário

```php
// No RegisterRequest, adicione validação opcional
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users'],
        'password' => ['required', 'min:6', 'confirmed'],
        'role_id' => ['nullable', 'exists:roles,id'], // Opcional
    ];
}
```

```bash
# Exemplo de requisição
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123",
    "password_confirmation": "senha123",
    "role_id": 3
  }'
```

### Atribuir Papel Padrão

```php
// No AuthController::register()
$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    'password' => $request->password,
    'role_id' => $request->role_id ?? Role::byName(Role::CIDADAO)->first()->id,
]);
```

### Atualizar Papel de Usuário Existente

```php
// Apenas administradores podem fazer isso
$user = User::find($userId);

if (Gate::allows('assignRole', User::class)) {
    $user->role_id = $newRoleId;
    $user->save();
}
```

---

## 🧪 Testes

### Rodar Migrations e Seeders

```bash
# Resetar banco e popular com papéis
php artisan migrate:fresh --seed

# Apenas rodar seeders
php artisan db:seed --class=RoleSeeder
```

### Testar Manualmente

```bash
# 1. Criar usuário com papel de cidadão
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Cidadão",
    "email": "cidadao@test.com",
    "password": "senha123",
    "password_confirmation": "senha123",
    "role_id": 3
  }'

# 2. Fazer login e obter token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cidadao@test.com",
    "password": "senha123"
  }'

# 3. Tentar acessar rota de admin (deve falhar com 403)
curl -X GET http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer SEU_TOKEN"

# Resposta esperada: 403 Forbidden
```

---

## 📊 Respostas JSON com Papel

### Registro/Login com Papel

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
      "role": {
        "id": 1,
        "name": "administrador",
        "description": "Acesso total ao sistema...",
        "created_at": "2026-01-31 10:00:00",
        "updated_at": "2026-01-31 10:00:00"
      },
      "created_at": "2026-01-31 10:30:00",
      "updated_at": "2026-01-31 10:30:00"
    },
    "token": "1|abcdefg123456789",
    "token_type": "Bearer"
  }
}
```

---

## 🔧 Configuração

### Registrar Middleware (já configurado)

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

### Registrar Policy (já configurado)

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::policy(User::class, UserPolicy::class);
}
```

---

## 🎯 Boas Práticas Implementadas

### ✅ SOLID Principles
- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Open/Closed**: Fácil adicionar novos papéis sem modificar código existente
- **Liskov Substitution**: Policies podem ser substituídas
- **Interface Segregation**: Métodos específicos por contexto
- **Dependency Inversion**: Usa abstrações do Laravel

### ✅ PSR-12
- Código formatado seguindo PSR-12
- Nomenclatura consistente
- Documentação adequada

### ✅ Desacoplamento
- Middleware separado da lógica de negócio
- Policies isoladas
- Models com responsabilidades claras

### ✅ Extensibilidade
- Fácil adicionar novos papéis
- Simples criar novas policies
- Middleware reutilizável

---

## 📚 Próximos Passos Sugeridos

1. **Adicionar Permissões Granulares**
   - Criar tabela `permissions`
   - Relacionamento N:M entre `roles` e `permissions`

2. **Implementar Hierarquia de Papéis**
   - Papel pode herdar de outro

3. **Auditoria**
   - Log de mudanças de papéis
   - Histórico de acessos

4. **Cache de Permissões**
   - Melhorar performance com cache

5. **Interface de Gerenciamento**
   - CRUD de papéis via API
   - Atribuição de papéis a usuários

---

## ✅ Checklist de Implementação

- [x] Migration `create_roles_table`
- [x] Migration `add_role_id_to_users_table`
- [x] Model `Role` com constantes
- [x] Model `Role` com métodos helper
- [x] Model `User` com relacionamento
- [x] Model `User` com métodos helper
- [x] `RoleSeeder` com 3 papéis
- [x] `UserPolicy` com regras de acesso
- [x] Middleware `CheckRole`
- [x] Registro do middleware
- [x] Registro da policy
- [x] `RoleResource`
- [x] `UserResource` atualizado
- [x] `AuthController` atualizado
- [x] Rotas de exemplo
- [x] Testes validados
- [x] Documentação completa

---

## 🎉 Sistema Pronto para Uso!

O sistema RBAC está **100% funcional** e pronto para ser utilizado em produção.

**Desenvolvido seguindo as melhores práticas de arquitetura de software Laravel** 🚀
