# 🎯 RBAC - Exemplos Práticos de Uso

Exemplos práticos de como usar o sistema RBAC na API governamental.

---

## 📝 Cenários de Uso

### 1️⃣ Registrar Usuário com Papel

#### Cenário: Novo cidadão se registrando

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@exemplo.com",
    "password": "senha123",
    "password_confirmation": "senha123",
    "role_id": 3
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "Maria Silva",
      "email": "maria@exemplo.com",
      "role": {
        "id": 3,
        "name": "cidadao",
        "description": "Cidadão com acesso básico..."
      }
    },
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

---

### 2️⃣ Login e Verificação de Papel

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@exemplo.com",
    "password": "senha123"
  }'
```

```bash
# Verificar dados do usuário autenticado (com papel)
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 3️⃣ Tentar Acessar Rota de Administrador (Sem Permissão)

#### Cenário: Cidadão tenta acessar painel admin

```bash
curl -X GET http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer TOKEN_DO_CIDADAO"
```

**Resposta (403):**
```json
{
  "success": false,
  "message": "Acesso negado. Papel insuficiente.",
  "required_roles": ["administrador"],
  "user_role": "cidadao"
}
```

---

### 4️⃣ Administrador Acessando Painel

```bash
# 1. Login como admin
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@exemplo.com",
    "password": "senha123"
  }'

# 2. Acessar lista de usuários
curl -X GET http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer TOKEN_DO_ADMIN"
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "users": [...]
  }
}
```

---

### 5️⃣ Servidor Acessando Dashboard

#### Cenário: Funcionário público acessando estatísticas

```bash
curl -X GET http://localhost:8000/api/v1/dashboard/statistics \
  -H "Authorization: Bearer TOKEN_DO_SERVIDOR"
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Dashboard acessível por Administrador e Servidor",
  "data": {
    "statistics": "Dados estatísticos do sistema"
  }
}
```

---

## 💻 Exemplos de Código em Controllers

### Verificar Papel Manualmente

```php
use App\Models\Role;

class DocumentController extends Controller
{
    public function upload(Request $request)
    {
        $user = $request->user();
        
        // Verificar se é administrador
        if ($user->isAdministrador()) {
            // Permite upload de qualquer tipo
            return $this->uploadAnyDocument($request);
        }
        
        // Verificar se é servidor
        if ($user->isServidor()) {
            // Permite upload apenas de documentos oficiais
            return $this->uploadOfficialDocument($request);
        }
        
        // Cidadão: apenas documentos pessoais
        return $this->uploadPersonalDocument($request);
    }
}
```

### Usar Policy no Controller

```php
class UserController extends Controller
{
    public function index(Request $request)
    {
        // Verifica automaticamente via UserPolicy::viewAny
        $this->authorize('viewAny', User::class);
        
        $users = User::with('role')->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
        ]);
    }
    
    public function update(Request $request, User $user)
    {
        // Verifica via UserPolicy::update
        $this->authorize('update', $user);
        
        $user->update($request->validated());
        
        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }
}
```

### Verificar Múltiplos Papéis

```php
class ProcessController extends Controller
{
    public function approve(Request $request, $processId)
    {
        $user = $request->user();
        
        // Apenas admin e servidor podem aprovar
        if (!$user->hasAnyRole([Role::ADMINISTRADOR, Role::SERVIDOR])) {
            return response()->json([
                'success' => false,
                'message' => 'Apenas administradores e servidores podem aprovar processos',
            ], 403);
        }
        
        // Lógica de aprovação...
    }
}
```

---

## 🛣️ Exemplos de Rotas

### Rotas com Middleware CheckRole

```php
use App\Http\Controllers\Api\ProcessController;
use App\Http\Controllers\Api\DocumentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    // APENAS ADMINISTRADOR
    Route::middleware('role:administrador')->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::post('/roles/assign', [RoleController::class, 'assign']);
    });
    
    // ADMINISTRADOR OU SERVIDOR
    Route::middleware('role:administrador,servidor')->prefix('manage')->group(function () {
        Route::get('/processes', [ProcessController::class, 'index']);
        Route::post('/processes/{id}/approve', [ProcessController::class, 'approve']);
        Route::get('/reports', [ReportController::class, 'index']);
    });
    
    // QUALQUER USUÁRIO AUTENTICADO
    Route::prefix('services')->group(function () {
        Route::get('/', [ServiceController::class, 'index']);
        Route::post('/request', [ServiceController::class, 'request']);
        Route::get('/my-requests', [ServiceController::class, 'myRequests']);
    });
});
```

---

## 🔍 Consultas Úteis

### Buscar Usuários por Papel

```php
use App\Models\User;
use App\Models\Role;

// Todos os administradores
$admins = User::whereHas('role', function ($query) {
    $query->where('name', Role::ADMINISTRADOR);
})->get();

// Servidores ativos
$servidores = User::whereHas('role', function ($query) {
    $query->where('name', Role::SERVIDOR);
})->where('active', true)->get();

// Contar usuários por papel
$counts = User::with('role')
    ->get()
    ->groupBy('role.name')
    ->map(fn($users) => $users->count());

// Output: ['administrador' => 5, 'servidor' => 25, 'cidadao' => 150]
```

### Atribuir Papel a Usuário

```php
use App\Models\User;
use App\Models\Role;

// Buscar papel
$servidorRole = Role::byName(Role::SERVIDOR)->first();

// Atribuir ao usuário
$user = User::find($userId);
$user->role_id = $servidorRole->id;
$user->save();

// Ou ao criar
$user = User::create([
    'name' => 'João',
    'email' => 'joao@gov.br',
    'password' => 'senha123',
    'role_id' => $servidorRole->id,
]);
```

---

## 🧪 Testes Automatizados

### Exemplo de Feature Test

```php
use App\Models\Role;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class RBACTest extends TestCase
{
    public function test_cidadao_nao_pode_acessar_admin()
    {
        $cidadaoRole = Role::byName(Role::CIDADAO)->first();
        $cidadao = User::factory()->create(['role_id' => $cidadaoRole->id]);
        
        Sanctum::actingAs($cidadao);
        
        $response = $this->getJson('/api/v1/admin/users');
        
        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Acesso negado. Papel insuficiente.',
            ]);
    }
    
    public function test_administrador_pode_acessar_admin()
    {
        $adminRole = Role::byName(Role::ADMINISTRADOR)->first();
        $admin = User::factory()->create(['role_id' => $adminRole->id]);
        
        Sanctum::actingAs($admin);
        
        $response = $this->getJson('/api/v1/admin/users');
        
        $response->assertStatus(200);
    }
    
    public function test_servidor_pode_acessar_dashboard()
    {
        $servidorRole = Role::byName(Role::SERVIDOR)->first();
        $servidor = User::factory()->create(['role_id' => $servidorRole->id]);
        
        Sanctum::actingAs($servidor);
        
        $response = $this->getJson('/api/v1/dashboard/statistics');
        
        $response->assertStatus(200);
    }
}
```

---

## 🎨 Personalização

### Adicionar Novo Papel

1. **Adicionar constante no Model Role:**

```php
class Role extends Model
{
    public const ADMINISTRADOR = 'administrador';
    public const SERVIDOR = 'servidor';
    public const CIDADAO = 'cidadao';
    public const AUDITOR = 'auditor'; // Novo papel
    
    public function isAuditor(): bool
    {
        return $this->name === self::AUDITOR;
    }
}
```

2. **Atualizar RoleSeeder:**

```php
public function run(): void
{
    $roles = [
        // ... papéis existentes
        [
            'name' => Role::AUDITOR,
            'description' => 'Auditor com acesso a relatórios e logs',
        ],
    ];
    // ...
}
```

3. **Adicionar método no User:**

```php
public function isAuditor(): bool
{
    return $this->hasRole(Role::AUDITOR);
}
```

4. **Usar nas rotas:**

```php
Route::middleware('role:auditor')->group(function () {
    Route::get('/audit/logs', [AuditController::class, 'logs']);
});
```

---

## 📊 Dashboard de Controle

### Exemplo de Endpoint para Estatísticas de Papéis

```php
class DashboardController extends Controller
{
    public function roleStatistics(Request $request)
    {
        $this->authorize('viewAny', User::class);
        
        $statistics = User::selectRaw('role_id, COUNT(*) as total')
            ->groupBy('role_id')
            ->with('role:id,name')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->role->name => $item->total];
            });
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'by_role' => $statistics,
                'active_users' => User::whereNotNull('email_verified_at')->count(),
            ],
        ]);
    }
}
```

---

## ✅ Checklist de Uso

Ao implementar uma nova funcionalidade:

- [ ] Definir qual papel pode acessar
- [ ] Adicionar middleware `role:papelX` na rota
- [ ] Ou criar/atualizar policy se necessário
- [ ] Usar `$this->authorize()` no controller
- [ ] Testar com diferentes papéis
- [ ] Documentar a permissão necessária

---

## 🚀 Pronto para Usar!

O sistema RBAC está configurado e pronto. Use estes exemplos como base para implementar seu controle de acesso.

**Dúvidas?** Consulte `README_RBAC.md` para documentação completa.
