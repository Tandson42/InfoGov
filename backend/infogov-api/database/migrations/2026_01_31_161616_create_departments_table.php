<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria a tabela de departamentos
     * 
     * Estrutura para gerenciar departamentos governamentais
     */
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nome do departamento');
            $table->string('code', 20)->unique()->comment('Código único do departamento');
            $table->boolean('active')->default(true)->comment('Status do departamento');
            $table->timestamps();
            $table->softDeletes()->comment('Data de exclusão lógica');
            
            // Índices para melhorar performance
            $table->index('name');
            $table->index('code');
            $table->index('active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
