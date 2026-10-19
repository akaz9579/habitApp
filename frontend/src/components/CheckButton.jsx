import React from 'react';
import { Check } from '@phosphor-icons/react';

const CheckButton = ({ done, pending, onClick, label, size = 'md' }) => (
    <button
        type="button"
        className={`check-btn check-btn--${size} ${done ? 'is-done' : ''}`}
        aria-pressed={done}
        aria-label={label}
        aria-busy={pending || undefined}
        disabled={pending}
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
    >
        <Check size={size === 'sm' ? 16 : 22} weight="bold" />
    </button>
);

export default CheckButton;
