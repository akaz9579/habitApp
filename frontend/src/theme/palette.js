// Habit and accent swatches. Values live in index.css as --c-<id>, with a
// dark and a light variant per theme, so a stored id adapts to every preset.
export const SWATCHES = [
    { id: 'sage', name: 'Sage' },
    { id: 'moss', name: 'Moss' },
    { id: 'teal', name: 'Teal' },
    { id: 'sky', name: 'Sky' },
    { id: 'slate', name: 'Slate' },
    { id: 'plum', name: 'Plum' },
    { id: 'rose', name: 'Rose' },
    { id: 'clay', name: 'Clay' },
    { id: 'amber', name: 'Amber' },
    { id: 'stone', name: 'Stone' },
];

const SWATCH_IDS = new Set(SWATCHES.map((s) => s.id));
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const DEFAULT_HABIT_COLOR = 'sage';

export const isSwatch = (color) => SWATCH_IDS.has(color);

// Turn a stored habit color (swatch id or custom hex) into a CSS value.
export function colorValue(color) {
    if (isSwatch(color)) return `var(--c-${color})`;
    if (HEX.test(color ?? '')) return color;
    return `var(--c-${DEFAULT_HABIT_COLOR})`;
}
