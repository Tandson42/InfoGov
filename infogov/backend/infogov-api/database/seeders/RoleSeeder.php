<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para popular a tabela de papéis (roles)
 * 
 * Cria os três papéis fundamentais do sistema governamental:
 * - Administrador: Gestão completa do sistema
 * - Servidor: Funcionários públicos com acesso intermediário
 * - Cidadão: Usuários finais com acesso básico
 */
class RoleSeeder extends Seeder
{
    /**
     * Popula a tabela de papéis com os dados iniciais
     *
     * @return void
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => Role::ADMINISTRADOR,
                'description' => 'Acesso total ao sistema. Pode gerenciar usuários, configurações e todos os recursos disponíveis.',
            ],
            [
                'name' => Role::SERVIDOR,
                'description' => 'Funcionário público com acesso a funcionalidades governamentais e gerenciamento de processos.',
            ],
            [
                'name' => Role::CIDADAO,
                'description' => 'Cidadão com acesso básico aos serviços públicos digitais e consultas.',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']], // Busca por nome
                ['description' => $roleData['description']] // Cria com descrição se não existir
            );
        }

        $this->command->info('✓ Papéis criados com sucesso!');
        $this->command->info('  - Administrador');
        $this->command->info('  - Servidor');
        $this->command->info('  - Cidadão');
    }
}
