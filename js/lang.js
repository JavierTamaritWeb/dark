class LanguageManager {
    static #instance;
    static #STORAGE_KEY = 'lang';
    static #DEFAULT_LANG = 'es';

    constructor() {
        if (LanguageManager.#instance) return LanguageManager.#instance;
        this.lang = localStorage.getItem(LanguageManager.#STORAGE_KEY) || LanguageManager.#DEFAULT_LANG;
        LanguageManager.#instance = this;
    }

    init() {
        this.applyLanguage();
        this.bindEvents();
    }

    applyLanguage() {
        // Actualizar contenido y botón
        const targetLang = this.lang === 'es' ? 'ca' : 'es';
        const langButton = document.getElementById('lang-toggle');
        
        // Actualizar icono y etiqueta
        langButton.querySelector('use').setAttribute('href', `#icon-lang-${targetLang}`);
        langButton.setAttribute('data-lang', targetLang.toUpperCase());
        
        // Actualizar textos
        document.documentElement.lang = this.lang;
        document.querySelectorAll('[data-lang]').forEach(element => {
            const translation = element.getAttribute(`data-lang-${this.lang}`);
            if (translation) element.textContent = translation;
        });
        
        localStorage.setItem(LanguageManager.#STORAGE_KEY, this.lang);
    }

    toggle() {
        this.lang = this.lang === 'es' ? 'ca' : 'es';
        this.applyLanguage();
    }

    bindEvents() {
        document.getElementById('lang-toggle').addEventListener('click', () => this.toggle());
    }
}

document.addEventListener('DOMContentLoaded', () => new LanguageManager().init());