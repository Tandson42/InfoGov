<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adiciona a coluna role_id na tabela users
     * Estabelece relacionamento N:1 (User → Role)
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')
                ->nullable()
                ->after('email')
                ->constrained('roles')
                ->onDelete('set null')
                ->comment('Papel do usuário no sistema');
            
            // Índice para melhorar performance de consultas
            $table->index('role_id');
        });
    }

    /**
     * Reverte a migration removendo a coluna role_id
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropIndex(['role_id']);
            $table->dropColumn('role_id');
        });
    }
};
