<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Busca os papéis
        $roleAdmin = Role::where('name', Role::ADMINISTRADOR)->first();
        $roleServidor = Role::where('name', Role::SERVIDOR)->first();
        $roleCidadao = Role::where('name', Role::CIDADAO)->first();

        // Cria usuário Administrador
        User::updateOrCreate(
            ['email' => 'admin@email.com'],
            [
                'name' => 'Administrador',
                'email' => 'admin@email.com',
                'password' => '123456',
                'role_id' => $roleAdmin->id,
            ]
        );

        // Cria usuário Servidor
        User::updateOrCreate(
            ['email' => 'servidor@email.com'],
            [
                'name' => 'Servidor',
                'email' => 'servidor@email.com',
                'password' => '123456',
                'role_id' => $roleServidor->id,
            ]
        );

        // Cria usuário Cidadão
        User::updateOrCreate(
            ['email' => 'cidadao@email.com'],
            [
                'name' => 'Cidadão',
                'email' => 'cidadao@email.com',
                'password' => '123456',
                'role_id' => $roleCidadao->id,
            ]
        );

        $this->command->info('✓ Usuários criados com sucesso!');
        $this->command->info('  - admin@email.com (Administrador)');
        $this->command->info('  - servidor@email.com (Servidor)');
        $this->command->info('  - cidadao@email.com (Cidadão)');
    }
}
