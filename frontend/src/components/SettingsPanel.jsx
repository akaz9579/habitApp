import React from 'react';
import Dialog from './Dialog';
import { PRESETS, systemPreset } from '../theme/themes';
import { SWATCHES } from '../theme/palette';
import { useSettings } from '../theme/SettingsContext';

const Segmented = ({ label, options, value, onChange }) => (
    <div className="segmented" role="group" aria-label={label}>
        {options.map((opt) => (
            <button
                key={String(opt.value)}
                type="button"
                className={`segmented__item mono ${value === opt.value ? 'is-active' : ''}`}
                aria-pressed={value === opt.value}
                onClick={() => onChange(opt.value)}
            >
                {opt.label}
            </button>
        ))}
    </div>
);

const SettingsPanel = ({ onClose }) => {
    const { settings, update } = useSettings();

    return (
        <Dialog title="Settings" onClose={onClose} className="dialog--settings">
            <section className="settings__section">
                <h3 className="settings__label mono">Theme</h3>
                <div className="theme-tiles">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            className={`theme-tile ${settings.preset === preset.id ? 'is-active' : ''}`}
                            aria-pressed={settings.preset === preset.id}
                            onClick={() => update({ preset: preset.id })}
                        >
                            {/* The preview carries the preset's own tokens */}
                            <span
                                className="theme-tile__preview"
                                data-theme={preset.id === 'system' ? systemPreset() : preset.id}
                                data-accent={settings.accent}
                            >
                                <span className="theme-tile__surface" />
                                <span className="theme-tile__accent" />
                            </span>
                            <span className="theme-tile__name">{preset.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="settings__section">
                <h3 className="settings__label mono">Accent</h3>
                <div className="swatches">
                    {SWATCHES.map((swatch) => (
                        <button
                            key={swatch.id}
                            type="button"
                            className={`swatch ${settings.accent === swatch.id ? 'is-active' : ''}`}
                            style={{ '--swatch': `var(--c-${swatch.id})` }}
                            aria-label={swatch.name}
                            aria-pressed={settings.accent === swatch.id}
                            onClick={() => update({ accent: swatch.id })}
                        />
                    ))}
                </div>
                <label className="toggle">
                    <input
                        type="checkbox"
                        checked={settings.singleColor}
                        onChange={(e) => update({ singleColor: e.target.checked })}
                    />
                    <span className="toggle__track" aria-hidden="true" />
                    <span>Use the accent color for every habit</span>
                </label>
            </section>

            <section className="settings__section">
                <h3 className="settings__label mono">Grid weeks</h3>
                <Segmented
                    label="Grid weeks"
                    value={settings.gridWeeks}
                    onChange={(gridWeeks) => update({ gridWeeks })}
                    options={[
                        { value: 'auto', label: 'Auto' },
                        { value: 12, label: '12' },
                        { value: 26, label: '26' },
                        { value: 52, label: '52' },
                    ]}
                />
            </section>

            <section className="settings__section">
                <h3 className="settings__label mono">Week starts on</h3>
                <Segmented
                    label="Week starts on"
                    value={settings.weekStartsOn}
                    onChange={(weekStartsOn) => update({ weekStartsOn })}
                    options={[
                        { value: 0, label: 'Sun' },
                        { value: 1, label: 'Mon' },
                    ]}
                />
            </section>
        </Dialog>
    );
};

export default SettingsPanel;
