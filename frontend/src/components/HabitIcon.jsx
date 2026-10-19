import React, { createElement } from 'react';
import { iconFor } from './icons';

const ICON_SIZES = { sm: 18, md: 22, lg: 30 };

// Icon in a tinted square, colored by the surrounding .habit-scope.
const HabitIcon = ({ icon, size = 'md' }) => (
    <span className={`habit-icon habit-icon--${size}`} aria-hidden="true">
        {/* The registry holds module-level components, so looking one up is safe */}
        {createElement(iconFor(icon), { size: ICON_SIZES[size], weight: 'regular' })}
    </span>
);

export default HabitIcon;
