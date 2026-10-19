import React, { createElement, useState } from 'react';
import Dialog from './Dialog';
import { DEFAULT_ICON, HABIT_ICONS } from './icons';
import { DEFAULT_HABIT_COLOR, SWATCHES, colorValue, isSwatch } from '../theme/palette';

// Create and edit form. `habit` is set when editing.
const HabitForm = ({ habit, onSubmit, onCancel }) => {
    const [name, setName] = useState(habit?.name ?? '');
    const [description, setDescription] = useState(habit?.description ?? '');
    const [icon, setIcon] = useState(habit?.icon in HABIT_ICONS ? habit.icon : DEFAULT_ICON);
    const [color, setColor] = useState(habit?.color ?? DEFAULT_HABIT_COLOR);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const customColor = isSwatch(color) ? '#8a8a80' : color;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await onSubmit({ name: name.trim(), description: description.trim(), icon, color });
        } catch {
            setError('Could not save the habit. Check that the server is running and try again.');
            setSaving(false);
        }
    };

    return (
        <Dialog title={habit ? 'Edit habit' : 'New habit'} onClose={onCancel}>
            <form className="form habit-scope" style={{ '--habit': colorValue(color) }} onSubmit={handleSubmit}>
                <label className="field">
                    <span className="field__label">Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Read for 30 minutes"
                        required
                        autoFocus
                    />
                </label>

                <label className="field">
                    <span className="field__label">Description</span>
                    <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional"
                    />
                </label>

                <fieldset className="field">
                    <legend className="field__label">Color</legend>
                    <div className="swatches">
                        {SWATCHES.map((swatch) => (
                            <button
                                key={swatch.id}
                                type="button"
                                className={`swatch ${color === swatch.id ? 'is-active' : ''}`}
                                style={{ '--swatch': `var(--c-${swatch.id})` }}
                                aria-label={swatch.name}
                                aria-pressed={color === swatch.id}
                                onClick={() => setColor(swatch.id)}
                            />
                        ))}
                        <label
                            className={`swatch swatch--custom ${!isSwatch(color) ? 'is-active' : ''}`}
                            style={{ '--swatch': customColor }}
                            title="Custom color"
                        >
                            <span className="visually-hidden">Custom color</span>
                            <input type="color" value={customColor} onChange={(e) => setColor(e.target.value)} />
                        </label>
                    </div>
                </fieldset>

                <fieldset className="field">
                    <legend className="field__label">Icon</legend>
                    <div className="icon-picker">
                        {Object.entries(HABIT_ICONS).map(([key, iconComponent]) => (
                            <button
                                key={key}
                                type="button"
                                className={`icon-picker__item ${icon === key ? 'is-active' : ''}`}
                                aria-label={key.replace(/-/g, ' ')}
                                aria-pressed={icon === key}
                                onClick={() => setIcon(key)}
                            >
                                {createElement(iconComponent, { size: 20 })}
                            </button>
                        ))}
                    </div>
                </fieldset>

                {error && (
                    <p className="form__error" role="alert">
                        {error}
                    </p>
                )}

                <div className="form__actions">
                    <button type="button" className="btn btn--quiet" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn--primary" disabled={saving || !name.trim()}>
                        {saving ? 'Saving' : habit ? 'Save changes' : 'Create habit'}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

export default HabitForm;
