# 📱 InfoGov Mobile

Sistema de Informações Governamentais - Aplicativo Mobile

---

## 🎯 Sobre o Projeto

Aplicativo React Native (Android/iOS) desenvolvido com Expo e TypeScript que consome a API Laravel do backend InfoGov.

### Stack Tecnológica

- **React Native** com Expo
- **TypeScript** - Tipagem forte
- **React Navigation** - Navegação (Stack + Bottom Tabs)
- **Axios** - Cliente HTTP
- **AsyncStorage** - Persistência local
- **Context API** - Gerenciamento de estado
- **Expo Vector Icons** - Ícones

---

## 📂 Estrutura do Projeto

```
src/
├── api/                    # Configuração da API e serviços
│   ├── client.ts          # Axios client com interceptors
│   ├── auth.service.ts    # Serviço de autenticação
│   └── department.service.ts # Serviço de departamentos
├── contexts/              # Context API
│   └── AuthContext.tsx    # Context de autenticação
├── navigation/            # Sistema de navegação
│   └── index.tsx         # Navegadores (Stack, Tabs)
├── screens/              # Telas da aplicação
│   ├── Auth/            
│   │   └── LoginScreen.tsx
│   ├── Home/
│   │   └── HomeScreen.tsx
│   ├── Departments/
│   │   └── DepartmentListScreen.tsx
│   ├── Profile/
│   │   └── ProfileScreen.tsx
│   └── Admin/
│       └── AdminScreen.tsx
├── components/           # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── LoadingOverlay.tsx
├── theme/               # Tema e estilos
│   └── index.ts        # Cores, espaçamentos, tipografia
├── types/              # Tipos TypeScript
│   └── index.ts       # Interfaces e tipos globais
└── utils/             # Funções utilitárias
    └── helpers.ts     # Formatação, validação, etc
```

---

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
cd mobile/infogov-mobile
npm install
```

### 2. Configurar URL da API

Edite `src/api/client.ts` e configure a URL correta:

```typescript
// Android Emulator
const API_URL = 'http://10.0.2.2:8000/api/v1';

// iOS Simulator
const API_URL = 'http://localhost:8000/api/v1';

// Dispositivo Físico (substitua pelo seu IP)
const API_URL = 'http://192.168.1.100:8000/api/v1';
```

### 3. Iniciar o Projeto

```bash
# Iniciar Expo
npm start

# Ou diretamente
npx expo start
```

### 4. Executar no Dispositivo

- **Android:** Pressione `a` no terminal
- **iOS:** Pressione `i` no terminal
- **Dispositivo Físico:** Escaneie o QR Code com o app Expo Go

---

## 🔐 Autenticação

O app utiliza **Laravel Sanctum** com **Bearer Tokens**:

1. Usuário faz login
2. Recebe token do backend
3. Token é salvo no AsyncStorage
4. Token é incluído automaticamente em todas as requisições
5. Logout invalida o token e limpa o storage

### Credenciais de Teste

```
Admin:
  Email: admin@test.com
  Senha: senha123

Servidor:
  Email: servidor@test.com
  Senha: senha123

Cidadão:
  Email: cidadao@test.com
  Senha: senha123
```

---

## 🎨 Telas Implementadas

### 1️⃣ **Login** (`Auth/LoginScreen`)
- ✅ Autenticação via email/senha
- ✅ Validação de campos
- ✅ Loading states
- ✅ Tratamento de erros

### 2️⃣ **Home** (`Home/HomeScreen`)
- ✅ Dashboard com boas-vindas
- ✅ Exibe papel do usuário (badge colorido)
- ✅ Estatísticas rápidas
- ✅ Acesso rápido a funcionalidades

### 3️⃣ **Departamentos** (`Departments/DepartmentListScreen`)
- ✅ Listagem com paginação
- ✅ Busca por nome
- ✅ Filtros (Todos, Ativos, Inativos)
- ✅ Pull to refresh
- ✅ Empty state
- ✅ Delete (apenas admin)

### 4️⃣ **Perfil** (`Profile/ProfileScreen`)
- ✅ Dados do usuário
- ✅ Informações do papel
- ✅ Configurações
- ✅ Logout

### 5️⃣ **Admin** (`Admin/AdminScreen`)
- ✅ Visível apenas para Administradores
- ✅ Painel de funcionalidades administrativas

---

## 🔒 Controle de Acesso (RBAC)

O app implementa controle de acesso baseado no papel do usuário:

| Tela/Funcionalidade | Administrador | Servidor | Cidadão |
|---------------------|---------------|----------|---------|
| **Home** | ✅ | ✅ | ✅ |
| **Departamentos (ver)** | ✅ | ✅ | ✅ |
| **Departamentos (deletar)** | ✅ | ❌ | ❌ |
| **Perfil** | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ❌ | ❌ |

### Implementação

```typescript
// No código
const isAdmin = user?.role?.name === 'administrador';

// Renderização condicional
{isAdmin && (
  <TouchableOpacity onPress={handleDelete}>
    <Ionicons name="trash" />
  </TouchableOpacity>
)}

// Navegação condicional (já implementada)
{isAdmin && (
  <MainTab.Screen name="Admin" component={AdminScreen} />
)}
```

---

## 📡 Integração com API

### Endpoints Consumidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/register` | Registro |
| GET | `/api/v1/auth/me` | Usuário autenticado |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/departments` | Listar departamentos |
| POST | `/api/v1/departments` | Criar departamento |
| PUT | `/api/v1/departments/{id}` | Atualizar departamento |
| DELETE | `/api/v1/departments/{id}` | Deletar departamento |

### Exemplo de Chamada

```typescript
import departmentService from './api/department.service';

// Listar com filtros
const response = await departmentService.list({
  page: 1,
  per_page: 20,
  name: 'TI',
  active: 'true',
  sort_by: 'name',
  sort_direction: 'asc',
});

console.log(response.data); // Array de departamentos
console.log(response.meta); // Metadados de paginação
```

---

## 🎨 Tema e Design

### Cores

- **Primária:** Azul Institucional (#1E3A8A)
- **Secundária:** Verde (#059669)
- **Erro:** Vermelho (#EF4444)
- **Sucesso:** Verde (#10B981)

### Papéis

- **Administrador:** Vermelho (#DC2626)
- **Servidor:** Azul (#2563EB)
- **Cidadão:** Verde (#059669)

---

## 🧪 Desenvolvimento

### Comandos Úteis

```bash
# Iniciar dev server
npm start

# Android
npm run android

# iOS
npm run ios

# Limpar cache
npx expo start -c

# Build
npx eas build --platform android
npx eas build --platform ios
```

### Debug

O app possui console.log estratégicos para debug. Monitore o terminal do Metro bundler.

---

## ✅ Funcionalidades Implementadas

- [x] Autenticação (Login)
- [x] Persistência de token
- [x] Logout
- [x] Navegação com Bottom Tabs
- [x] Tela Home com dashboard
- [x] Lista de departamentos
- [x] Busca e filtros
- [x] Pull to refresh
- [x] Controle de acesso (RBAC)
- [x] Menu Admin (apenas para admin)
- [x] Tela de perfil
- [x] Tratamento de erros
- [x] Loading states
- [x] Componentes reutilizáveis
- [x] Tema customizado
- [x] TypeScript completo

---

## 🚧 Próximas Melhorias

- [ ] Formulário de criação/edição de departamentos
- [ ] Dark mode
- [ ] Notificações push
- [ ] Cache local
- [ ] Modo offline
- [ ] Testes automatizados
- [ ] Animações
- [ ] Refresh token

---

## 📱 Compatibilidade

- **Android:** API 21+ (Android 5.0+)
- **iOS:** iOS 13+

---

## 🎉 Pronto para Usar!

O aplicativo está funcional e pronto para ser executado.

**Desenvolvido com ❤️ seguindo as melhores práticas do React Native**
