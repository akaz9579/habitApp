import { createContext, useContext } from 'react';

export const STORAGE_KEY = 'habitapp.settings';

export const DEFAULT_SETTINGS = {
    preset: 'graphite',
    accent: 'sage',
    singleColor: false,
    gridWeeks: 'auto',
    weekStartsOn: 0,
    view: 'grid',
};

export function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return { ...DEFAULT_SETTINGS, ...saved };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        // Storage can be blocked (private mode). Settings then last for this visit only.
    }
}

export const SettingsContext = createContext({
    settings: DEFAULT_SETTINGS,
    update: () => {},
});

export const useSettings = () => useContext(SettingsContext);
