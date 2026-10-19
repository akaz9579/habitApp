import { useEffect, useState } from 'react';
import { addDays, startOfDay } from 'date-fns';

// The current date, refreshed at local midnight so grids roll over
// without a reload.
export function useToday() {
    const [today, setToday] = useState(() => startOfDay(new Date()));

    useEffect(() => {
        const msUntilMidnight = addDays(today, 1).getTime() - Date.now() + 50;
        const timer = setTimeout(() => setToday(startOfDay(new Date())), msUntilMidnight);
        return () => clearTimeout(timer);
    }, [today]);

    return today;
}
