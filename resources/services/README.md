# Camada de Serviço - API Service Layer

## 📋 Visão Geral

Esta camada de serviço fornece uma abstração completa e robusta para consumo das APIs do backend do sistema Nhe'ẽ porã.

## 🏗️ Arquitetura

```
resources/services/
├── config/
│   └── api.config.js          # Configurações centralizadas
├── api.service.js             # Serviço HTTP genérico
├── auth.service.js            # Autenticação
├── text.service.js            # Textos científicos
├── question.service.js        # Dúvidas/Comentários
├── user.service.js            # Usuários e perfil
├── concept.service.js         # Conceitos e mapa
├── contact.service.js         # Contato
└── interceptors.js            # Middleware HTTP
```

## 🎯 Recursos

### ✅ Funcionalidades Implementadas

- **HTTP Client Genérico** com suporte a GET, POST, PUT, PATCH, DELETE
- **Cache inteligente** com expiração configurável
- **Retry automático** para requisições que falharam
- **Timeout configurável** para prevenir requisições travadas
- **Interceptors** para loading, logging e tratamento de erros
- **Auto-refresh de token** (401 redireciona para login)
- **Tratamento centralizado de erros** com mensagens amigáveis
- **Upload de arquivos** via FormData
- **Serviços especializados** por domínio da aplicação

### 🔐 Segurança

- Token JWT automaticamente incluído nos headers
- Limpeza automática de sessão em caso de autenticação inválida
- Headers seguros e configuráveis

## 📖 Como Usar

### 1. Incluir os Scripts no HTML Principal

Adicione no `index.html` **antes** de carregar os scripts das páginas:

```html
<!-- API Services -->
<script src="resources/services/config/api.config.js"></script>
<script src="resources/services/api.service.js"></script>
<script src="resources/services/interceptors.js"></script>
<script src="resources/services/auth.service.js"></script>
<script src="resources/services/text.service.js"></script>
<script src="resources/services/question.service.js"></script>
<script src="resources/services/user.service.js"></script>
<script src="resources/services/concept.service.js"></script>
<script src="resources/services/contact.service.js"></script>
```

### 2. Exemplos de Uso

#### Login

```javascript
// features/authentication/login/login.js
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const response = await AuthService.login({
            username: usernameInput.value.trim(),
            password: passwordInput.value
        });
        
        showAlert('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.hash = 'home';
        }, 1000);
        
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});
```

#### Listar Textos com Filtros

```javascript
// features/pages/texts/texts.js
async function loadTexts() {
    try {
        const filters = {
            search: document.getElementById('searchTexts').value,
            area: document.getElementById('filterArea').value,
            type: document.getElementById('filterType').value,
            concept: document.getElementById('filterConcepts').value,
            page: 1,
            limit: 20
        };
        
        const response = await TextService.list(filters);
        
        // Renderizar textos
        renderTexts(response.data);
        
    } catch (error) {
        console.error('Erro ao carregar textos:', error);
        showAlert(error.message, 'danger');
    }
}
```

#### Criar Novo Texto

```javascript
// features/pages/new-text/new-text.js
async function createText(textData) {
    try {
        const response = await TextService.create({
            title: textData.title,
            content: textData.content,
            area: textData.area,
            type: textData.type,
            concepts: textData.concepts,
            author: textData.author,
            institution: textData.institution,
            references: textData.references
        });
        
        showAlert('Texto criado com sucesso!', 'success');
        window.location.hash = `text-view?id=${response.id}`;
        
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}
```

#### Adicionar Dúvida em Texto

```javascript
// features/pages/add-question/add-question.js
async function addQuestion(textId, questionData) {
    try {
        const response = await QuestionService.create(textId, {
            title: questionData.title,
            content: questionData.content,
            type: questionData.type
        });
        
        showAlert('Dúvida adicionada com sucesso!', 'success');
        window.location.hash = `text-view?id=${textId}`;
        
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}
```

#### Atualizar Perfil

```javascript
// features/pages/my-account/my-account.js
async function updateProfile(userData) {
    try {
        const response = await UserService.updateProfile({
            name: userData.name,
            email: userData.email,
            institution: userData.institution,
            bio: userData.bio
        });
        
        showAlert('Perfil atualizado com sucesso!', 'success');
        
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}
```

#### Carregar Mapa Conceitual

```javascript
// features/pages/concept-map/concept-map.js
async function loadConceptMap() {
    try {
        const mapData = await ConceptService.getMap();
        
        // Renderizar mapa com D3.js ou outra biblioteca
        renderMap(mapData);
        
    } catch (error) {
        console.error('Erro ao carregar mapa:', error);
        showAlert(error.message, 'danger');
    }
}
```

#### Enviar Formulário de Contato

```javascript
// features/pages/contact/contact.js
async function sendContact(formData) {
    try {
        await ContactService.send({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
        });
        
        showAlert('Mensagem enviada com sucesso!', 'success');
        contactForm.reset();
        
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}
```

## ⚙️ Configuração

### Ajustar URL do Backend

Edite `resources/services/config/api.config.js`:

```javascript
const ApiConfig = {
    baseURL: 'https://api.nheepora.com/api',  // URL de produção
    // ... outras configurações
};
```

### Configurar Timeout

```javascript
const ApiConfig = {
    timeout: 60000,  // 60 segundos
    // ...
};
```

### Desabilitar Cache

```javascript
const ApiConfig = {
    cache: {
        enabled: false
    },
    // ...
};
```

### Configurar Retry

```javascript
const ApiConfig = {
    retry: {
        enabled: true,
        maxAttempts: 5,
        delay: 2000,
        statusCodes: [408, 429, 500, 502, 503, 504]
    }
};
```

## 🔧 Funcionalidades Avançadas

### Limpar Cache Manualmente

```javascript
// Limpar todo o cache
ApiService.clearCache();
```

### Requisição sem Cache

```javascript
const texts = await TextService.list({}, { skipCache: true });
```

### Headers Customizados

```javascript
await ApiService.post('/endpoint', data, {
    headers: {
        'X-Custom-Header': 'value'
    }
});
```

### Upload de Arquivo

```javascript
const file = document.getElementById('fileInput').files[0];

const response = await ApiService.upload(
    '/upload',
    file,
    'document',
    { description: 'Meu arquivo' }
);
```

### Adicionar Interceptor Customizado

```javascript
// Adicionar log customizado
HttpInterceptors.addRequestListener((url, options) => {
    console.log('Custom log:', url);
});

// Adicionar tratamento de erro customizado
HttpInterceptors.addErrorListener((error) => {
    // Enviar erro para analytics
    analytics.trackError(error);
});
```

## 🎨 Integração com UI

O sistema automaticamente:
- Mostra/esconde loading spinner durante requisições
- Exibe notificações de erro globais
- Gerencia redirecionamento em caso de sessão expirada

## 📝 Próximos Passos

1. Ajustar a `baseURL` no `api.config.js` para o endpoint real do backend
2. Substituir autenticação mock por chamadas reais usando `AuthService`
3. Integrar os serviços nas páginas existentes
4. Testar fluxos completos de CRUD
5. Adicionar tratamento específico de erros por página se necessário

## 🐛 Debug

Para ativar logs detalhados (apenas em localhost):

```javascript
// Já está configurado automaticamente em development
// Verifique o console do navegador
```

## 📚 Referências

- Todos os serviços são singletons acessíveis globalmente via `window`
- Endpoints configurados em `ApiConfig.endpoints`
- Mensagens de erro em `ApiConfig.errorMessages`

---

**Sistema Nhe'ẽ porã** - Palavras Verdadeiras
