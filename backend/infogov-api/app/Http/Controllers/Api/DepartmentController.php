<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Controller para gerenciamento de Departamentos
 * 
 * CRUD completo com:
 * - Listagem com paginação
 * - Filtros por nome e status
 * - Ordenação customizável
 * - Soft deletes
 * - Controle de acesso via Policy
 */
class DepartmentController extends Controller
{
    /**
     * Lista todos os departamentos com paginação e filtros
     * 
     * Query Parameters:
     * - page: Número da página (padrão: 1)
     * - per_page: Itens por página (padrão: 15, máx: 100)
     * - name: Filtro por nome (busca parcial)
     * - code: Filtro por código (busca parcial)
     * - active: Filtro por status (true/false/all)
     * - sort_by: Campo para ordenação (name, code, created_at)
     * - sort_direction: Direção da ordenação (asc, desc)
     * - with_trashed: Incluir registros excluídos (true/false)
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // Verifica permissão via Policy
        $this->authorize('viewAny', Department::class);

        // Query base
        $query = Department::query();

        // Filtro por nome
        if ($request->filled('name')) {
            $query->filterByName($request->name);
        }

        // Filtro por código
        if ($request->filled('code')) {
            $query->filterByCode($request->code);
        }

        // Filtro por status ativo
        if ($request->filled('active')) {
            if ($request->active === 'true' || $request->active === '1') {
                $query->active();
            } elseif ($request->active === 'false' || $request->active === '0') {
                $query->inactive();
            }
            // Se 'all', não aplica filtro
        }

        // Incluir registros excluídos (soft deletes)
        if ($request->boolean('with_trashed')) {
            $query->withTrashed();
        }

        // Ordenação
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        
        // Valida coluna de ordenação
        $allowedSortFields = ['name', 'code', 'active', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'name';
        }

        // Valida direção
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderByColumn($sortBy, $sortDirection);

        // Paginação
        $perPage = min($request->input('per_page', 15), 100);
        $departments = $query->paginate($perPage);

        return DepartmentResource::collection($departments);
    }

    /**
     * Cria um novo departamento
     * 
     * Apenas Administradores podem criar departamentos
     *
     * @param StoreDepartmentRequest $request
     * @return JsonResponse
     */
    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        // Verifica permissão via Policy
        $this->authorize('create', Department::class);

        // Cria o departamento
        $department = Department::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Departamento criado com sucesso',
            'data' => new DepartmentResource($department),
        ], 201);
    }

    /**
     * Exibe um departamento específico
     *
     * @param Department $department
     * @return JsonResponse
     */
    public function show(Department $department): JsonResponse
    {
        // Verifica permissão via Policy
        $this->authorize('view', $department);

        return response()->json([
            'success' => true,
            'data' => new DepartmentResource($department),
        ], 200);
    }

    /**
     * Atualiza um departamento existente
     * 
     * Apenas Administradores podem atualizar departamentos
     *
     * @param UpdateDepartmentRequest $request
     * @param Department $department
     * @return JsonResponse
     */
    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        // Verifica permissão via Policy
        $this->authorize('update', $department);

        // Atualiza o departamento
        $department->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Departamento atualizado com sucesso',
            'data' => new DepartmentResource($department->fresh()),
        ], 200);
    }

    /**
     * Remove um departamento (soft delete)
     * 
     * Apenas Administradores podem excluir departamentos
     *
     * @param Department $department
     * @return JsonResponse
     */
    public function destroy(Department $department): JsonResponse
    {
        // Verifica permissão via Policy
        $this->authorize('delete', $department);

        // Soft delete
        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Departamento excluído com sucesso',
        ], 200);
    }

    /**
     * Restaura um departamento excluído
     * 
     * Apenas Administradores podem restaurar departamentos
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(int $id): JsonResponse
    {
        $department = Department::withTrashed()->findOrFail($id);

        // Verifica permissão via Policy
        $this->authorize('restore', $department);

        // Restaura o departamento
        $department->restore();

        return response()->json([
            'success' => true,
            'message' => 'Departamento restaurado com sucesso',
            'data' => new DepartmentResource($department->fresh()),
        ], 200);
    }

    /**
     * Exclui permanentemente um departamento
     * 
     * Apenas Administradores podem excluir permanentemente
     * ATENÇÃO: Esta ação não pode ser desfeita!
     *
     * @param int $id
     * @return JsonResponse
     */
    public function forceDestroy(int $id): JsonResponse
    {
        $department = Department::withTrashed()->findOrFail($id);

        // Verifica permissão via Policy
        $this->authorize('forceDelete', $department);

        // Exclui permanentemente
        $department->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Departamento excluído permanentemente',
        ], 200);
    }
}
