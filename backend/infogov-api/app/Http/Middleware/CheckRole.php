<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware para verificação de papéis (RBAC)
 * 
 * Verifica se o usuário autenticado possui um dos papéis especificados
 * antes de permitir acesso à rota.
 * 
 * Uso:
 * - Route::middleware(['auth:sanctum', 'role:administrador'])->group(...)
 * - Route::middleware(['auth:sanctum', 'role:administrador,servidor'])->group(...)
 */
class CheckRole
{
    /**
     * Processa a requisição verificando o papel do usuário
     *
     * @param Request $request
     * @param Closure $next
     * @param string ...$roles Lista de papéis permitidos (separados por vírgula)
     * @return Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Verifica se o usuário está autenticado
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Não autenticado',
            ], 401);
        }

        $user = $request->user();

        // Verifica se o usuário tem um papel atribuído
        if (!$user->role) {
            return response()->json([
                'success' => false,
                'message' => 'Usuário sem papel atribuído',
            ], 403);
        }

        // Verifica se o usuário tem um dos papéis permitidos
        if (!empty($roles) && !$user->hasAnyRole($roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Acesso negado. Papel insuficiente.',
                'required_roles' => $roles,
                'user_role' => $user->role->name,
            ], 403);
        }

        return $next($request);
    }
}
