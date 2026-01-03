# Arquitetura da Camada de Serviço

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (SPA)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐ │
│  │   Login    │  │   Texts    │  │  My Account│  │  Contact  │ │
│  │   Page     │  │   Page     │  │    Page    │  │   Page    │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬─────┘ │
│        │               │               │               │        │
│        └───────────────┴───────────────┴───────────────┘        │
│                              │                                   │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │           SERVICE LAYER (Domain Services)                │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  AuthService  │  TextService  │  UserService  │  etc...  │   │
│  └───────────────┬──────────────────────────────────────────┘   │
│                  │                                               │
│  ┌───────────────▼──────────────────────────────────────────┐   │
│  │              HTTP SERVICE (Generic API Client)           │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • ApiService (Singleton)                                │   │
│  │  • HTTP Methods: GET, POST, PUT, PATCH, DELETE          │   │
│  │  • Cache Management                                      │   │
│  │  • Retry Logic                                          │   │
│  │  • Error Handling                                       │   │
│  └───────────────┬──────────────────────────────────────────┘   │
│                  │                                               │
│  ┌───────────────▼──────────────────────────────────────────┐   │
│  │              INTERCEPTORS (Middleware)                   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Loading State                                        │   │
│  │  • Request/Response Logging                             │   │
│  │  • Global Error Handling                                │   │
│  │  • Token Injection                                      │   │
│  └───────────────┬──────────────────────────────────────────┘   │
│                  │                                               │
│  ┌───────────────▼──────────────────────────────────────────┐   │
│  │              CONFIGURATION (ApiConfig)                   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Base URL                                             │   │
│  │  • Endpoints Map                                        │   │
│  │  • Timeout & Retry Settings                            │   │
│  │  • Error Messages                                       │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                         BACKEND API                              │
├──────────────────────────────────────────────────────────────────┤
│  /api/auth/*          Authentication endpoints                   │
│  /api/texts/*         Texts CRUD operations                      │
│  /api/users/*         User management                            │
│  /api/concepts/*      Concepts & maps                            │
│  /api/contact         Contact form                               │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de uma Requisição

```
1. USER ACTION (Click, Submit, etc.)
   │
   ▼
2. PAGE COMPONENT calls DOMAIN SERVICE
   │  Example: await TextService.list(filters)
   ▼
3. DOMAIN SERVICE calls API SERVICE
   │  Example: this.api.get('/texts?search=...')
   ▼
4. INTERCEPTORS - Request Phase
   │  • Show loading spinner
   │  • Log request (dev mode)
   │  • Inject auth token
   ▼
5. API SERVICE processes request
   │  • Check cache
   │  • Build URL & headers
   │  • Set timeout
   ▼
6. FETCH API sends HTTP request
   │
   ▼
7. BACKEND processes request
   │
   ▼
8. HTTP RESPONSE received
   │
   ▼
9. API SERVICE handles response
   │  • Parse JSON
   │  • Save to cache
   │  • Retry if needed
   ▼
10. INTERCEPTORS - Response Phase
    │  • Hide loading spinner
    │  • Log response (dev mode)
    ▼
11. DOMAIN SERVICE returns data
    │
    ▼
12. PAGE COMPONENT receives data
    │
    ▼
13. UI UPDATED with new data

ERROR PATH:
   ├─ API SERVICE catches error
   ├─ Handles specific status codes (401, 404, 500, etc.)
   ├─ INTERCEPTORS show error notification
   └─ PAGE COMPONENT receives error message
```

## 🎯 Responsabilidades de Cada Camada

### 1. **Configuration Layer** (`api.config.js`)
- ✅ Centraliza todas as URLs e endpoints
- ✅ Define timeouts, retry policies
- ✅ Mantém mensagens de erro padronizadas
- ✅ Configurações de cache

### 2. **HTTP Service Layer** (`api.service.js`)
- ✅ Implementa métodos HTTP genéricos
- ✅ Gerencia cache inteligente
- ✅ Implementa retry automático
- ✅ Injeta tokens de autenticação
- ✅ Trata erros HTTP
- ✅ Suporta upload de arquivos

### 3. **Domain Services Layer**
- `auth.service.js` - Login, registro, logout, validação de token
- `text.service.js` - CRUD de textos, filtros, avaliação
- `user.service.js` - Perfil do usuário, atualização
- `question.service.js` - Dúvidas/comentários em textos
- `concept.service.js` - Conceitos e mapa conceitual
- `contact.service.js` - Envio de mensagens

**Responsabilidades:**
- ✅ Expõem API específica do domínio
- ✅ Validam dados antes de enviar
- ✅ Transformam dados se necessário
- ✅ Gerenciam estado local (localStorage)

### 4. **Interceptors Layer** (`interceptors.js`)
- ✅ Mostra/esconde loading global
- ✅ Loga requisições em dev mode
- ✅ Exibe notificações de erro
- ✅ Permite hooks customizados

### 5. **Page Components**
- ✅ Capturam eventos do usuário
- ✅ Chamam domain services
- ✅ Renderizam dados na UI
- ✅ Exibem feedback visual

## 🔐 Fluxo de Autenticação

```
LOGIN FLOW:
┌──────────┐       ┌──────────────┐       ┌──────────┐       ┌─────────┐
│  Login   │──1──▶ │ AuthService  │──2──▶ │   API    │──3──▶ │ Backend │
│   Page   │       │   .login()   │       │ Service  │       │         │
└────┬─────┘       └──────────────┘       └──────────┘       └────┬────┘
     │                                                              │
     │             ┌──────────────────────────────────────────────┘
     │             │
     │◀────5───────┤ Response: { token, user }
     │             │
     ▼             ▼
┌────────────────────────────────┐
│  localStorage                   │
│  • authToken = "jwt..."        │
│  • loggedIn = "true"           │
│  • username = "user123"        │
│  • userData = {...}            │
└────────────────────────────────┘

AUTHENTICATED REQUEST:
┌──────────┐       ┌──────────────┐       ┌──────────┐
│   Any    │──1──▶ │ Any Domain   │──2──▶ │   API    │
│   Page   │       │   Service    │       │ Service  │
└──────────┘       └──────────────┘       └────┬─────┘
                                                │
                   ┌────────────────────────────┘
                   │
                   ▼
           Get token from localStorage
                   │
                   ▼
           Add header: "Authorization: Bearer {token}"
                   │
                   ▼
           Send request to Backend

401 UNAUTHORIZED (Token expired/invalid):
┌──────────┐       ┌──────────────┐       ┌──────────┐
│ Backend  │──1──▶ │ API Service  │──2──▶ │ Clear    │
│ returns  │       │ detects 401  │       │ Session  │
│   401    │       └──────────────┘       └────┬─────┘
└──────────┘                                    │
                                                ▼
                                        Redirect to #login
```

## 📦 Estrutura de Arquivos

```
c:\Workspace\frontend\nhee-frontend\
├── index.html                          (Scripts carregados aqui)
├── resources/
│   ├── main.js                         (Router SPA)
│   ├── main.css
│   └── services/                       ⭐ NOVA CAMADA
│       ├── config/
│       │   └── api.config.js           (Configurações)
│       ├── api.service.js              (HTTP Client)
│       ├── interceptors.js             (Middleware)
│       ├── auth.service.js             (Autenticação)
│       ├── text.service.js             (Textos)
│       ├── question.service.js         (Dúvidas)
│       ├── user.service.js             (Usuários)
│       ├── concept.service.js          (Conceitos)
│       ├── contact.service.js          (Contato)
│       ├── README.md                   (Documentação)
│       └── examples/                   (Exemplos de uso)
│           ├── login.example.js
│           └── texts.example.js
└── features/
    ├── authentication/
    │   ├── login/
    │   │   └── login.js                (Usa AuthService)
    │   ├── register/
    │   │   └── register.js             (Usa AuthService)
    │   └── forgot-password/
    │       └── forgot-password.js      (Usa AuthService)
    └── pages/
        ├── texts/
        │   └── texts.js                (Usa TextService)
        ├── new-text/
        │   └── new-text.js             (Usa TextService)
        ├── my-account/
        │   └── my-account.js           (Usa UserService)
        └── contact/
            └── contact.js              (Usa ContactService)
```

## 🚀 Ordem de Carregamento dos Scripts

```html
<!-- 1. Bootstrap (biblioteca UI) -->
<script src="resources/bootstrap/bootstrap.bundle.min.js"></script>

<!-- 2. API Configuration (primeiro!) -->
<script src="resources/services/config/api.config.js"></script>

<!-- 3. Core API Service -->
<script src="resources/services/api.service.js"></script>

<!-- 4. Interceptors -->
<script src="resources/services/interceptors.js"></script>

<!-- 5. Domain Services (ordem não importa) -->
<script src="resources/services/auth.service.js"></script>
<script src="resources/services/text.service.js"></script>
<script src="resources/services/question.service.js"></script>
<script src="resources/services/user.service.js"></script>
<script src="resources/services/concept.service.js"></script>
<script src="resources/services/contact.service.js"></script>

<!-- 6. SPA Router (usa os services) -->
<script src="resources/main.js"></script>

<!-- 7. Page-specific scripts (carregados dinamicamente) -->
```

---

Essa arquitetura garante **separação de responsabilidades**, **reutilização de código**, **manutenibilidade** e **facilidade de testes**.
