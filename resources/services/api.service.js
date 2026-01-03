/**
 * ApiService - Serviço genérico para consumo de APIs
 * Centraliza toda a lógica de comunicação HTTP com o backend
 */

class ApiService {
    constructor() {
        this.baseURL = ApiConfig.baseURL;
        this.timeout = ApiConfig.timeout;
        this.cache = new Map();
    }

    /**
     * Constrói a URL completa
     */
    _buildURL(endpoint) {
        if (endpoint.startsWith('http')) {
            return endpoint;
        }
        return `${this.baseURL}${endpoint}`;
    }

    /**
     * Constrói os headers da requisição
     */
    _buildHeaders(customHeaders = {}) {
        const headers = { ...ApiConfig.defaultHeaders };
        
        // Adicionar token de autenticação se existir
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Mesclar com headers customizados
        return { ...headers, ...customHeaders };
    }

    /**
     * Gera chave para cache
     */
    _getCacheKey(url, options) {
        return `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || {})}`;
    }

    /**
     * Verifica se existe cache válido
     */
    _getFromCache(key) {
        if (!ApiConfig.cache.enabled) return null;
        
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const now = Date.now();
        if (now - cached.timestamp > ApiConfig.cache.duration) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    /**
     * Salva no cache
     */
    _saveToCache(key, data) {
        if (!ApiConfig.cache.enabled) return;
        
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Limpa todo o cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Tratamento de erros HTTP
     */
    _handleError(error, url) {
        console.error('API Error:', error);
        
        // Erro de rede/timeout
        if (!error.response) {
            if (error.name === 'AbortError') {
                throw new Error(ApiConfig.errorMessages.timeout);
            }
            throw new Error(ApiConfig.errorMessages.network);
        }
        
        // Erro HTTP
        const status = error.status || error.response?.status;
        
        switch (status) {
            case ApiConfig.statusCodes.UNAUTHORIZED:
                // Limpar autenticação e redirecionar para login
                localStorage.removeItem('authToken');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('username');
                window.location.hash = 'login';
                throw new Error(ApiConfig.errorMessages.unauthorized);
                
            case ApiConfig.statusCodes.FORBIDDEN:
                throw new Error(ApiConfig.errorMessages.forbidden);
                
            case ApiConfig.statusCodes.NOT_FOUND:
                throw new Error(ApiConfig.errorMessages.notFound);
                
            case ApiConfig.statusCodes.INTERNAL_SERVER_ERROR:
                throw new Error(ApiConfig.errorMessages.serverError);
                
            default:
                // Tentar usar mensagem do servidor
                const message = error.response?.data?.message 
                    || error.message 
                    || ApiConfig.errorMessages.default;
                throw new Error(message);
        }
    }

    /**
     * Faz requisição HTTP com retry e timeout
     */
    async _request(url, options = {}, retryCount = 0) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Se não foi bem sucedido, tentar retry se aplicável
            if (!response.ok) {
                const shouldRetry = ApiConfig.retry.enabled 
                    && retryCount < ApiConfig.retry.maxAttempts
                    && ApiConfig.retry.statusCodes.includes(response.status);
                
                if (shouldRetry) {
                    await new Promise(resolve => 
                        setTimeout(resolve, ApiConfig.retry.delay * (retryCount + 1))
                    );
                    return this._request(url, options, retryCount + 1);
                }
                
                throw { 
                    status: response.status, 
                    response: response 
                };
            }
            
            // Parse da resposta
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
            
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        const url = this._buildURL(endpoint);
        const cacheKey = this._getCacheKey(url, { method: 'GET' });
        
        // Verificar cache
        const cachedData = this._getFromCache(cacheKey);
        if (cachedData && !options.skipCache) {
            return cachedData;
        }
        
        try {
            const headers = this._buildHeaders(options.headers);
            const data = await this._request(url, {
                method: 'GET',
                headers
            });
            
            // Salvar no cache
            this._saveToCache(cacheKey, data);
            
            return data;
        } catch (error) {
            return this._handleError(error, url);
        }
    }

    /**
     * POST request
     */
    async post(endpoint, body = {}, options = {}) {
        const url = this._buildURL(endpoint);
        
        try {
            const headers = this._buildHeaders(options.headers);
            const data = await this._request(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            
            // Invalidar cache relacionado
            this.clearCache();
            
            return data;
        } catch (error) {
            return this._handleError(error, url);
        }
    }

    /**
     * PUT request
     */
    async put(endpoint, body = {}, options = {}) {
        const url = this._buildURL(endpoint);
        
        try {
            const headers = this._buildHeaders(options.headers);
            const data = await this._request(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body)
            });
            
            // Invalidar cache relacionado
            this.clearCache();
            
            return data;
        } catch (error) {
            return this._handleError(error, url);
        }
    }

    /**
     * PATCH request
     */
    async patch(endpoint, body = {}, options = {}) {
        const url = this._buildURL(endpoint);
        
        try {
            const headers = this._buildHeaders(options.headers);
            const data = await this._request(url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(body)
            });
            
            // Invalidar cache relacionado
            this.clearCache();
            
            return data;
        } catch (error) {
            return this._handleError(error, url);
        }
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        const url = this._buildURL(endpoint);
        
        try {
            const headers = this._buildHeaders(options.headers);
            const data = await this._request(url, {
                method: 'DELETE',
                headers
            });
            
            // Invalidar cache relacionado
            this.clearCache();
            
            return data;
        } catch (error) {
            return this._handleError(error, url);
        }
    }

    /**
     * Upload de arquivo
     */
    async upload(endpoint, file, fieldName = 'file', additionalData = {}) {
        const url = this._buildURL(endpoint);
        
        try {
            const formData = new FormData();
            formData.append(fieldName, file);
            
            // Adicionar dados adicionais
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
            
            // Headers sem Content-Type (será definido automaticamente pelo browser)
            const headers = this._buildHeaders();
            delete headers['Content-Type'];
            
            const data = await this._request(url, {
                method: 'POST',
                headers,
                body: formData
            });
            
            return data;
        } catch (error) {
            return this._handleError(error, url);
        }
    }
}

// Instância singleton
const apiService = new ApiService();

// Tornar disponível globalmente
window.ApiService = apiService;
