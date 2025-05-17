import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
    type = 'text',
    label,
    error,
    icon,
    className = '',
    fullWidth = false,
    disabled = false,
    required = false,
    helperText,
    ...props
}, ref) => {
    const containerClasses = [
        'input-container',
        fullWidth ? 'input-full' : '',
        error ? 'input-error' : '',
        disabled ? 'input-disabled' : '',
        className
    ].filter(Boolean).join(' ');

    const inputClasses = [
        'input-field',
        icon ? 'input-with-icon' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    ref={ref}
                    type={type}
                    className={inputClasses}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
            </div>

            {(error || helperText) && (
                <span className={`input-message ${error ? 'input-error-message' : 'input-helper-text'}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input; 