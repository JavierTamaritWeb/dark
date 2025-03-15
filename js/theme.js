// js/theme.js
// Theme manager


class ThemeManager {
    static #instance = null;
    static #STORAGE_KEY = 'theme';
    static #DEFAULT_THEME = 'light';
  
    constructor() {
      if (ThemeManager.#instance) {
        return ThemeManager.#instance;
      }
      this.theme = localStorage.getItem(ThemeManager.#STORAGE_KEY) || ThemeManager.#DEFAULT_THEME;
      ThemeManager.#instance = this;
    }
  
    init() {
      this.applyTheme();
      this.bindEvents();
    }
  
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme);
      localStorage.setItem(ThemeManager.#STORAGE_KEY, this.theme);
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: this.theme }));
    }
  
    toggle() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.applyTheme();
    }
  
    bindEvents() {
      document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
    }
  }
  
  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    themeManager.init();
  });