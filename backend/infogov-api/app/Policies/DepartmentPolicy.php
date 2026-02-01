<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Policy para controle de acesso a departamentos
 * 
 * Regras:
 * - Todos usuários autenticados podem visualizar
 * - Apenas Administradores podem criar/editar/excluir
 */
class DepartmentPolicy
{
    /**
     * Determina se o usuário pode visualizar a lista de departamentos
     * 
     * Regras:
     * - Qualquer usuário autenticado pode visualizar
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // Todos usuários autenticados podem ver a lista
        return true;
    }

    /**
     * Determina se o usuário pode visualizar um departamento específico
     * 
     * Regras:
     * - Qualquer usuário autenticado pode visualizar
     *
     * @param User $user
     * @param Department $department
     * @return bool
     */
    public function view(User $user, Department $department): bool
    {
        // Todos usuários autenticados podem ver um departamento
        return true;
    }

    /**
     * Determina se o usuário pode criar departamentos
     * 
     * Regras:
     * - Apenas Administradores podem criar
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->isAdministrador();
    }

    /**
     * Determina se o usuário pode atualizar um departamento
     * 
     * Regras:
     * - Apenas Administradores podem atualizar
     *
     * @param User $user
     * @param Department $department
     * @return bool
     */
    public function update(User $user, Department $department): bool
    {
        return $user->isAdministrador();
    }

    /**
     * Determina se o usuário pode excluir um departamento
     * 
     * Regras:
     * - Apenas Administradores podem excluir
     *
     * @param User $user
     * @param Department $department
     * @return bool
     */
    public function delete(User $user, Department $department): bool
    {
        return $user->isAdministrador();
    }

    /**
     * Determina se o usuário pode restaurar um departamento
     * 
     * Regras:
     * - Apenas Administradores podem restaurar
     *
     * @param User $user
     * @param Department $department
     * @return bool
     */
    public function restore(User $user, Department $department): bool
    {
        return $user->isAdministrador();
    }

    /**
     * Determina se o usuário pode excluir permanentemente um departamento
     * 
     * Regras:
     * - Apenas Administradores podem excluir permanentemente
     *
     * @param User $user
     * @param Department $department
     * @return bool
     */
    public function forceDelete(User $user, Department $department): bool
    {
        return $user->isAdministrador();
    }
}
