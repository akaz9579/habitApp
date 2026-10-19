import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GearSix, Plus } from '@phosphor-icons/react';
import { api } from './api';
import { useSettings } from './theme/SettingsContext';
import { useToday } from './lib/useToday';
import { toKey } from './lib/dates';
import HabitCard from './components/HabitCard';
import HabitCardCompact from './components/HabitCardCompact';
import HabitList from './components/HabitList';
import HabitDetail from './components/HabitDetail';
import HabitForm from './components/HabitForm';
import SettingsPanel from './components/SettingsPanel';
import ConfirmDialog from './components/ConfirmDialog';
import ViewSwitcher from './components/ViewSwitcher';
import { ViewSkeleton } from './components/Skeleton';
import './App.css';

const VIEW_ITEMS = { grid: HabitCard, compact: HabitCardCompact };

const withDate = (habit, date, done) => ({
    ...habit,
    completions: done
        ? [...new Set([...habit.completions, date])]
        : habit.completions.filter((d) => d !== date),
});

function App() {
    const { settings, update } = useSettings();
    const today = useToday();

    const [habits, setHabits] = useState([]);
    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [pending, setPending] = useState(() => new Set()); // `${id}:${date}` keys in flight
    const [openId, setOpenId] = useState(null);
    const [form, setForm] = useState(null); // null | { habit?: Habit }
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [notice, setNotice] = useState('');
    const noticeTimer = useRef(null);

    const showNotice = useCallback((text) => {
        setNotice(text);
        clearTimeout(noticeTimer.current);
        noticeTimer.current = setTimeout(() => setNotice(''), 4000);
    }, []);

    const loadHabits = useCallback(() => {
        api.list()
            .then((data) => {
                setHabits(data);
                setStatus('ready');
            })
            .catch(() => setStatus('error'));
    }, []);

    useEffect(() => {
        loadHabits();
        return () => clearTimeout(noticeTimer.current);
    }, [loadHabits]);

    const retry = () => {
        setStatus('loading');
        loadHabits();
    };

    const replaceHabit = (next) => setHabits((list) => list.map((h) => (h._id === next._id ? next : h)));

    const isPending = (id, date) => pending.has(`${id}:${date}`);

    // Update the screen right away, then confirm with the server. On failure
    // only this one date is reverted, so other changes made meanwhile survive.
    const setDone = async (id, date, done) => {
        const key = `${id}:${date}`;
        if (pending.has(key)) return;
        setPending((p) => new Set(p).add(key));
        setHabits((list) => list.map((h) => (h._id === id ? withDate(h, date, done) : h)));
        try {
            replaceHabit(await api.setDone(id, date, done));
        } catch {
            setHabits((list) => list.map((h) => (h._id === id ? withDate(h, date, !done) : h)));
            showNotice('Could not save that change. Check your connection and try again.');
        } finally {
            setPending((p) => {
                const next = new Set(p);
                next.delete(key);
                return next;
            });
        }
    };

    // Show the new order right away. If saving fails, put the habits back in
    // their previous order without undoing any other changes.
    const reorderHabits = async (ids) => {
        const previousIds = habits.map((h) => h._id);
        const sortBy = (order) => (list) => {
            const rank = new Map(order.map((id, i) => [id, i]));
            return [...list].sort((a, b) => (rank.get(a._id) ?? 0) - (rank.get(b._id) ?? 0));
        };
        setHabits(sortBy(ids));
        try {
            await api.reorder(ids);
        } catch {
            setHabits(sortBy(previousIds));
            showNotice('Could not save the new order. Try again.');
        }
    };

    const saveHabit = async (data) => {
        if (form?.habit) {
            replaceHabit(await api.update(form.habit._id, data));
        } else {
            const created = await api.create(data);
            setHabits((list) => [created, ...list]);
        }
        setForm(null);
    };

    const archiveHabit = async (id) => {
        try {
            await api.update(id, { archived: true });
            setHabits((list) => list.filter((h) => h._id !== id));
            setOpenId(null);
            showNotice('Habit archived.');
        } catch {
            showNotice('Could not archive the habit. Try again.');
        }
    };

    const deleteHabit = async (id) => {
        await api.remove(id);
        setHabits((list) => list.filter((h) => h._id !== id));
        setConfirmDelete(false);
        setOpenId(null);
    };

    const openHabit = habits.find((h) => h._id === openId);
    const Item = VIEW_ITEMS[settings.view] ?? HabitCard;

    let content;
    if (openHabit) {
        content = (
            <HabitDetail
                habit={openHabit}
                today={today}
                settings={settings}
                isPending={isPending}
                onBack={() => setOpenId(null)}
                onEdit={() => setForm({ habit: openHabit })}
                onSetDone={setDone}
                onArchive={() => archiveHabit(openHabit._id)}
                onDelete={() => setConfirmDelete(true)}
            />
        );
    } else if (status === 'loading') {
        content = <ViewSkeleton view={settings.view} />;
    } else if (status === 'error') {
        content = (
            <div className="state" role="alert">
                <h2>Could not load your habits</h2>
                <p>The server did not respond. Make sure the backend is running, then try again.</p>
                <button type="button" className="btn btn--primary" onClick={retry}>
                    Retry
                </button>
            </div>
        );
    } else if (habits.length === 0) {
        content = (
            <div className="state">
                <h2>No habits yet</h2>
                <p>Add your first habit and check it off each day to fill in the grid.</p>
                <button type="button" className="btn btn--primary" onClick={() => setForm({})}>
                    <Plus size={18} weight="bold" />
                    New habit
                </button>
            </div>
        );
    } else if (settings.view === 'list') {
        content = (
            <HabitList
                habits={habits}
                today={today}
                isPendingToday={(id) => isPending(id, toKey(today))}
                onSetDone={setDone}
                onOpen={setOpenId}
                onReorder={reorderHabits}
            />
        );
    } else {
        content = (
            <div className={`view view--${settings.view}`}>
                {habits.map((habit) => (
                    <Item
                        key={habit._id}
                        habit={habit}
                        today={today}
                        settings={settings}
                        pending={isPending(habit._id, toKey(today))}
                        onSetDone={setDone}
                        onOpen={() => setOpenId(habit._id)}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="app">
            {!openHabit && (
                <header className="top-bar">
                    <button
                        type="button"
                        className="icon-btn icon-btn--lg"
                        aria-label="Settings"
                        onClick={() => setSettingsOpen(true)}
                    >
                        <GearSix size={22} />
                    </button>
                    <h1 className="top-bar__title">Habits</h1>
                    <button type="button" className="add-btn" aria-label="New habit" onClick={() => setForm({})}>
                        <Plus size={22} weight="bold" />
                    </button>
                </header>
            )}

            <main className="app__main">{content}</main>

            {!openHabit && <ViewSwitcher view={settings.view} onChange={(view) => update({ view })} />}

            {notice && (
                <div className="notice" role="status">
                    {notice}
                </div>
            )}

            {form && <HabitForm habit={form.habit} onSubmit={saveHabit} onCancel={() => setForm(null)} />}
            {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
            {confirmDelete && openHabit && (
                <ConfirmDialog
                    title="Delete habit"
                    message={`Delete "${openHabit.name}" and its whole history? This cannot be undone. Archive it instead if you might want it back.`}
                    confirmLabel="Delete"
                    onConfirm={() => deleteHabit(openHabit._id)}
                    onCancel={() => setConfirmDelete(false)}
                />
            )}
        </div>
    );
}

export default App;
