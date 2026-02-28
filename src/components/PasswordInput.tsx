'use client';

import React, { useState, useCallback } from 'react';
import { validatePasswordStrength } from '@/lib/auth-guard';

type StrengthType = 'weak' | 'fair' | 'good' | 'strong';

interface ValidationResult {
  isValid: boolean;
  strength: StrengthType;
  feedback: string[];
}

interface PasswordInputProps {
  value: string;
  onChangeAction: (value: string) => void;
  onValidChangeAction?: (isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  showValidation?: boolean;
}

const initialValidation: ValidationResult = {
  isValid: false,
  strength: 'weak',
  feedback: [],
};

export function PasswordInput({
  value,
  onChangeAction,
  onValidChangeAction,
  placeholder = 'Password',
  required = true,
  showValidation = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>(initialValidation);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChangeAction(newValue);

      if (showValidation && newValue.length > 0) {
        const result = validatePasswordStrength(newValue);
        setValidation({
          isValid: result.isValid,
          strength: (result.strength as StrengthType),
          feedback: result.feedback,
        });
        onValidChangeAction?.(result.isValid);
      } else {
        setValidation(initialValidation);
        onValidChangeAction?.(false);
      }
    },
    [onChangeAction, onValidChangeAction, showValidation]
  );

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStrengthLabel = (strength: string) => {
    const labels = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };
    return labels[strength as keyof typeof labels] || 'Weak';
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            validation.isValid ? 'border-green-300 focus:ring-green-500' : 'border-gray-300 focus:ring-primary-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      {showValidation && value.length > 0 && (
        <div className="space-y-2">
          {/* Strength Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${getStrengthColor(validation.strength)}`}
                style={{
                  width: {
                    weak: '25%',
                    fair: '50%',
                    good: '75%',
                    strong: '100%',
                  }[validation.strength] || '25%',
                }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-600 w-12">{getStrengthLabel(validation.strength)}</span>
          </div>

          {/* Feedback */}
          {validation.feedback.length > 0 && (
            <div className="text-sm space-y-1">
              {validation.feedback.map((feedback, index) => (
                <div key={index} className="flex items-start gap-2 text-red-600">
                  <span className="text-xs mt-0.5">✗</span>
                  <span className="text-xs">{feedback}</span>
                </div>
              ))}
            </div>
          )}

          {validation.isValid && (
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-xs">✓</span>
              <span className="text-xs font-medium">Password meets security requirements</span>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Password must contain at least 8 characters, uppercase, lowercase, number, and special character.
      </p>
    </div>
  );
}
