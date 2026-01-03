/**
 * TextService - Serviço para gerenciamento de textos
 * CRUD completo de textos científicos
 */

class TextService {
    constructor() {
        this.api = window.ApiService;
        this.endpoints = ApiConfig.endpoints.texts;
    }

    /**
     * Listar todos os textos com filtros opcionais
     */
    async list(filters = {}) {
        try {
            // Construir query string a partir dos filtros
            const queryParams = new URLSearchParams();
            
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.area) queryParams.append('area', filters.area);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.concept) queryParams.append('concept', filters.concept);
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.limit) queryParams.append('limit', filters.limit);
            
            const query = queryParams.toString();
            const endpoint = query ? `${this.endpoints.list}?${query}` : this.endpoints.list;
            
            return await this.api.get(endpoint);
        } catch (error) {
            console.error('List texts error:', error);
            throw error;
        }
    }

    /**
     * Obter texto específico por ID
     */
    async get(textId) {
        try {
            return await this.api.get(this.endpoints.get(textId));
        } catch (error) {
            console.error('Get text error:', error);
            throw error;
        }
    }

    /**
     * Criar novo texto
     */
    async create(textData) {
        try {
            return await this.api.post(this.endpoints.create, textData);
        } catch (error) {
            console.error('Create text error:', error);
            throw error;
        }
    }

    /**
     * Atualizar texto existente
     */
    async update(textId, textData) {
        try {
            return await this.api.put(this.endpoints.update(textId), textData);
        } catch (error) {
            console.error('Update text error:', error);
            throw error;
        }
    }

    /**
     * Deletar texto
     */
    async delete(textId) {
        try {
            return await this.api.delete(this.endpoints.delete(textId));
        } catch (error) {
            console.error('Delete text error:', error);
            throw error;
        }
    }

    /**
     * Listar textos do usuário autenticado
     */
    async getMyTexts() {
        try {
            return await this.api.get(this.endpoints.myTexts);
        } catch (error) {
            console.error('Get my texts error:', error);
            throw error;
        }
    }

    /**
     * Avaliar autenticidade de um texto
     */
    async evaluate(textId, rating) {
        try {
            return await this.api.post(this.endpoints.evaluate(textId), { rating });
        } catch (error) {
            console.error('Evaluate text error:', error);
            throw error;
        }
    }
}

// Instância singleton
const textService = new TextService();

// Tornar disponível globalmente
window.TextService = textService;
