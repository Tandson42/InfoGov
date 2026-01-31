<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Model Role - Representa os papéis do sistema RBAC
 * 
 * Papéis disponíveis:
 * - Administrador: Acesso total ao sistema
 * - Servidor: Acesso a funcionalidades governamentais
 * - Cidadão: Acesso básico a serviços públicos
 * 
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Role extends Model
{
    use HasFactory;

    /**
     * Atributos que podem ser atribuídos em massa
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Constantes para os papéis do sistema
     * Facilita o uso e evita erros de digitação
     */
    public const ADMINISTRADOR = 'administrador';
    public const SERVIDOR = 'servidor';
    public const CIDADAO = 'cidadao';

    /**
     * Relacionamento: Um papel pode ter muitos usuários
     *
     * @return HasMany
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Verifica se o papel é Administrador
     *
     * @return bool
     */
    public function isAdministrador(): bool
    {
        return $this->name === self::ADMINISTRADOR;
    }

    /**
     * Verifica se o papel é Servidor
     *
     * @return bool
     */
    public function isServidor(): bool
    {
        return $this->name === self::SERVIDOR;
    }

    /**
     * Verifica se o papel é Cidadão
     *
     * @return bool
     */
    public function isCidadao(): bool
    {
        return $this->name === self::CIDADAO;
    }

    /**
     * Scope para buscar papel por nome
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $name
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByName($query, string $name)
    {
        return $query->where('name', $name);
    }
}
