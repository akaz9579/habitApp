import React, { useMemo } from 'react';
import { format } from 'date-fns';
import CheckButton from './CheckButton';
import { colorValue } from '../theme/palette';
import { useHabitStats } from '../lib/useHabitStats';
import { monthMatrix, toKey } from '../lib/dates';

// Current month as a small calendar of squares.
const HabitCardCompact = ({ habit, today, settings, pending, onSetDone, onOpen }) => {
    const { doneSet } = useHabitStats(habit, today);
    const todayKey = toKey(today);
    const doneToday = doneSet.has(todayKey);
    const days = useMemo(() => monthMatrix(today, today, settings.weekStartsOn).flat(), [today, settings.weekStartsOn]);

    return (
        <article className="compact-card habit-scope" style={{ '--habit': colorValue(habit.color) }} onClick={onOpen}>
            <div className="compact-card__head">
                <CheckButton
                    size="sm"
                    done={doneToday}
                    pending={pending}
                    label={doneToday ? `Mark ${habit.name} not done today` : `Mark ${habit.name} done today`}
                    onClick={() => onSetDone(habit._id, todayKey, !doneToday)}
                />
                <button type="button" className="compact-card__title">
                    <span className="compact-card__name">{habit.name}</span>
                    <span className="compact-card__month mono">{format(today, 'MMM yyyy')}</span>
                </button>
            </div>
            <div className="compact-card__days" aria-hidden="true">
                {days.map((day) => {
                    const classes = ['cell'];
                    if (!day.inMonth) classes.push('is-hidden');
                    else if (day.isFuture) classes.push('is-upcoming');
                    else if (doneSet.has(day.key)) classes.push('is-done');
                    if (day.isToday) classes.push('is-today');
                    return <span key={day.key} className={classes.join(' ')} />;
                })}
            </div>
        </article>
    );
};

export default HabitCardCompact;
