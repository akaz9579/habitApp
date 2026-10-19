import {
    addDays,
    addWeeks,
    format,
    isAfter,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subWeeks,
} from 'date-fns';

export const toKey = (date) => format(date, 'yyyy-MM-dd');
export const fromKey = (key) => parseISO(key);

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Weekday short names in display order for the chosen week start.
export const weekdayLabels = (weekStartsOn = 0) =>
    WEEKDAYS.map((_, i) => WEEKDAYS[(i + weekStartsOn) % 7]);

const makeDay = (date, today) => ({
    key: toKey(date),
    date,
    isToday: isSameDay(date, today),
    isFuture: isAfter(date, today),
});

// Columns of 7 days, oldest week first. The last column is the current week,
// so today always sits in the rightmost column.
export function buildWeeks(today, weekCount, weekStartsOn = 0) {
    const day = startOfDay(today);
    const first = subWeeks(startOfWeek(day, { weekStartsOn }), weekCount - 1);
    return Array.from({ length: weekCount }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => makeDay(addDays(first, w * 7 + d), day)),
    );
}

// Calendar rows for a month: only the weeks that touch it.
export function monthMatrix(month, today, weekStartsOn = 0) {
    const day = startOfDay(today);
    const monthStart = startOfMonth(month);
    const rows = [];
    let weekStart = startOfWeek(monthStart, { weekStartsOn });
    while (rows.length === 0 || isSameMonth(weekStart, monthStart)) {
        const start = weekStart;
        rows.push(
            Array.from({ length: 7 }, (_, d) => {
                const date = addDays(start, d);
                return { ...makeDay(date, day), inMonth: isSameMonth(date, monthStart) };
            }),
        );
        weekStart = addWeeks(weekStart, 1);
    }
    return rows;
}
