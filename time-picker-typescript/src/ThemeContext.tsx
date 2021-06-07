
import { createContext } from 'react';

export const themes = {
  dark: {
    foreground: '#ffffff',
    background: '#282c34',
    label: '#ffffff'
  },
  light: {
    foreground: '#282c34',
    background: '#ffffff',
    label: '#ff0000'
  },
};

export const ThemeContext = createContext(themes.dark);
