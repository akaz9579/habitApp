import React, { useState } from 'react';
import Dialog from './Dialog';

const ConfirmDialog = ({ title, message, confirmLabel, onConfirm, onCancel }) => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const confirm = async () => {
        setBusy(true);
        setError('');
        try {
            await onConfirm();
        } catch {
            setError('That did not work. Try again.');
            setBusy(false);
        }
    };

    return (
        <Dialog title={title} onClose={onCancel}>
            <p className="confirm__message">{message}</p>
            {error && (
                <p className="form__error" role="alert">
                    {error}
                </p>
            )}
            <div className="form__actions">
                <button type="button" className="btn btn--quiet" onClick={onCancel}>
                    Cancel
                </button>
                <button type="button" className="btn btn--danger-solid" onClick={confirm} disabled={busy}>
                    {busy ? 'Working' : confirmLabel}
                </button>
            </div>
        </Dialog>
    );
};

export default ConfirmDialog;
