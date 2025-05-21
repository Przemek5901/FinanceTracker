import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private themeKey = 'theme';

  constructor() {
    const saved = localStorage.getItem(this.themeKey);
    if (saved === 'dark') {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem(this.themeKey, 'dark');
  }

  disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem(this.themeKey, 'light');
  }

  toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }
}
