<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Versão 1
|--------------------------------------------------------------------------
|
| Rotas da API versionadas seguindo padrão RESTful
| Prefixo: /api/v1
|
*/

// Rotas públicas de autenticação (não requerem token)
Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        // POST /api/v1/auth/register - Registra novo usuário
        Route::post('/register', [AuthController::class, 'register']);
        
        // POST /api/v1/auth/login - Realiza login
        Route::post('/login', [AuthController::class, 'login']);
    });
});

// Rotas protegidas (requerem autenticação via Sanctum)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    // Rotas de autenticação
    Route::prefix('auth')->group(function () {
        // GET /api/v1/auth/me - Retorna usuário autenticado
        Route::get('/me', [AuthController::class, 'me']);
        
        // POST /api/v1/auth/logout - Realiza logout
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    /*
    |--------------------------------------------------------------------------
    | Exemplos de Rotas com RBAC
    |--------------------------------------------------------------------------
    |
    | Demonstração de como usar o middleware 'role' para controle de acesso
    |
    */

    // Rotas acessíveis apenas por Administradores
    Route::middleware('role:administrador')->prefix('admin')->group(function () {
        // Exemplo: Listar todos os usuários (apenas admin)
        Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
        
        // Exemplo: Criar usuário (apenas admin)
        Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
        
        // Exemplo: Atualizar usuário (apenas admin)
        Route::put('/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        
        // Exemplo: Deletar usuário (apenas admin)
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    });

    // Rotas acessíveis por Administradores e Servidores
    Route::middleware('role:administrador,servidor')->prefix('dashboard')->group(function () {
        // Exemplo: Visualizar dashboard governamental
        Route::get('/statistics', function () {
            return response()->json([
                'success' => true,
                'message' => 'Dashboard acessível por Administrador e Servidor',
                'data' => [
                    'statistics' => 'Dados estatísticos do sistema',
                ],
            ]);
        })->name('dashboard.statistics');
        
        // Exemplo: Gerenciar processos
        Route::get('/processes', function () {
            return response()->json([
                'success' => true,
                'message' => 'Processos governamentais',
            ]);
        })->name('dashboard.processes');
    });

    // Rotas acessíveis por todos os usuários autenticados (qualquer papel)
    Route::prefix('public')->group(function () {
        // Exemplo: Consultar serviços públicos
        Route::get('/services', function () {
            return response()->json([
                'success' => true,
                'message' => 'Serviços públicos disponíveis',
                'data' => [
                    'services' => [
                        'Consulta de processos',
                        'Emissão de documentos',
                        'Atendimento online',
                    ],
                ],
            ]);
        })->name('public.services');
    });
});
