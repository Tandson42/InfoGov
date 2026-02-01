<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * Controller responsável pela autenticação via API
 * 
 * Gerencia login, logout, registro e informações do usuário autenticado
 * utilizando Laravel Sanctum para geração de tokens pessoais
 */
class AuthController extends Controller
{
    /**
     * Registra um novo usuário no sistema
     * 
     * Cria uma nova conta de usuário com os dados validados
     * e retorna um token de acesso pessoal
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Cria o usuário com senha hasheada automaticamente (via cast)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // O cast 'hashed' faz o bcrypt automaticamente
            'role_id' => $request->role_id, // Permite atribuir papel no registro
        ]);

        // Carrega o relacionamento role para incluir na resposta
        $user->load('role');

        // Gera um token pessoal para o usuário
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Usuário registrado com sucesso',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ], 201);
    }

    /**
     * Autentica um usuário e retorna um token de acesso
     * 
     * Valida as credenciais (e-mail e senha) e gera um token
     * pessoal caso a autenticação seja bem-sucedida
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Busca o usuário pelo e-mail e carrega o papel
        $user = User::with('role')->where('email', $request->email)->first();

        // Verifica se o usuário existe e se a senha está correta
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciais inválidas',
            ], 401);
        }

        // Gera um token pessoal para o usuário
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login realizado com sucesso',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ], 200);
    }

    /**
     * Retorna os dados do usuário autenticado
     * 
     * Endpoint protegido que retorna as informações
     * do usuário atualmente autenticado via token
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        // Carrega o papel do usuário
        $user = $request->user()->load('role');

        return response()->json([
            'success' => true,
            'message' => 'Usuário autenticado',
            'data' => [
                'user' => new UserResource($user),
            ],
        ], 200);
    }

    /**
     * Realiza o logout do usuário
     * 
     * Invalida o token atual usado na requisição,
     * mantendo outros tokens do usuário ativos
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Remove apenas o token atual usado na requisição
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso',
        ], 200);
    }
}
