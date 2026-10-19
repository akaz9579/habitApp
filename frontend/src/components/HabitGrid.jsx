import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format, getDate } from 'date-fns';
import { buildWeeks, weekdayLabels } from '../lib/dates';

const CELL = 12; // preferred square size in auto mode
const GAP = 4;
const MIN_CELL = 5;
const LABEL_COL = 30; // weekday label column in labeled mode

// Weekly grid like GitHub's: 7 rows (one per weekday), one column per week,
// current week on the right. Squares grow or shrink so the grid fills the width.
const HabitGrid = ({ doneSet, today, weeks = 'auto', weekStartsOn = 0, labels = false }) => {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const gridWidth = Math.max(0, width - (labels ? LABEL_COL : 0));
    const columns =
        weeks === 'auto'
            ? Math.max(1, Math.floor((gridWidth + GAP) / (CELL + GAP)))
            : Number(weeks);
    const cell = Math.max(MIN_CELL, (gridWidth - GAP * (columns - 1)) / columns);

    const grid = useMemo(() => buildWeeks(today, columns, weekStartsOn), [today, columns, weekStartsOn]);

    // A month label sits on the week that contains the 1st (skipping the clipped first column).
    const monthLabels = useMemo(
        () =>
            grid
                .map((week, col) => {
                    const first = week.find((d) => getDate(d.date) === 1);
                    return first && col > 0 ? { col, text: format(first.date, 'MMM') } : null;
                })
                .filter(Boolean),
        [grid],
    );

    const dayNames = weekdayLabels(weekStartsOn);

    return (
        <div
            ref={ref}
            className={`habit-grid ${labels ? 'habit-grid--labeled' : ''}`}
            style={{ '--cell': `${cell}px`, '--gap': `${GAP}px`, '--cols': columns }}
        >
            {width > 0 && (
                <>
                    {labels && (
                        <div className="habit-grid__months mono" aria-hidden="true">
                            {monthLabels.map(({ col, text }) => (
                                <span key={`${col}-${text}`} style={{ gridColumn: `${col + 1} / span 3` }}>
                                    {text}
                                </span>
                            ))}
                        </div>
                    )}
                    {labels && (
                        <div className="habit-grid__weekdays mono" aria-hidden="true">
                            {dayNames.map((name) => (
                                <span key={name}>{['Mon', 'Wed', 'Fri'].includes(name) ? name : ''}</span>
                            ))}
                        </div>
                    )}
                    <div className="habit-grid__cells" role="img" aria-label={`Last ${columns} weeks`}>
                        {grid.flat().map((day, i) => {
                            const done = doneSet.has(day.key);
                            const col = Math.floor(i / 7);
                            const classes = ['cell'];
                            if (columns > 6 && col < 2) classes.push(`fade-${col + 1}`);
                            if (day.isFuture) classes.push('is-future');
                            else if (done) classes.push('is-done');
                            if (day.isToday) classes.push('is-today');
                            return (
                                <span
                                    key={day.key}
                                    className={classes.join(' ')}
                                    title={day.isFuture ? undefined : `${format(day.date, 'EEE, MMM d')}${done ? ': done' : ''}`}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default HabitGrid;
