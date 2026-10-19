import React from 'react';

const Block = ({ className = '' }) => <span className={`skeleton ${className}`} />;

export const HabitCardSkeleton = () => (
    <div className="habit-card habit-card--skeleton" aria-hidden="true">
        <div className="habit-card__head">
            <span className="habit-card__title">
                <Block className="skeleton--icon" />
                <Block className="skeleton--text" />
            </span>
            <Block className="skeleton--check" />
        </div>
        <Block className="skeleton--grid" />
    </div>
);

export const CompactSkeleton = () => (
    <div className="compact-card compact-card--skeleton" aria-hidden="true">
        <Block className="skeleton--text" />
        <Block className="skeleton--month" />
    </div>
);

export const RowSkeleton = () => (
    <div className="habit-row habit-row--skeleton" aria-hidden="true">
        <Block className="skeleton--icon-sm" />
        <Block className="skeleton--text" />
        <Block className="skeleton--check-sm" />
    </div>
);

const SKELETONS = { grid: HabitCardSkeleton, compact: CompactSkeleton, list: RowSkeleton };

export const ViewSkeleton = ({ view, count = 3 }) => {
    const Item = SKELETONS[view] ?? HabitCardSkeleton;
    return (
        <div className={`view view--${view}`} role="status" aria-label="Loading habits">
            {Array.from({ length: count }, (_, i) => (
                <Item key={i} />
            ))}
        </div>
    );
};
