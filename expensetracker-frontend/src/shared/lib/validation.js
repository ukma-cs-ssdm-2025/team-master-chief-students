export const validators = {
  required: (value, message = 'This field is required') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return null;
  },

  email: (value, message = 'Invalid email format') => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? message : null;
  },

  minLength: (min) => (value, message) => {
    if (!value) return null;
    const msg = message || `Minimum length is ${min} characters`;
    return value.length < min ? msg : null;
  },

  maxLength: (max) => (value, message) => {
    if (!value) return null;
    const msg = message || `Maximum length is ${max} characters`;
    return value.length > max ? msg : null;
  },

  positiveNumber: (value, message = 'Must be a positive number') => {
    if (!value) return null;
    const num = Number(value);
    return isNaN(num) || num <= 0 ? message : null;
  },

  number: (value, message = 'Must be a valid number') => {
    if (!value) return null;
    return isNaN(Number(value)) ? message : null;
  },

  password: (value, message = 'Password must be at least 6 characters') => {
    if (!value) return null;
    return value.length < 6 ? message : null;
  },

  passwordMatch: (password) => (value, message = 'Passwords do not match') => {
    if (!value) return null;
    return value !== password ? message : null;
  },

  date: (value, message = 'Invalid date format') => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? message : null;
  },

  notFuture: (value, message = 'Date cannot be in the future') => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today ? message : null;
  },

  maxAmount: (max) => (value, message) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) return null;
    const msg = message || `Amount must not exceed ${max}`;
    return num > max ? msg : null;
  },
};


export const validate = (value, validatorList) => {
  if (!Array.isArray(validatorList)) {
    return null;
  }

  for (const validator of validatorList) {
    if (typeof validator === 'function') {
      const error = validator(value);
      if (error) return error;
    }
  }

  return null;
};

export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const value = formData[field];
    const rules = validationRules[field];
    const error = validate(value, rules);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

