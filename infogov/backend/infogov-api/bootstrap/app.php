<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Registra o middleware de verificação de papel
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
        
        // Configura redirecionamento de API para retornar JSON ao invés de redirect
        $middleware->redirectGuestsTo(fn () => response()->json([
            'message' => 'Unauthenticated.'
        ], 401));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
