'use client';

import React, { forwardRef, useState } from 'react';
import { InputProps, InputValidation } from '@/types/components';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      error,
      success,
      warning,
      disabled = false,
      required = false,
      readOnly = false,
      autoComplete = 'off',
      autoFocus = false,
      className = '',
      containerClassName = '',
      labelClassName = '',
      errorClassName = '',
      successClassName = '',
      warningClassName = '',
      leftIcon,
      rightIcon,
      helperText,
      validation,
      showCharacterCount = false,
      maxLength,
      minLength,
      pattern,
      size = 'medium',
      variant = 'outline',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const [validationState, setValidationState] = useState<InputValidation | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      
      if (onChange) {
        onChange(e);
      }

      // Run validation if provided
      if (validation) {
        validateInput(newValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setIsTouched(true);
      
      if (onBlur) {
        onBlur(e);
      }

      // Validate on blur
      if (validation) {
        validateInput(e.target.value);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      if (onFocus) {
        onFocus(e);
      }
    };

    const validateInput = (value: string) => {
      if (!validation) return;

      const newValidation: InputValidation = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      // Required validation
      if (validation.required && !value.trim()) {
        newValidation.isValid = false;
        newValidation.errors.push(validation.requiredMessage || 'This field is required');
      }

      // Min length validation
      if (validation.minLength && value.length < validation.minLength) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.minLengthMessage || 
          `Must be at least ${validation.minLength} characters`
        );
      }

      // Max length validation
      if (validation.maxLength && value.length > validation.maxLength) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.maxLengthMessage || 
          `Cannot exceed ${validation.maxLength} characters`
        );
      }

      // Pattern validation
      if (validation.pattern && !validation.pattern.test(value)) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.patternMessage || 
          'Invalid format'
        );
      }

      // Custom validation
      if (validation.custom && !validation.custom(value)) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.customMessage || 
          'Invalid value'
        );
      }

      // Warning validation
      if (validation.warningPattern && validation.warningPattern.test(value)) {
        newValidation.warnings.push(
          validation.warningMessage || 
          'Warning: This value might be incorrect'
        );
      }

      setValidationState(newValidation);
    };

    // Determine input state
    const hasError = !!error || (validationState && !validationState.isValid);
    const hasSuccess = !!success || (validationState && validationState.isValid && isTouched);
    const hasWarning = !!warning || (validationState && validationState.warnings.length > 0);

    // Size classes
    const sizeClasses = {
      small: 'px-2 py-1 text-sm h-8',
      medium: 'px-3 py-2 text-base h-10',
      large: 'px-4 py-3 text-lg h-12',
    };

    // Variant classes
    const variantClasses = {
      outline: `border bg-transparent ${
        hasError
          ? 'border-error focus:border-error focus:ring-error'
          : hasSuccess
          ? 'border-success focus:border-success focus:ring-success'
          : hasWarning
          ? 'border-warning focus:border-warning focus:ring-warning'
          : 'border-border focus:border-primary focus:ring-primary'
      }`,
      filled: `border-b bg-surface ${
        hasError
          ? 'border-error focus:border-error focus:ring-error'
          : hasSuccess
          ? 'border-success focus:border-success focus:ring-success'
          : hasWarning
          ? 'border-warning focus:border-warning focus:ring-warning'
          : 'border-border focus:border-primary focus:ring-primary'
      }`,
      underline: `border-b bg-transparent ${
        hasError
          ? 'border-error'
          : hasSuccess
          ? 'border-success'
          : hasWarning
          ? 'border-warning'
          : 'border-border'
      } focus:border-primary`,
      ghost: 'bg-transparent focus:bg-surface',
    };

    // Base input classes
    const baseClasses = `
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${fullWidth ? 'w-full' : ''}
      rounded-lg
      transition-all
      duration-200
      outline-none
      focus:ring-2
      focus:ring-opacity-50
      disabled:opacity-50
      disabled:cursor-not-allowed
      read-only:bg-surface
      read-only:cursor-default
      placeholder:text-text-secondary
      placeholder:opacity-70
      ${className}
    `.trim();

    // Character count
    const characterCount = inputValue.length;
    const showCount = showCharacterCount && maxLength;

    return (
      <div className={`input-container ${containerClassName} ${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && (
          <label
            className={`
              block text-sm font-medium mb-1 text-text-primary
              ${hasError ? 'text-error' : ''}
              ${hasSuccess ? 'text-success' : ''}
              ${hasWarning ? 'text-warning' : ''}
              ${labelClassName}
            `.trim()}
            htmlFor={props.id}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            value={value !== undefined ? value : inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            className={`
              ${baseClasses}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${showCount ? 'pr-16' : ''}
            `.trim()}
            aria-invalid={hasError}
            aria-describedby={
              [error, helperText, validationState?.errors[0]]
                .filter(Boolean)
                .map((_, i) => `${props.id}-${i}`)
                .join(' ') || undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              {rightIcon}
            </div>
          )}

          {/* Character Count */}
          {showCount && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-text-secondary">
              {characterCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Helper Text & Validation Messages */}
        <div className="mt-1 space-y-1">
          {/* Helper Text */}
          {helperText && (
            <p
              id={`${props.id}-helper`}
              className={`text-xs text-text-secondary ${hasError ? 'text-error' : ''}`}
            >
              {helperText}
            </p>
          )}

          {/* Custom Error Message */}
          {error && (
            <p
              id={`${props.id}-error`}
              className={`text-xs text-error ${errorClassName}`}
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Custom Success Message */}
          {success && (
            <p
              id={`${props.id}-success`}
              className={`text-xs text-success ${successClassName}`}
            >
              {success}
            </p>
          )}

          {/* Custom Warning Message */}
          {warning && (
            <p
              id={`${props.id}-warning`}
              className={`text-xs text-warning ${warningClassName}`}
            >
              {warning}
            </p>
          )}

          {/* Validation Errors */}
          {validationState && validationState.errors.length > 0 && (
            <div className="space-y-1">
              {validationState.errors.map((errorMsg, index) => (
                <p
                  key={index}
                  id={`${props.id}-validation-error-${index}`}
                  className="text-xs text-error"
                  role="alert"
                >
                  {errorMsg}
                </p>
              ))}
            </div>
          )}

          {/* Validation Warnings */}
          {validationState && validationState.warnings.length > 0 && (
            <div className="space-y-1">
              {validationState.warnings.map((warningMsg, index) => (
                <p
                  key={index}
                  id={`${props.id}-validation-warning-${index}`}
                  className="text-xs text-warning"
                >
                  {warningMsg}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

// TextArea Component
export const TextArea = forwardRef<HTMLTextAreaElement, InputProps & { rows?: number }>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      error,
      success,
      warning,
      disabled = false,
      required = false,
      readOnly = false,
      autoComplete = 'off',
      autoFocus = false,
      className = '',
      containerClassName = '',
      labelClassName = '',
      errorClassName = '',
      successClassName = '',
      warningClassName = '',
      helperText,
      validation,
      showCharacterCount = false,
      maxLength,
      minLength,
      rows = 4,
      size = 'medium',
      variant = 'outline',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [textareaValue, setTextareaValue] = useState(value || '');
    const [validationState, setValidationState] = useState<InputValidation | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setTextareaValue(newValue);
      
      if (onChange) {
        onChange(e as any);
      }

      if (validation) {
        validateInput(newValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setIsTouched(true);
      
      if (onBlur) {
        onBlur(e as any);
      }

      if (validation) {
        validateInput(e.target.value);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      
      if (onFocus) {
        onFocus(e as any);
      }
    };

    const validateInput = (value: string) => {
      if (!validation) return;

      const newValidation: InputValidation = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      if (validation.required && !value.trim()) {
        newValidation.isValid = false;
        newValidation.errors.push(validation.requiredMessage || 'This field is required');
      }

      if (validation.minLength && value.length < validation.minLength) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.minLengthMessage || 
          `Must be at least ${validation.minLength} characters`
        );
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.maxLengthMessage || 
          `Cannot exceed ${validation.maxLength} characters`
        );
      }

      if (validation.pattern && !validation.pattern.test(value)) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.patternMessage || 
          'Invalid format'
        );
      }

      if (validation.custom && !validation.custom(value)) {
        newValidation.isValid = false;
        newValidation.errors.push(
          validation.customMessage || 
          'Invalid value'
        );
      }

      setValidationState(newValidation);
    };

    const hasError = !!error || (validationState && !validationState.isValid);
    const hasSuccess = !!success || (validationState && validationState.isValid && isTouched);
    const hasWarning = !!warning;

    const sizeClasses = {
      small: 'px-2 py-1 text-sm',
      medium: 'px-3 py-2 text-base',
      large: 'px-4 py-3 text-lg',
    };

    const variantClasses = {
      outline: `border bg-transparent ${
        hasError
          ? 'border-error focus:border-error focus:ring-error'
          : hasSuccess
          ? 'border-success focus:border-success focus:ring-success'
          : hasWarning
          ? 'border-warning focus:border-warning focus:ring-warning'
          : 'border-border focus:border-primary focus:ring-primary'
      }`,
      filled: `border-b bg-surface ${
        hasError
          ? 'border-error focus:border-error focus:ring-error'
          : hasSuccess
          ? 'border-success focus:border-success focus:ring-success'
          : hasWarning
          ? 'border-warning focus:border-warning focus:ring-warning'
          : 'border-border focus:border-primary focus:ring-primary'
      }`,
      underline: `border-b bg-transparent ${
        hasError
          ? 'border-error'
          : hasSuccess
          ? 'border-success'
          : hasWarning
          ? 'border-warning'
          : 'border-border'
      } focus:border-primary`,
      ghost: 'bg-transparent focus:bg-surface',
    };

    const baseClasses = `
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${fullWidth ? 'w-full' : ''}
      rounded-lg
      transition-all
      duration-200
      outline-none
      focus:ring-2
      focus:ring-opacity-50
      disabled:opacity-50
      disabled:cursor-not-allowed
      read-only:bg-surface
      read-only:cursor-default
      placeholder:text-text-secondary
      placeholder:opacity-70
      resize-y
      min-h-[80px]
      ${className}
    `.trim();

    const characterCount = textareaValue.length;
    const showCount = showCharacterCount && maxLength;

    return (
      <div className={`input-container ${containerClassName} ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            className={`
              block text-sm font-medium mb-1 text-text-primary
              ${hasError ? 'text-error' : ''}
              ${hasSuccess ? 'text-success' : ''}
              ${hasWarning ? 'text-warning' : ''}
              ${labelClassName}
            `.trim()}
            htmlFor={props.id}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            value={value !== undefined ? value : textareaValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            rows={rows}
            className={baseClasses}
            aria-invalid={hasError}
            aria-describedby={
              [error, helperText, validationState?.errors[0]]
                .filter(Boolean)
                .map((_, i) => `${props.id}-${i}`)
                .join(' ') || undefined
            }
            {...props}
          />

          {showCount && (
            <div className="absolute bottom-2 right-2 text-xs text-text-secondary bg-surface px-1 rounded">
              {characterCount}/{maxLength}
            </div>
          )}
        </div>

        <div className="mt-1 space-y-1">
          {helperText && (
            <p
              id={`${props.id}-helper`}
              className={`text-xs text-text-secondary ${hasError ? 'text-error' : ''}`}
            >
              {helperText}
            </p>
          )}

          {error && (
            <p
              id={`${props.id}-error`}
              className={`text-xs text-error ${errorClassName}`}
              role="alert"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              id={`${props.id}-success`}
              className={`text-xs text-success ${successClassName}`}
            >
              {success}
            </p>
          )}

          {warning && (
            <p
              id={`${props.id}-warning`}
              className={`text-xs text-warning ${warningClassName}`}
            >
              {warning}
            </p>
          )}

          {validationState && validationState.errors.length > 0 && (
            <div className="space-y-1">
              {validationState.errors.map((errorMsg, index) => (
                <p
                  key={index}
                  id={`${props.id}-validation-error-${index}`}
                  className="text-xs text-error"
                  role="alert"
                >
                  {errorMsg}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

// Select Component
export const Select = forwardRef<HTMLSelectElement, InputProps & { options: Array<{ value: string; label: string; disabled?: boolean }> }>(
  (
    {
      label,
      value,
      onChange,
      onBlur,
      onFocus,
      error,
      success,
      warning,
      disabled = false,
      required = false,
      className = '',
      containerClassName = '',
      labelClassName = '',
      errorClassName = '',
      successClassName = '',
      warningClassName = '',
      helperText,
      options,
      placeholder,
      size = 'medium',
      variant = 'outline',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectValue, setSelectValue] = useState(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setSelectValue(newValue);
      
      if (onChange) {
        onChange(e as any);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      
      if (onBlur) {
        onBlur(e as any);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      
      if (onFocus) {
        onFocus(e as any);
      }
    };

    const hasError = !!error;
    const hasSuccess = !!success;
    const hasWarning = !!warning;

    const sizeClasses = {
      small: 'px-2 py-1 text-sm h-8',
      medium: 'px-3 py-2 text-base h-10',
      large: 'px-4 py-3 text-lg h-12',
    };

    const variantClasses = {
      outline: `border bg-transparent ${
        hasError
          ? 'border-error focus:border-error focus:ring-error'
          : hasSuccess
          ? 'border-success focus:border-success focus:ring-success'
          : hasWarning
          ? 'border-warning focus:border-warning focus:ring-warning'
          : 'border-border focus:border-primary focus:ring-primary'
      }`,
      filled: `border-b bg-surface ${
        hasError
          ? 'border-error focus:border-error focus:ring-error'
          : hasSuccess
          ? 'border-success focus:border-success focus:ring-success'
          : hasWarning
          ? 'border-warning focus:border-warning focus:ring-warning'
          : 'border-border focus:border-primary focus:ring-primary'
      }`,
    };

    const baseClasses = `
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${fullWidth ? 'w-full' : ''}
      rounded-lg
      transition-all
      duration-200
      outline-none
      focus:ring-2
      focus:ring-opacity-50
      disabled:opacity-50
      disabled:cursor-not-allowed
      appearance-none
      bg-no-repeat
      bg-[length:1.5em_1.5em]
      bg-[right_0.5rem_center]
      pr-10
      ${className}
    `.trim();

    return (
      <div className={`input-container ${containerClassName} ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            className={`
              block text-sm font-medium mb-1 text-text-primary
              ${hasError ? 'text-error' : ''}
              ${hasSuccess ? 'text-success' : ''}
              ${hasWarning ? 'text-warning' : ''}
              ${labelClassName}
            `.trim()}
            htmlFor={props.id}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            value={value !== undefined ? value : selectValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            required={required}
            className={baseClasses}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            }}
            aria-invalid={hasError}
            aria-describedby={
              [error, helperText]
                .filter(Boolean)
                .map((_, i) => `${props.id}-${i}`)
                .join(' ') || undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 space-y-1">
          {helperText && (
            <p
              id={`${props.id}-helper`}
              className={`text-xs text-text-secondary ${hasError ? 'text-error' : ''}`}
            >
              {helperText}
            </p>
          )}

          {error && (
            <p
              id={`${props.id}-error`}
              className={`text-xs text-error ${errorClassName}`}
              role="alert"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              id={`${props.id}-success`}
              className={`text-xs text-success ${successClassName}`}
            >
              {success}
            </p>
          )}

          {warning && (
            <p
              id={`${props.id}-warning`}
              className={`text-xs text-warning ${warningClassName}`}
            >
              {warning}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';