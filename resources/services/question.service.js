/**
 * QuestionService - Serviço para gerenciamento de dúvidas/comentários
 * CRUD de questões associadas a textos
 */

class QuestionService {
    constructor() {
        this.api = window.ApiService;
        this.endpoints = ApiConfig.endpoints.questions;
    }

    /**
     * Listar dúvidas de um texto
     */
    async list(textId) {
        try {
            return await this.api.get(this.endpoints.list(textId));
        } catch (error) {
            console.error('List questions error:', error);
            throw error;
        }
    }

    /**
     * Obter dúvida específica
     */
    async get(textId, questionId) {
        try {
            return await this.api.get(this.endpoints.get(textId, questionId));
        } catch (error) {
            console.error('Get question error:', error);
            throw error;
        }
    }

    /**
     * Criar nova dúvida/comentário
     */
    async create(textId, questionData) {
        try {
            return await this.api.post(this.endpoints.create(textId), questionData);
        } catch (error) {
            console.error('Create question error:', error);
            throw error;
        }
    }

    /**
     * Deletar dúvida
     */
    async delete(textId, questionId) {
        try {
            return await this.api.delete(this.endpoints.delete(textId, questionId));
        } catch (error) {
            console.error('Delete question error:', error);
            throw error;
        }
    }
}

// Instância singleton
const questionService = new QuestionService();

// Tornar disponível globalmente
window.QuestionService = questionService;
