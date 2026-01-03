/**
 * ConceptService - Serviço para gerenciamento de conceitos
 * Lista de conceitos e mapa conceitual
 */

class ConceptService {
    constructor() {
        this.api = window.ApiService;
        this.endpoints = ApiConfig.endpoints.concepts;
    }

    /**
     * Listar todos os conceitos
     */
    async list() {
        try {
            return await this.api.get(this.endpoints.list);
        } catch (error) {
            console.error('List concepts error:', error);
            throw error;
        }
    }

    /**
     * Obter dados do mapa conceitual
     */
    async getMap() {
        try {
            return await this.api.get(this.endpoints.map);
        } catch (error) {
            console.error('Get concept map error:', error);
            throw error;
        }
    }
}

// Instância singleton
const conceptService = new ConceptService();

// Tornar disponível globalmente
window.ConceptService = conceptService;
