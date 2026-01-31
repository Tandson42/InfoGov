# 🏛️ InfoGov - Sistema de Informações Governamentais

Sistema completo com Backend Laravel + API RESTful e Mobile React Native.

---

## 🚀 Início Rápido (5 minutos)

### 1️⃣ Backend (Laravel API)

```bash
# Entrar na pasta
cd backend/infogov-api

# Instalar dependências
composer install

# Configurar ambiente
cp .env.example .env
php artisan key:generate

# Configurar banco no .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=infogov
DB_USERNAME=postgres
DB_PASSWORD=sua_senha

# Criar banco e popular
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve
```

**Pronto!** API rodando em `http://localhost:8000`

---

### 2️⃣ Mobile (React Native)

```bash
# Entrar na pasta
cd mobile/infogov-mobile

# Instalar dependências
npm install

# IMPORTANTE: Configurar URL da API
# Edite: src/api/client.ts
# - Android Emulator: http://10.0.2.2:8000/api/v1
# - iOS Simulator: http://localhost:8000/api/v1
# - Dispositivo Real: http://SEU_IP:8000/api/v1

# Iniciar app
npm start
```

Depois:
- Pressione **`a`** para Android
- Pressione **`i`** para iOS
- Ou escaneie o **QR Code** no Expo Go

**Pronto!** App rodando no emulador/dispositivo

---

## 🔑 Credenciais de Teste

### Administrador
```
Email: admin@test.com
Senha: senha123
```

### Servidor
```
Email: servidor@test.com
Senha: senha123
```

### Cidadão
```
Email: cidadao@test.com
Senha: senha123
```

---

## 📱 Funcionalidades

### Backend (Laravel)
- ✅ API RESTful versionada (`/api/v1`)
- ✅ Autenticação com Laravel Sanctum (Bearer Token)
- ✅ RBAC (3 papéis: Administrador, Servidor, Cidadão)
- ✅ CRUD completo de Departamentos
- ✅ Soft deletes
- ✅ Filtros, busca e paginação
- ✅ Policies e Middlewares
- ✅ Respostas JSON padronizadas
- ✅ CORS configurado para mobile

### Mobile (React Native)
- ✅ Login/Logout
- ✅ Dashboard personalizado
- ✅ Lista de departamentos com busca e filtros
- ✅ Perfil do usuário
- ✅ Painel admin (apenas para administradores)
- ✅ Controle de acesso por papel (RBAC)
- ✅ Pull to refresh
- ✅ Design moderno e profissional

---

## 📂 Estrutura do Projeto

```
.
├── backend/
│   └── infogov-api/          # Backend Laravel
│       ├── app/
│       ├── database/
│       ├── routes/
│       └── README_*.md       # Documentação detalhada
│
└── mobile/
    └── infogov-mobile/       # App React Native
        ├── src/
        ├── App.tsx
        └── README.md         # Documentação detalhada
```

---

## 🔧 Requisitos

### Backend
- PHP 8.2+
- Composer
- PostgreSQL 12+
- Extensões: PDO, Mbstring, OpenSSL

### Mobile
- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (Android) ou Xcode (iOS)

---

## 📡 Endpoints Principais

### Autenticação
```
POST   /api/v1/auth/login       # Login
POST   /api/v1/auth/register    # Registro
GET    /api/v1/auth/me          # Usuário autenticado
POST   /api/v1/auth/logout      # Logout
```

### Departamentos
```
GET    /api/v1/departments           # Listar
POST   /api/v1/departments           # Criar (admin)
GET    /api/v1/departments/{id}      # Ver detalhes
PUT    /api/v1/departments/{id}      # Atualizar (admin)
DELETE /api/v1/departments/{id}      # Deletar (admin)
```

---

## 🐛 Solução de Problemas

### Backend não inicia
```bash
# Verificar dependências
composer install

# Limpar cache
php artisan config:clear
php artisan cache:clear

# Verificar porta
php artisan serve --port=8001
```

### Mobile não conecta na API

**Problema:** Network Error

**Solução:**
1. Verifique se backend está rodando
2. Configure URL correta em `mobile/infogov-mobile/src/api/client.ts`
3. **Android Emulator:** Use `10.0.2.2` ao invés de `localhost`
4. **Dispositivo Real:** Use IP da sua máquina (ex: `192.168.1.100`)

Para encontrar seu IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

---

## 📚 Documentação Completa

### Backend
- `backend/infogov-api/README_AUTH.md` - Sistema de autenticação
- `backend/infogov-api/README_RBAC.md` - Controle de acesso
- `backend/infogov-api/README_DEPARTMENTS.md` - CRUD de departamentos
- `backend/infogov-api/README_FRONTEND_INTEGRATION.md` - Integração com frontend
- `backend/infogov-api/FRONTEND_EXAMPLES.md` - Exemplos de código

### Mobile
- `mobile/infogov-mobile/README.md` - Documentação completa
- `mobile/infogov-mobile/QUICK_START.md` - Guia rápido

---

## 🎯 Próximos Passos

Após subir o projeto:

1. **Explore o Backend**
   - Acesse `http://localhost:8000`
   - Teste endpoints com Postman/Insomnia
   - Consulte documentação em `backend/infogov-api/`

2. **Explore o Mobile**
   - Faça login com as credenciais
   - Navegue pelas telas
   - Teste funcionalidades por papel

3. **Customize**
   - Altere cores em `mobile/infogov-mobile/src/theme/`
   - Adicione novos CRUDs no backend
   - Crie novas telas no mobile

---

## ✅ Checklist de Configuração

Backend:
- [ ] Dependências instaladas (`composer install`)
- [ ] .env configurado
- [ ] Banco criado e populado (`migrate:fresh --seed`)
- [ ] Servidor rodando (`php artisan serve`)

Mobile:
- [ ] Dependências instaladas (`npm install`)
- [ ] URL da API configurada em `src/api/client.ts`
- [ ] App iniciado (`npm start`)
- [ ] Login funcionando com credenciais de teste

---

## 🎉 Pronto!

O projeto está configurado e rodando.

**Backend:** http://localhost:8000  
**Mobile:** Emulador/Dispositivo

---

## 📞 Suporte

Problemas ou dúvidas:
1. Consulte a documentação específica em cada subprojeto
2. Verifique os logs de erro
3. Certifique-se que todas as dependências estão instaladas

---

**Desenvolvido com ❤️ - Sistema InfoGov v1.0.0**
