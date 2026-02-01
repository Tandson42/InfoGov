# 🚀 Guia de Início Rápido - InfoGov Mobile

## ⚡ Configuração em 5 Minutos

### 1️⃣ Instalar Dependências

```bash
cd mobile/infogov-mobile
npm install
```

### 2️⃣ Configurar URL da API

Edite `src/api/client.ts`:

```typescript
// Para Android Emulator
const API_URL = 'http://10.0.2.2:8000/api/v1';

// Para iOS Simulator  
const API_URL = 'http://localhost:8000/api/v1';

// Para Dispositivo Físico (encontre seu IP com ipconfig/ifconfig)
const API_URL = 'http://SEU_IP:8000/api/v1';
```

### 3️⃣ Iniciar Backend Laravel

```bash
cd backend/infogov-api
php artisan serve
```

### 4️⃣ Iniciar App React Native

```bash
cd mobile/infogov-mobile
npm start
```

Depois pressione:
- `a` para Android
- `i` para iOS
- Ou escaneie o QR Code no Expo Go

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

## 📱 Funcionalidades por Papel

### 👤 Todos os Usuários
- ✅ Ver Home/Dashboard
- ✅ Ver lista de departamentos
- ✅ Buscar e filtrar departamentos
- ✅ Ver perfil
- ✅ Logout

### 👨‍💼 Servidor
- ✅ Tudo do Cidadão
- ✅ (Futuro) Gerenciar processos

### 👑 Administrador
- ✅ Tudo do Servidor
- ✅ Deletar departamentos
- ✅ Acessar painel admin
- ✅ (Futuro) Criar/editar departamentos
- ✅ (Futuro) Gerenciar usuários

---

## 🎯 Testando o App

### 1. Login
1. Abra o app
2. Use uma das credenciais acima
3. Clique em "Entrar"

### 2. Navegação
- **Home:** Visualize dashboard e estatísticas
- **Departamentos:** Lista com busca e filtros
- **Perfil:** Veja suas informações
- **Admin:** (Apenas para admin) Funcionalidades administrativas

### 3. CRUD de Departamentos
1. Vá em "Departamentos"
2. Use a busca para filtrar
3. Selecione filtros (Todos/Ativos/Inativos)
4. Pull to refresh para recarregar
5. (Admin) Clique no ícone de lixeira para deletar

---

## 🔧 Solução de Problemas

### Erro de Conexão com API

**Problema:** "Network Error" ou "Request failed"

**Solução:**
1. Verifique se o backend está rodando (`php artisan serve`)
2. Confirme a URL correta em `src/api/client.ts`
3. Android Emulator: use `10.0.2.2` ao invés de `localhost`
4. Dispositivo físico: use IP da sua máquina

### Token Expirado

**Problema:** Usuário é deslogado automaticamente

**Solução:**
- Isso é esperado quando o token expira ou é inválido
- Faça login novamente
- Configure `SANCTUM_EXPIRATION` no backend se necessário

### Erro ao Instalar Dependências

**Problema:** Erro ao rodar `npm install`

**Solução:**
```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules
rm -rf node_modules

# Reinstalar
npm install
```

---

## 📊 Estrutura de Pastas

```
mobile/infogov-mobile/
├── App.tsx                 # ← Entry point
├── src/
│   ├── api/               # ← Cliente API e serviços
│   ├── screens/           # ← Telas do app
│   ├── components/        # ← Componentes reutilizáveis
│   ├── navigation/        # ← Sistema de navegação
│   ├── contexts/          # ← Context API (Auth)
│   ├── theme/            # ← Cores e estilos
│   ├── types/            # ← TypeScript types
│   └── utils/            # ← Helpers
└── package.json
```

---

## 🎨 Customização

### Mudar Cores do Tema

Edite `src/theme/index.ts`:

```typescript
export const colors = {
  primary: {
    main: '#1E3A8A',  // ← Sua cor primária
    light: '#3B82F6',
    dark: '#1E40AF',
  },
  // ...
};
```

### Adicionar Nova Tela

1. Crie o arquivo em `src/screens/MinhaTelaScreen.tsx`
2. Adicione rota em `src/navigation/index.tsx`
3. (Opcional) Adicione tipo em `src/types/index.ts`

---

## 🚀 Build para Produção

### Android

```bash
# Build APK
npx eas build --platform android

# Build AAB (Google Play)
npx eas build --platform android --profile production
```

### iOS

```bash
# Build
npx eas build --platform ios

# TestFlight
npx eas submit --platform ios
```

---

## 📚 Documentação Adicional

- **README.md** - Documentação completa
- **Backend:** `backend/infogov-api/README_FRONTEND_INTEGRATION.md`
- **Backend:** `backend/infogov-api/FRONTEND_EXAMPLES.md`

---

## 🎉 Pronto!

O app está configurado e rodando. Explore as funcionalidades e customize conforme necessário.

**Dúvidas?** Consulte o README.md completo ou a documentação do backend.
