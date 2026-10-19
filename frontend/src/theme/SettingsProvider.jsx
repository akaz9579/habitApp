import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SettingsContext, loadSettings, saveSettings } from './SettingsContext';
import { resolvePreset, watchSystemScheme } from './themes';

const applyToRoot = (settings) => {
    const root = document.documentElement;
    root.dataset.theme = resolvePreset(settings.preset);
    root.dataset.accent = settings.accent;
    root.dataset.single = settings.singleColor ? 'true' : 'false';
};

const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(loadSettings);

    useEffect(() => {
        applyToRoot(settings);
        saveSettings(settings);
        if (settings.preset !== 'system') return undefined;
        return watchSystemScheme(() => applyToRoot(settings));
    }, [settings]);

    const update = useCallback((patch) => {
        setSettings((prev) => ({ ...prev, ...patch }));
    }, []);

    const value = useMemo(() => ({ settings, update }), [settings, update]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
