import React, { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';

// Modal built on the native <dialog>, which handles focus and Escape.
const Dialog = ({ title, onClose, children, className = '' }) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (el && !el.open) el.showModal();
    }, []);

    return (
        <dialog
            ref={ref}
            className={`dialog ${className}`}
            aria-labelledby="dialog-title"
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            onClick={(e) => {
                // A click on the backdrop lands on the dialog element itself.
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="dialog__inner">
                <div className="dialog__head">
                    <h2 id="dialog-title">{title}</h2>
                    <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </dialog>
    );
};

export default Dialog;
