<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Policy para controle de acesso baseado em papéis (RBAC)
 * 
 * Define as permissões de acordo com os papéis:
 * - Administrador: Acesso total
 * - Servidor: Acesso intermediário
 * - Cidadão: Acesso limitado
 */
class UserPolicy
{
    /**
     * Determina se o usuário pode visualizar qualquer usuário
     * 
     * Regras:
     * - Administrador: Pode ver todos os usuários
     * - Servidor: Pode ver todos os usuários
     * - Cidadão: Não pode ver lista de usuários
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            Role::ADMINISTRADOR,
            Role::SERVIDOR,
        ]);
    }

    /**
     * Determina se o usuário pode visualizar um usuário específico
     * 
     * Regras:
     * - Administrador: Pode ver qualquer usuário
     * - Servidor: Pode ver qualquer usuário
     * - Cidadão: Pode ver apenas seu próprio perfil
     *
     * @param User $user
     * @param User $model
     * @return bool
     */
    public function view(User $user, User $model): bool
    {
        // Administrador e Servidor podem ver qualquer usuário
        if ($user->hasAnyRole([Role::ADMINISTRADOR, Role::SERVIDOR])) {
            return true;
        }

        // Cidadão pode ver apenas seu próprio perfil
        return $user->id === $model->id;
    }

    /**
     * Determina se o usuário pode criar novos usuários
     * 
     * Regras:
     * - Administrador: Pode criar usuários
     * - Servidor: Não pode criar usuários
     * - Cidadão: Não pode criar usuários
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->isAdministrador();
    }

    /**
     * Determina se o usuário pode atualizar um usuário
     * 
     * Regras:
     * - Administrador: Pode atualizar qualquer usuário
     * - Servidor: Pode atualizar apenas seu próprio perfil
     * - Cidadão: Pode atualizar apenas seu próprio perfil
     *
     * @param User $user
     * @param User $model
     * @return bool
     */
    public function update(User $user, User $model): bool
    {
        // Administrador pode atualizar qualquer usuário
        if ($user->isAdministrador()) {
            return true;
        }

        // Outros papéis podem atualizar apenas seu próprio perfil
        return $user->id === $model->id;
    }

    /**
     * Determina se o usuário pode excluir um usuário
     * 
     * Regras:
     * - Administrador: Pode excluir qualquer usuário (exceto si mesmo)
     * - Servidor: Não pode excluir usuários
     * - Cidadão: Não pode excluir usuários
     *
     * @param User $user
     * @param User $model
     * @return bool
     */
    public function delete(User $user, User $model): bool
    {
        // Apenas administrador pode excluir
        if (!$user->isAdministrador()) {
            return false;
        }

        // Administrador não pode excluir a si mesmo
        return $user->id !== $model->id;
    }

    /**
     * Determina se o usuário pode restaurar um usuário
     * 
     * Regras:
     * - Apenas administradores podem restaurar usuários
     *
     * @param User $user
     * @param User $model
     * @return bool
     */
    public function restore(User $user, User $model): bool
    {
        return $user->isAdministrador();
    }

    /**
     * Determina se o usuário pode excluir permanentemente um usuário
     * 
     * Regras:
     * - Apenas administradores podem excluir permanentemente
     * - Não pode excluir a si mesmo
     *
     * @param User $user
     * @param User $model
     * @return bool
     */
    public function forceDelete(User $user, User $model): bool
    {
        return $user->isAdministrador() && $user->id !== $model->id;
    }

    /**
     * Determina se o usuário pode gerenciar papéis
     * 
     * Regras:
     * - Apenas administradores podem gerenciar papéis
     *
     * @param User $user
     * @return bool
     */
    public function manageRoles(User $user): bool
    {
        return $user->isAdministrador();
    }

    /**
     * Determina se o usuário pode atribuir papéis a outros usuários
     * 
     * Regras:
     * - Apenas administradores podem atribuir papéis
     *
     * @param User $user
     * @return bool
     */
    public function assignRole(User $user): bool
    {
        return $user->isAdministrador();
    }
}
