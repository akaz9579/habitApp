import React, { useState } from 'react';
import { LockSimple } from '@phosphor-icons/react';

// Shown when the hosted API asks for a passcode. The passcode is saved on
// this device, so it only has to be entered once.
const PasscodeScreen = ({ wrong, onSubmit }) => {
    const [code, setCode] = useState('');

    return (
        <form
            className="state passcode"
            onSubmit={(e) => {
                e.preventDefault();
                if (code) onSubmit(code);
            }}
        >
            <LockSimple size={32} />
            <h2>Enter your passcode</h2>
            <p>This device will remember it.</p>
            <input
                type="password"
                className="passcode__input"
                autoComplete="current-password"
                aria-label="Passcode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoFocus
            />
            {wrong && (
                <p className="form__error" role="alert">
                    That passcode did not work. Try again.
                </p>
            )}
            <button type="submit" className="btn btn--primary" disabled={!code}>
                Unlock
            </button>
        </form>
    );
};

export default PasscodeScreen;
