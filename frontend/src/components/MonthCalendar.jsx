import React, { useState } from 'react';
import { addMonths, format, isSameMonth, startOfMonth } from 'date-fns';
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { monthMatrix, weekdayLabels } from '../lib/dates';

// Month view for fixing past days. Future days are disabled.
const MonthCalendar = ({ doneSet, today, weekStartsOn = 0, isPending, onSetDone }) => {
    const [month, setMonth] = useState(() => startOfMonth(today));
    const rows = monthMatrix(month, today, weekStartsOn);
    const atCurrentMonth = isSameMonth(month, today);

    return (
        <section className="panel month-cal" aria-label="Calendar">
            <div className="month-cal__weekdays mono" aria-hidden="true">
                {weekdayLabels(weekStartsOn).map((name) => (
                    <span key={name}>{name}</span>
                ))}
            </div>
            <div className="month-cal__days">
                {rows.flat().map((day) => {
                    const done = doneSet.has(day.key);
                    const classes = ['month-cal__day', 'mono'];
                    if (!day.inMonth) classes.push('is-outside');
                    if (done) classes.push('is-done');
                    if (day.isToday) classes.push('is-today');
                    return (
                        <button
                            key={day.key}
                            type="button"
                            className={classes.join(' ')}
                            disabled={day.isFuture || !day.inMonth || isPending(day.key)}
                            aria-pressed={done}
                            aria-label={`${format(day.date, 'EEEE, MMMM d')}${done ? ', done' : ''}`}
                            onClick={() => onSetDone(day.key, !done)}
                        >
                            {format(day.date, 'd')}
                        </button>
                    );
                })}
            </div>
            <div className="month-cal__nav">
                <button
                    type="button"
                    className="chip chip--button mono"
                    onClick={() => setMonth(startOfMonth(today))}
                    disabled={atCurrentMonth}
                    title="Back to this month"
                >
                    <CalendarBlank size={18} />
                    {format(month, 'MMM yyyy')}
                </button>
                <div className="month-cal__arrows">
                    <button
                        type="button"
                        className="icon-btn"
                        aria-label="Previous month"
                        onClick={() => setMonth((m) => addMonths(m, -1))}
                    >
                        <CaretLeft size={20} />
                    </button>
                    <button
                        type="button"
                        className="icon-btn"
                        aria-label="Next month"
                        disabled={atCurrentMonth}
                        onClick={() => setMonth((m) => addMonths(m, 1))}
                    >
                        <CaretRight size={20} />
                    </button>
                </div>
            </div>
            <p className="month-cal__hint">Tap a past day to mark it done or not done.</p>
        </section>
    );
};

export default MonthCalendar;
