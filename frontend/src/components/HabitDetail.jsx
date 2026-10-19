import React from 'react';
import { Archive, CaretLeft, Flame, PencilSimple, Trash } from '@phosphor-icons/react';
import HabitGrid from './HabitGrid';
import HabitIcon from './HabitIcon';
import MonthCalendar from './MonthCalendar';
import { colorValue } from '../theme/palette';
import { useHabitStats } from '../lib/useHabitStats';

const HabitDetail = ({ habit, today, settings, isPending, onBack, onEdit, onSetDone, onArchive, onDelete }) => {
    const { doneSet, current, best, total } = useHabitStats(habit, today);

    return (
        <div className="detail habit-scope" style={{ '--habit': colorValue(habit.color) }}>
            <div className="detail__bar">
                <button type="button" className="icon-btn icon-btn--lg" aria-label="Back to habits" onClick={onBack}>
                    <CaretLeft size={22} />
                </button>
                <button type="button" className="icon-btn icon-btn--lg" aria-label="Edit habit" onClick={onEdit}>
                    <PencilSimple size={22} />
                </button>
            </div>

            <header className="detail__head">
                <HabitIcon icon={habit.icon} size="lg" />
                <div>
                    <h1 className="detail__name">{habit.name}</h1>
                    <p className="detail__desc">{habit.description || 'No description'}</p>
                </div>
            </header>

            <section className="panel">
                <HabitGrid
                    doneSet={doneSet}
                    today={today}
                    weeks={settings.gridWeeks}
                    weekStartsOn={settings.weekStartsOn}
                    labels
                />
            </section>

            <div className="detail__chips">
                <span className="chip mono" title="Current streak">
                    <Flame size={18} />
                    {current}
                </span>
                <span className="chip mono">Best {best}</span>
                <span className="chip mono">Total {total}</span>
            </div>

            <MonthCalendar
                doneSet={doneSet}
                today={today}
                weekStartsOn={settings.weekStartsOn}
                isPending={(date) => isPending(habit._id, date)}
                onSetDone={(date, done) => onSetDone(habit._id, date, done)}
            />

            <div className="detail__actions">
                <button type="button" className="btn btn--quiet" onClick={onArchive}>
                    <Archive size={18} />
                    Archive
                </button>
                <button type="button" className="btn btn--danger" onClick={onDelete}>
                    <Trash size={18} />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default HabitDetail;
