// js/lang.js

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
        // Determinar el idioma alternativo para el botón (el que se mostrará)
        const targetLang = this.lang === 'es' ? 'ca' : 'es';
        const langButton = document.getElementById('lang-toggle');
        
        // Forzar actualización del SVG y del atributo data-lang en el botón, comprobando que el elemento <use> exista
        const useElement = langButton?.querySelector('use');
        if (useElement) {
            useElement.setAttribute('href', `#icon-lang-${targetLang}`);
            langButton.setAttribute('data-lang', targetLang.toUpperCase());
        }

        // Actualizar el atributo lang del documento para reflejar el idioma actual
        document.documentElement.lang = this.lang;
        
        // Actualizar textos en todos los elementos que tengan atributos de traducción
        document.querySelectorAll('[data-lang]').forEach(element => {
            const translation = element.getAttribute(`data-lang-${this.lang}`);
            if (translation) element.textContent = translation;
        });
        
        // Guardar la configuración del idioma en localStorage
        localStorage.setItem(LanguageManager.#STORAGE_KEY, this.lang);
    }

    toggle() {
        this.lang = this.lang === 'es' ? 'ca' : 'es';
        this.applyLanguage();
    }

    bindEvents() {
        document.getElementById('lang-toggle')?.addEventListener('click', () => this.toggle());
    }
}

document.addEventListener('DOMContentLoaded', () => new LanguageManager().init());