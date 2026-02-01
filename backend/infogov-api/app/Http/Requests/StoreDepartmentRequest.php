<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Form Request para criação de departamento
 * 
 * Valida os campos necessários para criar um novo departamento
 */
class StoreDepartmentRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição
     * A autorização real é feita via Policy
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação para criar departamento
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'min:3'],
            'code' => ['required', 'string', 'max:20', 'min:2', 'unique:departments,code', 'alpha_dash'],
            'active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Mensagens de erro personalizadas
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O campo nome é obrigatório.',
            'name.string' => 'O nome deve ser um texto válido.',
            'name.max' => 'O nome não pode ter mais de 255 caracteres.',
            'name.min' => 'O nome deve ter no mínimo 3 caracteres.',
            
            'code.required' => 'O campo código é obrigatório.',
            'code.string' => 'O código deve ser um texto válido.',
            'code.max' => 'O código não pode ter mais de 20 caracteres.',
            'code.min' => 'O código deve ter no mínimo 2 caracteres.',
            'code.unique' => 'Este código já está cadastrado.',
            'code.alpha_dash' => 'O código pode conter apenas letras, números, hífens e sublinhados.',
            
            'active.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
        ];
    }

    /**
     * Prepara os dados antes da validação
     * Converte o código para maiúsculas
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('code')) {
            $this->merge([
                'code' => strtoupper($this->code),
            ]);
        }
    }

    /**
     * Tratamento de falha na validação
     * Retorna JSON ao invés de redirecionar
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
