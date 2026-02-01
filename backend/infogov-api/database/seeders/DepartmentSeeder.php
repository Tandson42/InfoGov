<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para popular a tabela de departamentos
 * 
 * Cria departamentos de exemplo para testes
 */
class DepartmentSeeder extends Seeder
{
    /**
     * Popula a tabela de departamentos com dados de exemplo
     *
     * @return void
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Recursos Humanos',
                'code' => 'RH',
                'active' => true,
            ],
            [
                'name' => 'Tecnologia da Informação',
                'code' => 'TI',
                'active' => true,
            ],
            [
                'name' => 'Financeiro',
                'code' => 'FIN',
                'active' => true,
            ],
            [
                'name' => 'Jurídico',
                'code' => 'JUR',
                'active' => true,
            ],
            [
                'name' => 'Comunicação',
                'code' => 'COM',
                'active' => true,
            ],
            [
                'name' => 'Obras e Infraestrutura',
                'code' => 'OBR',
                'active' => true,
            ],
            [
                'name' => 'Educação',
                'code' => 'EDU',
                'active' => true,
            ],
            [
                'name' => 'Saúde',
                'code' => 'SAU',
                'active' => true,
            ],
            [
                'name' => 'Planejamento',
                'code' => 'PLAN',
                'active' => true,
            ],
            [
                'name' => 'Arquivo Morto',
                'code' => 'ARQ-OLD',
                'active' => false,
            ],
        ];

        foreach ($departments as $departmentData) {
            Department::firstOrCreate(
                ['code' => $departmentData['code']], // Busca por código
                $departmentData // Cria com todos os dados se não existir
            );
        }

        $this->command->info('✓ Departamentos criados com sucesso!');
        $this->command->info('  Total: ' . Department::count() . ' departamentos');
    }
}
