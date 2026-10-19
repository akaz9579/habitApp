import { differenceInCalendarDays, startOfDay, subDays } from 'date-fns';
import { fromKey, toKey } from './dates';

// Consecutive done days ending today. If today isn't done yet, the streak
// still counts from yesterday so it doesn't drop to zero first thing in the morning.
export function currentStreak(doneSet, today) {
    let day = startOfDay(today);
    if (!doneSet.has(toKey(day))) day = subDays(day, 1);
    let count = 0;
    while (doneSet.has(toKey(day))) {
        count += 1;
        day = subDays(day, 1);
    }
    return count;
}

export function bestStreak(doneSet) {
    const keys = [...doneSet].sort();
    let best = 0;
    let run = 0;
    let prev = null;
    for (const key of keys) {
        const date = fromKey(key);
        run = prev && differenceInCalendarDays(date, prev) === 1 ? run + 1 : 1;
        best = Math.max(best, run);
        prev = date;
    }
    return best;
}
