<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Primeiro cria os papéis
        $this->call([
            RoleSeeder::class,
            UserSeeder::class, // Cria os usuários de teste
            DepartmentSeeder::class, // Adiciona departamentos de exemplo
        ]);
    }
}
