import React, { useEffect, useRef, useState } from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';
import HabitRow from './HabitRow';

const GAP = 8; // matches .view--list gap

// List view with reordering. Drag a row by its handle (mouse or touch), or
// focus the handle and use the up and down arrow keys.
const HabitList = ({ habits, today, isPendingToday, onSetDone, onOpen, onReorder }) => {
    const rowEls = useRef(new Map());
    const handleEls = useRef(new Map());
    const dragRef = useRef(null);
    const focusAfterMove = useRef(null);
    const [drag, setDrag] = useState(null); // { id, start, target, dy, startY, centers, shift }
    const [announcement, setAnnouncement] = useState('');

    // Keyboard moves re-render the list; keep focus on the handle that moved.
    useEffect(() => {
        if (!focusAfterMove.current) return;
        handleEls.current.get(focusAfterMove.current)?.focus();
        focusAfterMove.current = null;
    });

    const move = (from, to) => {
        const ids = habits.map((h) => h._id);
        const [id] = ids.splice(from, 1);
        ids.splice(to, 0, id);
        onReorder(ids);
        setAnnouncement(`${habits[from].name} moved to position ${to + 1} of ${habits.length}`);
    };

    const startDrag = (e, index) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        const centers = habits.map((h) => {
            const rect = rowEls.current.get(h._id).getBoundingClientRect();
            return rect.top + rect.height / 2;
        });
        const rect = rowEls.current.get(habits[index]._id).getBoundingClientRect();
        const state = {
            id: habits[index]._id,
            start: index,
            target: index,
            dy: 0,
            startY: e.clientY,
            centers,
            shift: rect.height + GAP,
        };
        dragRef.current = state;
        setDrag(state);
    };

    const moveDrag = (e) => {
        const d = dragRef.current;
        if (!d) return;
        const dy = e.clientY - d.startY;
        const center = d.centers[d.start] + dy;
        // New index = how many other rows now sit above the dragged row's center
        const target = d.centers.filter((c, i) => i !== d.start && c < center).length;
        const next = { ...d, dy, target };
        dragRef.current = next;
        setDrag(next);
    };

    const endDrag = () => {
        const d = dragRef.current;
        if (!d) return;
        dragRef.current = null;
        setDrag(null);
        if (d.target !== d.start) move(d.start, d.target);
    };

    const offsetFor = (i) => {
        if (!drag) return 0;
        if (i === drag.start) return drag.dy;
        if (drag.start < drag.target && i > drag.start && i <= drag.target) return -drag.shift;
        if (drag.target < drag.start && i >= drag.target && i < drag.start) return drag.shift;
        return 0;
    };

    const onHandleKey = (e, index) => {
        const to = e.key === 'ArrowUp' ? index - 1 : e.key === 'ArrowDown' ? index + 1 : null;
        if (to === null) return;
        e.preventDefault();
        if (to < 0 || to >= habits.length) return;
        focusAfterMove.current = habits[index]._id;
        move(index, to);
    };

    return (
        <div className={`view view--list ${drag ? 'is-sorting' : ''}`}>
            {habits.map((habit, index) => {
                const offset = offsetFor(index);
                const isDragged = drag?.id === habit._id;
                return (
                    <HabitRow
                        key={habit._id}
                        ref={(el) => {
                            if (el) rowEls.current.set(habit._id, el);
                            else rowEls.current.delete(habit._id);
                        }}
                        habit={habit}
                        today={today}
                        pending={isPendingToday(habit._id)}
                        onSetDone={onSetDone}
                        onOpen={() => onOpen(habit._id)}
                        className={isDragged ? 'is-dragging' : ''}
                        style={offset ? { transform: `translateY(${offset}px)` } : undefined}
                        handle={
                            <button
                                type="button"
                                ref={(el) => {
                                    if (el) handleEls.current.set(habit._id, el);
                                    else handleEls.current.delete(habit._id);
                                }}
                                className="drag-handle"
                                aria-label={`Reorder ${habit.name}, position ${index + 1} of ${habits.length}`}
                                title="Drag to reorder, or use the arrow keys"
                                onPointerDown={(e) => startDrag(e, index)}
                                onPointerMove={moveDrag}
                                onPointerUp={endDrag}
                                onPointerCancel={endDrag}
                                onKeyDown={(e) => onHandleKey(e, index)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DotsSixVertical size={20} weight="bold" />
                            </button>
                        }
                    />
                );
            })}
            <p className="visually-hidden" aria-live="polite">
                {announcement}
            </p>
        </div>
    );
};

export default HabitList;
