# 📁 CRUD Departamentos - Documentação

Sistema completo de gerenciamento de departamentos governamentais via API RESTful.

---

## 📋 Visão Geral

CRUD completo para a entidade **Department** com:
- ✅ Listagem paginada com filtros
- ✅ Criação, leitura, atualização e exclusão
- ✅ Soft deletes (exclusão lógica)
- ✅ Restore de registros excluídos
- ✅ Ordenação customizável
- ✅ Controle de acesso via Policy
- ✅ Validações robustas
- ✅ Respostas JSON padronizadas

---

## 🗄️ Estrutura da Entidade

### Tabela: `departments`

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| **id** | bigint | Identificador único | Auto-incremento |
| **name** | string(255) | Nome do departamento | Obrigatório, 3-255 caracteres |
| **code** | string(20) | Código único | Obrigatório, único, 2-20 caracteres, alpha_dash |
| **active** | boolean | Status do departamento | Padrão: true |
| **created_at** | timestamp | Data de criação | Automático |
| **updated_at** | timestamp | Data de atualização | Automático |
| **deleted_at** | timestamp | Data de exclusão (soft delete) | Nullable |

### Índices
- `PRIMARY KEY (id)`
- `UNIQUE (code)`
- `INDEX (name)`
- `INDEX (code)`
- `INDEX (active)`

---

## 🚀 Endpoints da API

### Base URL
```
/api/v1/departments
```

### 1. Listar Departamentos

**GET** `/api/v1/departments`

Lista todos os departamentos com paginação e filtros.

#### Query Parameters

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|--------|
| `page` | integer | Número da página | 1 |
| `per_page` | integer | Itens por página (máx: 100) | 15 |
| `name` | string | Filtro por nome (busca parcial) | - |
| `code` | string | Filtro por código (busca parcial) | - |
| `active` | string | Filtro por status (true/false/all) | - |
| `sort_by` | string | Campo para ordenação | name |
| `sort_direction` | string | Direção (asc/desc) | asc |
| `with_trashed` | boolean | Incluir excluídos | false |

#### Campos de Ordenação Permitidos
- `name`
- `code`
- `active`
- `created_at`
- `updated_at`

#### Exemplo de Requisição

```bash
# Listar todos (paginado)
curl -X GET "http://localhost:8000/api/v1/departments" \
  -H "Authorization: Bearer SEU_TOKEN"

# Com filtros
curl -X GET "http://localhost:8000/api/v1/departments?name=TI&active=true&per_page=20" \
  -H "Authorization: Bearer SEU_TOKEN"

# Com ordenação
curl -X GET "http://localhost:8000/api/v1/departments?sort_by=code&sort_direction=desc" \
  -H "Authorization: Bearer SEU_TOKEN"
```

#### Resposta (200 OK)

```json
{
  "data": [
    {
      "id": 1,
      "name": "Tecnologia da Informação",
      "code": "TI",
      "active": true,
      "created_at": "2026-01-31 10:00:00",
      "updated_at": "2026-01-31 10:00:00",
      "deleted_at": null
    }
  ],
  "links": {
    "first": "http://localhost:8000/api/v1/departments?page=1",
    "last": "http://localhost:8000/api/v1/departments?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 15,
    "to": 10,
    "total": 10
  }
}
```

---

### 2. Criar Departamento

**POST** `/api/v1/departments`

🔒 **Apenas Administradores**

Cria um novo departamento.

#### Request Body

```json
{
  "name": "Marketing Digital",
  "code": "MKT",
  "active": true
}
```

#### Validações

- **name**: obrigatório, string, 3-255 caracteres
- **code**: obrigatório, único, 2-20 caracteres, alpha_dash (letras, números, hífens, sublinhados)
- **active**: opcional, boolean (padrão: true)

**Nota:** O código é automaticamente convertido para maiúsculas.

#### Resposta (201 Created)

```json
{
  "success": true,
  "message": "Departamento criado com sucesso",
  "data": {
    "id": 11,
    "name": "Marketing Digital",
    "code": "MKT",
    "active": true,
    "created_at": "2026-01-31 15:30:00",
    "updated_at": "2026-01-31 15:30:00",
    "deleted_at": null
  }
}
```

#### Erro de Validação (422)

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "code": [
      "Este código já está cadastrado."
    ]
  }
}
```

---

### 3. Visualizar Departamento

**GET** `/api/v1/departments/{id}`

Exibe um departamento específico.

#### Exemplo de Requisição

```bash
curl -X GET "http://localhost:8000/api/v1/departments/1" \
  -H "Authorization: Bearer SEU_TOKEN"
```

#### Resposta (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Recursos Humanos",
    "code": "RH",
    "active": true,
    "created_at": "2026-01-31 10:00:00",
    "updated_at": "2026-01-31 10:00:00",
    "deleted_at": null
  }
}
```

#### Erro (404 Not Found)

```json
{
  "message": "No query results for model [App\\Models\\Department] 999"
}
```

---

### 4. Atualizar Departamento

**PUT/PATCH** `/api/v1/departments/{id}`

🔒 **Apenas Administradores**

Atualiza um departamento existente.

#### Request Body

```json
{
  "name": "Recursos Humanos e Gestão de Pessoas",
  "active": false
}
```

**Nota:** Todos os campos são opcionais (atualização parcial).

#### Exemplo de Requisição

```bash
curl -X PUT "http://localhost:8000/api/v1/departments/1" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Recursos Humanos Atualizado",
    "active": false
  }'
```

#### Resposta (200 OK)

```json
{
  "success": true,
  "message": "Departamento atualizado com sucesso",
  "data": {
    "id": 1,
    "name": "Recursos Humanos Atualizado",
    "code": "RH",
    "active": false,
    "created_at": "2026-01-31 10:00:00",
    "updated_at": "2026-01-31 15:45:00",
    "deleted_at": null
  }
}
```

---

### 5. Excluir Departamento (Soft Delete)

**DELETE** `/api/v1/departments/{id}`

🔒 **Apenas Administradores**

Exclui logicamente um departamento (soft delete).

#### Exemplo de Requisição

```bash
curl -X DELETE "http://localhost:8000/api/v1/departments/1" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

#### Resposta (200 OK)

```json
{
  "success": true,
  "message": "Departamento excluído com sucesso"
}
```

---

### 6. Restaurar Departamento

**POST** `/api/v1/departments/{id}/restore`

🔒 **Apenas Administradores**

Restaura um departamento excluído logicamente.

#### Exemplo de Requisição

```bash
curl -X POST "http://localhost:8000/api/v1/departments/1/restore" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

#### Resposta (200 OK)

```json
{
  "success": true,
  "message": "Departamento restaurado com sucesso",
  "data": {
    "id": 1,
    "name": "Recursos Humanos",
    "code": "RH",
    "active": true,
    "created_at": "2026-01-31 10:00:00",
    "updated_at": "2026-01-31 16:00:00",
    "deleted_at": null
  }
}
```

---

### 7. Excluir Permanentemente

**DELETE** `/api/v1/departments/{id}/force`

🔒 **Apenas Administradores**

⚠️ **ATENÇÃO:** Exclui permanentemente um departamento. Esta ação não pode ser desfeita!

#### Exemplo de Requisição

```bash
curl -X DELETE "http://localhost:8000/api/v1/departments/1/force" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

#### Resposta (200 OK)

```json
{
  "success": true,
  "message": "Departamento excluído permanentemente"
}
```

---

## 🔒 Controle de Acesso (Policies)

### Regras de Permissão

| Ação | Administrador | Servidor | Cidadão |
|------|---------------|----------|---------|
| **Listar (viewAny)** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Visualizar (view)** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Criar (create)** | ✅ Sim | ❌ Não | ❌ Não |
| **Atualizar (update)** | ✅ Sim | ❌ Não | ❌ Não |
| **Excluir (delete)** | ✅ Sim | ❌ Não | ❌ Não |
| **Restaurar (restore)** | ✅ Sim | ❌ Não | ❌ Não |
| **Excluir permanente** | ✅ Sim | ❌ Não | ❌ Não |

### Resposta de Acesso Negado (403)

```json
{
  "message": "This action is unauthorized."
}
```

---

## 📊 Códigos de Resposta HTTP

| Código | Descrição |
|--------|-----------|
| **200** | Requisição bem-sucedida |
| **201** | Recurso criado com sucesso |
| **401** | Não autenticado |
| **403** | Acesso negado (sem permissão) |
| **404** | Recurso não encontrado |
| **422** | Erro de validação |
| **500** | Erro interno do servidor |

---

## 💡 Exemplos de Uso

### JavaScript (Fetch API)

```javascript
const API_URL = 'http://localhost:8000/api/v1/departments';
const token = localStorage.getItem('auth_token');

// Listar departamentos
async function listDepartments(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response.json();
}

// Criar departamento
async function createDepartment(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Atualizar departamento
async function updateDepartment(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Excluir departamento
async function deleteDepartment(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response.json();
}

// Uso
const departments = await listDepartments({ active: 'true', per_page: 20 });
```

---

## 🧪 Testes

### Teste Manual com cURL

```bash
# 1. Fazer login e obter token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gov.br","password":"senha123"}' \
  | jq -r '.data.token')

# 2. Listar departamentos
curl -X GET "http://localhost:8000/api/v1/departments?active=true" \
  -H "Authorization: Bearer $TOKEN"

# 3. Criar departamento
curl -X POST http://localhost:8000/api/v1/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Inovação",
    "code": "INOV",
    "active": true
  }'

# 4. Atualizar departamento
curl -X PUT http://localhost:8000/api/v1/departments/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RH Atualizado"
  }'

# 5. Excluir departamento
curl -X DELETE http://localhost:8000/api/v1/departments/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Arquivos Implementados

```
backend/infogov-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── DepartmentController.php     ← Controller CRUD completo
│   │   ├── Requests/
│   │   │   ├── StoreDepartmentRequest.php       ← Validação de criação
│   │   │   └── UpdateDepartmentRequest.php      ← Validação de atualização
│   │   └── Resources/
│   │       └── DepartmentResource.php           ← Formatação de respostas
│   ├── Models/
│   │   └── Department.php                       ← Model com scopes e casts
│   └── Policies/
│       └── DepartmentPolicy.php                 ← Controle de acesso
├── database/
│   ├── migrations/
│   │   └── 2026_01_31_161616_create_departments_table.php
│   └── seeders/
│       └── DepartmentSeeder.php                 ← 10 departamentos de exemplo
└── routes/
    └── api.php                                  ← Rotas RESTful
```

---

## ✅ Checklist de Implementação

- [x] Migration com estrutura completa
- [x] Model com SoftDeletes
- [x] Model com scopes de filtro
- [x] Model com casts apropriados
- [x] StoreDepartmentRequest com validações
- [x] UpdateDepartmentRequest com validações
- [x] DepartmentResource para respostas
- [x] DepartmentPolicy com regras de acesso
- [x] DepartmentController com CRUD completo
- [x] Listagem com paginação
- [x] Filtros por nome, código e status
- [x] Ordenação customizável
- [x] Soft deletes
- [x] Restore de excluídos
- [x] Force delete
- [x] Rotas RESTful versionadas
- [x] Policy registrada
- [x] Seeder com dados de exemplo
- [x] Testes validados

---

## 🎉 Sistema Pronto!

O CRUD de departamentos está **100% funcional** e pronto para uso em produção.

**Desenvolvido seguindo as melhores práticas de engenharia de software** 🚀
