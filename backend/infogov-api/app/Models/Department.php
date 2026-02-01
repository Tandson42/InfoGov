<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * Model Department - Representa um departamento governamental
 * 
 * @property int $id
 * @property string $name
 * @property string $code
 * @property bool $active
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 */
class Department extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Atributos que podem ser atribuídos em massa
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'active',
    ];

    /**
     * Atributos que devem ser convertidos para tipos nativos
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Scope para filtrar departamentos ativos
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    /**
     * Scope para filtrar departamentos inativos
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('active', false);
    }

    /**
     * Scope para filtrar por nome
     *
     * @param Builder $query
     * @param string $name
     * @return Builder
     */
    public function scopeFilterByName(Builder $query, string $name): Builder
    {
        return $query->where('name', 'LIKE', "%{$name}%");
    }

    /**
     * Scope para filtrar por código
     *
     * @param Builder $query
     * @param string $code
     * @return Builder
     */
    public function scopeFilterByCode(Builder $query, string $code): Builder
    {
        return $query->where('code', 'LIKE', "%{$code}%");
    }

    /**
     * Scope para ordenação dinâmica
     *
     * @param Builder $query
     * @param string $column
     * @param string $direction
     * @return Builder
     */
    public function scopeOrderByColumn(Builder $query, string $column = 'name', string $direction = 'asc'): Builder
    {
        return $query->orderBy($column, $direction);
    }
}
