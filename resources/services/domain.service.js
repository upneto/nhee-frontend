/**
 * Domain Service
 * Serviço para gerenciar dados de domínio (áreas, tipos, objetivos, etc.)
 */

const DomainService = (function() {
  const apiService = window.ApiService;
  const cache = {
    knowledgeAreas: null,
    textTypes: null,
    textObjectives: null,
    foundationLevels: null,
    questionTypes: null
  };

  return {
    /**
     * Busca áreas do conhecimento
     */
    async getKnowledgeAreas() {
      if (cache.knowledgeAreas) {
        return cache.knowledgeAreas;
      }

      const data = await apiService.get('/domains/knowledge-areas');
      cache.knowledgeAreas = data;
      return data;
    },

    /**
     * Busca tipos de texto
     */
    async getTextTypes() {
      if (cache.textTypes) {
        return cache.textTypes;
      }

      const data = await apiService.get('/domains/text-types');
      cache.textTypes = data;
      return data;
    },

    /**
     * Busca objetivos de texto
     */
    async getTextObjectives() {
      if (cache.textObjectives) {
        return cache.textObjectives;
      }

      const data = await apiService.get('/domains/text-objectives');
      cache.textObjectives = data;
      return data;
    },

    /**
     * Busca níveis de fundamentação
     */
    async getFoundationLevels() {
      if (cache.foundationLevels) {
        return cache.foundationLevels;
      }

      const data = await apiService.get('/domains/foundation-levels');
      cache.foundationLevels = data;
      return data;
    },

    /**
     * Busca tipos de dúvida/contribuição
     */
    async getQuestionTypes() {
      if (cache.questionTypes) {
        return cache.questionTypes;
      }

      const data = await apiService.get('/domains/question-types');
      cache.questionTypes = data;
      return data;
    },

    /**
     * Popula um select com opções de um domínio
     * @param {string} selectId - ID do elemento select
     * @param {Array} items - Array de itens do domínio
     * @param {string} placeholder - Texto do placeholder
     * @param {string} selectedValue - Valor pré-selecionado
     */
    populateSelect(selectId, items, placeholder = 'Selecione...', selectedValue = null) {
      const select = document.getElementById(selectId);
      if (!select) return;

      // Limpar opções existentes
      select.innerHTML = '';

      // Adicionar placeholder
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = placeholder;
      select.appendChild(placeholderOption);

      // Adicionar opções dos itens
      items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code;
        option.textContent = item.name;
        if (item.code === selectedValue) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    },

    /**
     * Limpa o cache de domínios
     */
    clearCache() {
      cache.knowledgeAreas = null;
      cache.textTypes = null;
      cache.textObjectives = null;
      cache.foundationLevels = null;
      cache.questionTypes = null;
    }
  };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.DomainService = DomainService;
}
