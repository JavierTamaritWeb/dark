// js/theme.js

class ThemeManager {
    static #instance = null;
    static #STORAGE_KEY = 'theme';
    static #DEFAULT_THEME = 'light';

    constructor() {
        if (ThemeManager.#instance) return ThemeManager.#instance;
        // Cargar el tema actual del localStorage o usar el predeterminado.
        this.theme = localStorage.getItem(ThemeManager.#STORAGE_KEY) || ThemeManager.#DEFAULT_THEME;
        // Cachear el botón de cambio de tema.
        this.themeToggleButton = document.getElementById('theme-toggle');
        if (!this.themeToggleButton) {
            console.warn('No se encontró el botón de cambio de tema (theme-toggle).');
        }
        ThemeManager.#instance = this;
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    // Aplica el tema actual y guarda la configuración.
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem(ThemeManager.#STORAGE_KEY, this.theme);
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: this.theme }));
    }

    // Alterna entre tema claro y oscuro.
    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    // Asigna el evento de click usando el botón cacheado.
    bindEvents() {
        if (this.themeToggleButton) {
            this.themeToggleButton.addEventListener('click', () => this.toggle());
        } else {
            console.warn('No se pudo enlazar el evento al botón de tema porque no se encontró.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    themeManager.init();
});