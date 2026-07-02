import { STORAGE_KEYS } from './config.js';

export function toggleTheme() {
  const root = document.documentElement;
  const goingLight = root.classList.contains('dark');
  root.classList.toggle('dark', !goingLight);
  root.classList.toggle('light', goingLight);
  localStorage.setItem(STORAGE_KEYS.theme, goingLight ? 'light' : 'dark');
  updateThemeIcon();
}

export function updateThemeIcon() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.innerHTML = isDark
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
  btn.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
}
