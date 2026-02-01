# 🏛️ InfoGov

**Sistema completo de Informações Governamentais** com Backend em Laravel e Mobile em React Native.

---

## 📁 Estrutura do Projeto

```
InfoGov/
├── backend/
│   └── infogov-api/              # API RESTful em Laravel + PHP
├── mobile/
│   └── infogov-mobile/           # App móvel em React Native + Expo
├── package.json                  # Workspace root
└── README.md                      # Este arquivo
```

---

## 🚀 Início Rápido

### Opção 1: Instalar Tudo de Uma Vez
```bash
npm run install:all
```

### Opção 2: Instalar Separadamente

**Backend (Laravel):**
```bash
cd backend/infogov-api
composer install
cp .env.example .env
php artisan key:generate

# Configurar .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=infogov
# DB_USERNAME=postgres
# DB_PASSWORD=sua_senha

php artisan migrate:fresh --seed
php artisan serve
```

**Mobile (React Native):**
```bash
cd mobile/infogov-mobile
npm install
npm start
```

---

## 📚 Documentação

### Backend
- [API Documentation](./backend/infogov-api/API_DOCUMENTATION.md)
- [Auth Guide](./backend/infogov-api/README_AUTH.md)
- [RBAC Guide](./backend/infogov-api/README_RBAC.md)
- [Departments Guide](./backend/infogov-api/README_DEPARTMENTS.md)

### Mobile
- [Quick Start](./mobile/infogov-mobile/QUICK_START.md)
- [README](./mobile/infogov-mobile/README.md)

---

## 🛠️ Scripts Disponíveis

### Root (Monorepo)
```bash
npm run install:all    # Instala todas as dependências
npm run lint           # Lint do código mobile
npm run type-check     # Type checking do TypeScript
```

### Mobile
```bash
cd mobile/infogov-mobile
npm start              # Inicia Expo
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run web            # Web version
npm run lint           # Verifica código
npm run type-check     # Verifica tipos
```

### Backend
```bash
cd backend/infogov-api
php artisan serve      # Inicia servidor
php artisan migrate    # Executa migrations
php artisan seed       # Popula banco
```

---

## 🔧 Stack Tecnológico

### Backend
- **Framework:** Laravel 11
- **Database:** PostgreSQL
- **API:** RESTful com autenticação Sanctum
- **Auth:** JWT Tokens + Roles & Permissions (RBAC)

### Mobile
- **Framework:** React Native
- **Runtime:** Expo
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Navigation:** React Navigation
- **UI:** React Native Paper

---

## 📖 Guias Úteis

- [Diagnóstico de Login](./DIAGNOSTICO_LOGIN.md)
- [Token & Axios](./GUIA_TOKEN_AXIOS.md)
- [Debug Login](./README_DEBUG_LOGIN.md)

---

## 📝 License

MIT

---

**Made with ❤️ by InfoGov Team**
