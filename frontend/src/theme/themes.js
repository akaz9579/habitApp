// Theme presets. Their tokens live in index.css under [data-theme='<id>'].
export const PRESETS = [
    { id: 'graphite', name: 'Graphite' },
    { id: 'slate', name: 'Slate' },
    { id: 'moss', name: 'Moss' },
    { id: 'paper', name: 'Paper' },
    { id: 'system', name: 'System' },
];

const LIGHT_QUERY = '(prefers-color-scheme: light)';

export function systemPreset() {
    return window.matchMedia(LIGHT_QUERY).matches ? 'paper' : 'graphite';
}

export function resolvePreset(preset) {
    return preset === 'system' ? systemPreset() : preset;
}

export function watchSystemScheme(onChange) {
    const query = window.matchMedia(LIGHT_QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}
