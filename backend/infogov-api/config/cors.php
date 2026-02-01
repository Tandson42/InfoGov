<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configuração otimizada para integração com React/React Native
    | 
    | Para React Native: Permite todas as origens (*)
    | Para React Web: Configure FRONTEND_URL no .env
    |
    */

    // Caminhos que terão CORS habilitado
    'paths' => [
        'api/*',              // Todas as rotas da API
        'sanctum/csrf-cookie' // CSRF token para SPAs
    ],

    // Métodos HTTP permitidos
    'allowed_methods' => ['*'], // GET, POST, PUT, PATCH, DELETE, OPTIONS

    // Origens permitidas
    // Use ['*'] para desenvolvimento ou especifique origens em produção
    'allowed_origins' => env('FRONTEND_URL') ? explode(',', env('FRONTEND_URL')) : ['*'],

    // Padrões de origens permitidas (regex)
    'allowed_origins_patterns' => [],

    // Headers permitidos na requisição
    'allowed_headers' => ['*'],

    // Headers expostos na resposta (acessíveis pelo JavaScript)
    'exposed_headers' => [
        'Authorization',
        'Content-Type',
        'X-Requested-With',
    ],

    // Tempo de cache da resposta OPTIONS em segundos
    'max_age' => 86400, // 24 horas

    // Permite envio de cookies e credenciais
    // Para React Native com tokens: false
    // Para React Web com cookies de sessão: true
    'supports_credentials' => env('CORS_SUPPORTS_CREDENTIALS', false),

];
