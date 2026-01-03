/**
 * Configuração centralizada da API
 * Define URLs base, timeouts e outras configurações globais
 */

const ApiConfig = {
    // URL base do backend - Ajuste conforme seu ambiente
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api'  // Desenvolvimento
        : '/api',                       // Produção
    
    // Timeout padrão para requisições (em ms)
    timeout: 30000,
    
    // Headers padrão para todas as requisições
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Endpoints da API organizados por domínio
    endpoints: {
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
            forgotPassword: '/auth/forgot-password',
            resetPassword: '/auth/reset-password',
            validateToken: '/auth/validate-token'
        },
        texts: {
            list: '/texts',
            create: '/texts',
            get: (id) => `/texts/${id}`,
            update: (id) => `/texts/${id}`,
            delete: (id) => `/texts/${id}`,
            myTexts: '/texts/my-texts',
            evaluate: (id) => `/texts/${id}/evaluate`
        },
        questions: {
            list: (textId) => `/texts/${textId}/questions`,
            create: (textId) => `/texts/${textId}/questions`,
            get: (textId, questionId) => `/texts/${textId}/questions/${questionId}`,
            delete: (textId, questionId) => `/texts/${textId}/questions/${questionId}`
        },
        users: {
            profile: '/users/profile',
            update: '/users/profile',
            changePassword: '/users/change-password'
        },
        concepts: {
            list: '/concepts',
            map: '/concepts/map'
        },
        contact: {
            send: '/contact'
        }
    },
    
    // Códigos de status HTTP
    statusCodes: {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500
    },
    
    // Mensagens de erro padrão
    errorMessages: {
        network: 'Erro de conexão. Verifique sua internet.',
        timeout: 'A requisição demorou muito. Tente novamente.',
        unauthorized: 'Sessão expirada. Faça login novamente.',
        forbidden: 'Você não tem permissão para esta ação.',
        notFound: 'Recurso não encontrado.',
        serverError: 'Erro no servidor. Tente novamente mais tarde.',
        default: 'Ocorreu um erro inesperado.'
    },
    
    // Configurações de cache
    cache: {
        enabled: true,
        duration: 300000 // 5 minutos em ms
    },
    
    // Retry policy
    retry: {
        enabled: true,
        maxAttempts: 3,
        delay: 1000, // ms
        statusCodes: [408, 429, 500, 502, 503, 504]
    }
};

// Tornar disponível globalmente
window.ApiConfig = ApiConfig;
