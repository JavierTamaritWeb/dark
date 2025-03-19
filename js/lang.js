class LanguageManager {
    static #instance;
    static #STORAGE_KEY = 'lang';
    static #DEFAULT_LANG = 'es';
    static #LANGUAGES = ['es', 'ca', 'en', 'fr', 'it', 'de', 'ru'];
  
    constructor() {
      if (LanguageManager.#instance) return LanguageManager.#instance;
      // Cargar el idioma guardado o usar el predeterminado.
      this.lang = localStorage.getItem(LanguageManager.#STORAGE_KEY) || LanguageManager.#DEFAULT_LANG;
      if (!LanguageManager.#LANGUAGES.includes(this.lang)) {
        this.lang = LanguageManager.#DEFAULT_LANG;
      }
      // Cachear el botón de idioma y los elementos de texto identificados por data-key.
      this.langButton = document.getElementById('lang-toggle');
      this.langElements = document.querySelectorAll('[data-key]');
      LanguageManager.#instance = this;
    }
  
    async init() {
      // Cargar el archivo JSON de traducciones.
      try {
        const response = await fetch('json/traducciones.json');
        this.translations = await response.json();
      } catch (error) {
        console.error('Error al cargar las traducciones:', error);
        return;
      }
      this.applyLanguage();
      this.bindEvents();
      document.addEventListener('themeChanged', () => this.updateButton());
    }
  
    // Calcula el siguiente idioma de forma cíclica.
    getNextLanguage() {
      const currentIndex = LanguageManager.#LANGUAGES.indexOf(this.lang);
      return LanguageManager.#LANGUAGES[(currentIndex + 1) % LanguageManager.#LANGUAGES.length];
    }
  
    // Alterna al siguiente idioma y aplica los cambios.
    toggle() {
      this.lang = this.getNextLanguage();
      this.applyLanguage();
    }
  
    // Actualiza el botón para mostrar el código del idioma activo.
    updateButton() {
      if (!this.langButton) return;
      const currentLang = this.lang;
      const svg = this.langButton.querySelector('svg');
      if (svg) {
        svg.style.display = 'none';
      }
      const existingLabel = this.langButton.querySelector('.lang-toggle__label');
      if (existingLabel) {
        existingLabel.remove();
      }
      const labelElement = document.createElement('span');
      labelElement.className = 'lang-toggle__label';
      const displayLang = currentLang === 'ca' ? 'VA' : currentLang.toUpperCase();
      labelElement.textContent = displayLang;
      labelElement.style.position = 'absolute';
      labelElement.style.top = '50%';
      labelElement.style.left = '50%';
      labelElement.style.transform = 'translate(-50%, -50%)';
      labelElement.style.fontWeight = 'bold';
      labelElement.style.pointerEvents = 'none';
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      labelElement.style.color = currentTheme === 'light' ? 'black' : 'white';
      this.langButton.appendChild(labelElement);
    }
  
    // Actualiza los textos de la página según el idioma seleccionado.
    updateTexts() {
      document.documentElement.lang = this.lang;
      this.langElements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (key && this.translations[key]) {
          const translation = this.translations[key][this.lang] || this.translations[key][LanguageManager.#DEFAULT_LANG];
          element.textContent = translation;
        }
      });
    }
  
    // Aplica los cambios y guarda la preferencia.
    applyLanguage() {
      this.updateButton();
      this.updateTexts();
      localStorage.setItem(LanguageManager.#STORAGE_KEY, this.lang);
    }
  
    // Enlaza el evento click del botón de idioma.
    bindEvents() {
      if (this.langButton) {
        this.langButton.addEventListener('click', () => this.toggle());
      } else {
        console.warn('No se pudo enlazar el evento al botón de idioma porque no se encontró.');
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new LanguageManager().init());