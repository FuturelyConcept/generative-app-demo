'use client';

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface FormField {
  name: string;
  type: string;
  required: boolean;
  label: string;
  options?: string[];
  min?: number;
  max?: number;
}

interface ProductFormProps {
  title: string;
  fields: FormField[];
  submitEndpoint: string;
  submitMethod: string;
  userRole: string;
  theme: { color: string; style: string };
  onAction?: (action: string, data?: any) => void;
  onClose?: () => void;
}

export function ProductForm({ 
  title, 
  fields, 
  submitEndpoint, 
  submitMethod, 
  userRole, 
  theme, 
  onAction,
  onClose 
}: ProductFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'number' && formData[field.name] !== undefined) {
        const value = Number(formData[field.name]);
        if (isNaN(value)) {
          newErrors[field.name] = `${field.label} must be a valid number`;
        } else if (field.min !== undefined && value < field.min) {
          newErrors[field.name] = `${field.label} must be at least ${field.min}`;
        } else if (field.max !== undefined && value > field.max) {
          newErrors[field.name] = `${field.label} must be at most ${field.max}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:8000${submitEndpoint}`, {
        method: submitMethod,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': userRole,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const result = await response.json();
        onAction?.('form_success', { data: result, formData });
        
        // Reset form
        setFormData({});
        onClose?.();
      } else {
        const error = await response.json();
        onAction?.('form_error', { error: error.message });
      }
    } catch (error) {
      onAction?.('form_error', { error: String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeClasses = () => {
    const colorMap = {
      red: 'border-red-200 bg-red-50',
      green: 'border-green-200 bg-green-50',
      blue: 'border-blue-200 bg-blue-50',
      gray: 'border-gray-200 bg-gray-50'
    };
    return colorMap[theme.color as keyof typeof colorMap] || colorMap.blue;
  };

  const getButtonClasses = (variant: 'primary' | 'secondary') => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
    
    if (variant === 'primary') {
      const colorMap = {
        red: `${baseClasses} bg-red-600 text-white hover:bg-red-700`,
        green: `${baseClasses} bg-green-600 text-white hover:bg-green-700`,
        blue: `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`,
        gray: `${baseClasses} bg-gray-600 text-white hover:bg-gray-700`
      };
      return colorMap[theme.color as keyof typeof colorMap] || colorMap.blue;
    }
    
    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  };

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.name}`;
    const hasError = errors[field.name];
    
    const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-300' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'select':
        return (
          <select
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={inputClasses}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={inputClasses}
            required={field.required}
            min={field.min}
            max={field.max}
            step="0.01"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={inputClasses}
            required={field.required}
            rows={3}
          />
        );
      
      default:
        return (
          <input
            type={field.type}
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={inputClasses}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow ${getThemeClasses()} border`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              AI-Generated for {userRole}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label 
                htmlFor={`field-${field.name}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={getButtonClasses('secondary')}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${getButtonClasses('primary')} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline mr-2" />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          🤖 Dynamic form generated by AI • Method: {submitMethod} • Role: {userRole}
        </p>
      </div>
    </div>
  );
}