/**
 * Serviço de Departamentos
 * 
 * Gerencia todas as operações CRUD de departamentos
 */

import api from './client';
import {
  Department,
  DepartmentFormData,
  DepartmentListParams,
  ApiResponse,
  PaginatedResponse,
} from '../types';

class DepartmentService {
  private readonly BASE_PATH = '/departments';

  /**
   * Lista departamentos com paginação e filtros
   */
  async list(params: DepartmentListParams = {}): Promise<PaginatedResponse<Department>> {
    const { data } = await api.get<PaginatedResponse<Department>>(this.BASE_PATH, {
      params,
    });

    return data;
  }

  /**
   * Obtém um departamento específico
   */
  async getById(id: number): Promise<Department> {
    const { data } = await api.get<ApiResponse<Department>>(`${this.BASE_PATH}/${id}`);

    if (!data.success || !data.data) {
      throw new Error('Departamento não encontrado');
    }

    return data.data;
  }

  /**
   * Cria um novo departamento
   */
  async create(departmentData: DepartmentFormData): Promise<Department> {
    const { data } = await api.post<ApiResponse<Department>>(
      this.BASE_PATH,
      departmentData
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Erro ao criar departamento');
    }

    return data.data;
  }

  /**
   * Atualiza um departamento existente
   */
  async update(id: number, departmentData: Partial<DepartmentFormData>): Promise<Department> {
    const { data } = await api.put<ApiResponse<Department>>(
      `${this.BASE_PATH}/${id}`,
      departmentData
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Erro ao atualizar departamento');
    }

    return data.data;
  }

  /**
   * Exclui um departamento (soft delete)
   */
  async delete(id: number): Promise<void> {
    const { data } = await api.delete<ApiResponse>(`${this.BASE_PATH}/${id}`);

    if (!data.success) {
      throw new Error(data.message || 'Erro ao excluir departamento');
    }
  }

  /**
   * Restaura um departamento excluído
   */
  async restore(id: number): Promise<Department> {
    const { data } = await api.post<ApiResponse<Department>>(
      `${this.BASE_PATH}/${id}/restore`
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Erro ao restaurar departamento');
    }

    return data.data;
  }

  /**
   * Exclui permanentemente um departamento
   */
  async forceDelete(id: number): Promise<void> {
    const { data } = await api.delete<ApiResponse>(
      `${this.BASE_PATH}/${id}/force`
    );

    if (!data.success) {
      throw new Error(data.message || 'Erro ao excluir permanentemente');
    }
  }
}

export default new DepartmentService();
