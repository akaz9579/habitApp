import { useMemo } from 'react';
import { bestStreak, currentStreak } from './streaks';

export function useHabitStats(habit, today) {
    return useMemo(() => {
        const doneSet = new Set(habit.completions);
        return {
            doneSet,
            current: currentStreak(doneSet, today),
            best: bestStreak(doneSet),
            total: doneSet.size,
        };
    }, [habit.completions, today]);
}
