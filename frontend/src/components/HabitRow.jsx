import React, { forwardRef } from 'react';
import HabitIcon from './HabitIcon';
import CheckButton from './CheckButton';
import { colorValue } from '../theme/palette';
import { useHabitStats } from '../lib/useHabitStats';
import { toKey } from '../lib/dates';

// `handle` is the reorder grip, supplied by HabitList. `className` and `style`
// carry drag state.
const HabitRow = forwardRef(({ habit, today, pending, onSetDone, onOpen, handle, className = '', style }, ref) => {
    const { doneSet, current } = useHabitStats(habit, today);
    const todayKey = toKey(today);
    const doneToday = doneSet.has(todayKey);

    return (
        <article
            ref={ref}
            className={`habit-row habit-scope ${className}`}
            style={{ '--habit': colorValue(habit.color), ...style }}
            onClick={onOpen}
        >
            {handle}
            <button type="button" className="habit-row__title">
                <HabitIcon icon={habit.icon} size="sm" />
                <span className="habit-row__name">{habit.name}</span>
            </button>
            <span className="habit-row__streak">
                <span className="mono">{current}</span> day streak
            </span>
            <CheckButton
                size="sm"
                done={doneToday}
                pending={pending}
                label={doneToday ? `Mark ${habit.name} not done today` : `Mark ${habit.name} done today`}
                onClick={() => onSetDone(habit._id, todayKey, !doneToday)}
            />
        </article>
    );
});

HabitRow.displayName = 'HabitRow';

export default HabitRow;
