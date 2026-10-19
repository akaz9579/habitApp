import React, { createElement } from 'react';
import { CalendarBlank, Rows, SquaresFour } from '@phosphor-icons/react';

const VIEWS = [
    { id: 'grid', label: 'Grid', icon: SquaresFour },
    { id: 'compact', label: 'Month', icon: CalendarBlank },
    { id: 'list', label: 'List', icon: Rows },
];

const ViewSwitcher = ({ view, onChange }) => (
    <nav className="view-switcher" aria-label="Layout">
        {VIEWS.map(({ id, label, icon }) => (
            <button
                key={id}
                type="button"
                className={`view-switcher__item ${view === id ? 'is-active' : ''}`}
                aria-pressed={view === id}
                onClick={() => onChange(id)}
            >
                {createElement(icon, { size: 20, weight: view === id ? 'bold' : 'regular' })}
                <span className="mono">{label}</span>
            </button>
        ))}
    </nav>
);

export default ViewSwitcher;
