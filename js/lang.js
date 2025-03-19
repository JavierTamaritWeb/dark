// js/lang.js

class LanguageManager {
    static #instance;
    static #STORAGE_KEY = 'lang';
    static #DEFAULT_LANG = 'es';
    static #LANGUAGES = ['es', 'ca', 'en', 'fr', 'it', 'de', 'ru'];

    constructor() {
        if (LanguageManager.#instance) return LanguageManager.#instance;
        // Cargar el idioma desde localStorage o usar el idioma predeterminado.
        this.lang = localStorage.getItem(LanguageManager.#STORAGE_KEY) || LanguageManager.#DEFAULT_LANG;
        if (!LanguageManager.#LANGUAGES.includes(this.lang)) {
            this.lang = LanguageManager.#DEFAULT_LANG;
        }
        // Cachear el botón de idioma y los elementos traducibles.
        this.langButton = document.getElementById('lang-toggle');
        if (!this.langButton) console.warn('No se encontró el botón de cambio de idioma.');
        this.langElements = document.querySelectorAll('[data-lang]');
        LanguageManager.#instance = this;
    }

    init() {
        this.applyLanguage();
        this.bindEvents();
        document.addEventListener('themeChanged', () => this.updateButton());
    }

    // Calcula el siguiente idioma de forma cíclica.
    getNextLanguage() {
        const currentIndex = LanguageManager.#LANGUAGES.indexOf(this.lang);
        return LanguageManager.#LANGUAGES[(currentIndex + 1) % LanguageManager.#LANGUAGES.length];
    }

    // Alterna al siguiente idioma y aplica la actualización.
    toggle() {
        this.lang = this.getNextLanguage();
        this.applyLanguage();
    }

    // Actualiza el botón de idioma para mostrar el código del idioma activo.
    updateButton() {
        if (!this.langButton) return;
        const currentLang = this.lang;
        
        // Ocultar el SVG predeterminado (por ejemplo, que muestra "CA")
        const svg = this.langButton.querySelector('svg');
        if (svg) {
            svg.style.display = 'none';
        }
        
        // Eliminar cualquier etiqueta previa para evitar superposiciones.
        const existingLabel = this.langButton.querySelector('.lang-toggle__label');
        if (existingLabel) {
            existingLabel.remove();
        }
        
        // Crear un nuevo elemento <span> que mostrará el idioma activo.
        const labelElement = document.createElement('span');
        labelElement.className = 'lang-toggle__label';
        
        // Si el idioma es 'ca' (Catalán/Valenciano), mostrar "VA"; de lo contrario, el código en mayúsculas.
        const displayLang = currentLang === 'ca' ? 'VA' : currentLang.toUpperCase();
        labelElement.textContent = displayLang;
        
        labelElement.style.position = 'absolute';
        labelElement.style.top = '50%';
        labelElement.style.left = '50%';
        labelElement.style.transform = 'translate(-50%, -50%)';
        labelElement.style.fontWeight = 'bold';
        labelElement.style.pointerEvents = 'none';
        
        // Ajustar el color según el tema.
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        labelElement.style.color = currentTheme === 'light' ? 'black' : 'white';
        
        this.langButton.appendChild(labelElement);
    }

    // Actualiza los textos traducibles de la página según el idioma activo.
    updateTexts() {
        document.documentElement.lang = this.lang;
        this.langElements.forEach(element => {
            let translation = element.getAttribute(`data-lang-${this.lang}`);
            if (!translation) {
                translation = element.getAttribute(`data-lang-${LanguageManager.#DEFAULT_LANG}`) || element.textContent;
            }
            element.textContent = translation;
        });
    }

    // Aplica los cambios: actualiza el botón, los textos y guarda la preferencia.
    applyLanguage() {
        this.updateButton();
        this.updateTexts();
        localStorage.setItem(LanguageManager.#STORAGE_KEY, this.lang);
    }

    // Enlaza el evento click al botón de idioma.
    bindEvents() {
        if (this.langButton) {
            this.langButton.addEventListener('click', () => this.toggle());
        } else {
            console.warn('No se pudo enlazar el evento al botón de idioma porque no se encontró.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new LanguageManager().init());