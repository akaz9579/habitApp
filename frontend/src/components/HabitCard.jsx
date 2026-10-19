import React from 'react';
import HabitGrid from './HabitGrid';
import HabitIcon from './HabitIcon';
import CheckButton from './CheckButton';
import { colorValue } from '../theme/palette';
import { useHabitStats } from '../lib/useHabitStats';
import { toKey } from '../lib/dates';

const HabitCard = ({ habit, today, settings, pending, onSetDone, onOpen }) => {
    const { doneSet } = useHabitStats(habit, today);
    const todayKey = toKey(today);
    const doneToday = doneSet.has(todayKey);

    return (
        <article
            className="habit-card habit-scope"
            style={{ '--habit': colorValue(habit.color) }}
            onClick={onOpen}
        >
            <div className="habit-card__head">
                {/* Clicks bubble to the card, which opens the detail view */}
                <button type="button" className="habit-card__title">
                    <HabitIcon icon={habit.icon} />
                    <span className="habit-card__name">{habit.name}</span>
                </button>
                <CheckButton
                    done={doneToday}
                    pending={pending}
                    label={doneToday ? `Mark ${habit.name} not done today` : `Mark ${habit.name} done today`}
                    onClick={() => onSetDone(habit._id, todayKey, !doneToday)}
                />
            </div>
            <HabitGrid
                doneSet={doneSet}
                today={today}
                weeks={settings.gridWeeks}
                weekStartsOn={settings.weekStartsOn}
            />
        </article>
    );
};

export default HabitCard;
