import { validators, validate, validateForm } from './validation';

const validateEmail = (email) => {
  const error = validate(email, [
    validators.required('Email is required'),
    validators.email('Invalid email format'),
  ]);
  return error;
};

const validateLoginForm = (formData) => {
  const rules = {
    email: [
      validators.required('Email is required'),
      validators.email('Invalid email format'),
    ],
    password: [
      validators.required('Password is required'),
      validators.password('Password must be at least 6 characters'),
    ],
  };

  return validateForm(formData, rules);
};

const validateRegisterForm = (formData) => {
  const rules = {
    username: [
      validators.required('Username is required'),
      validators.minLength(3)('Username must be at least 3 characters'),
      validators.maxLength(20)('Username must be less than 20 characters'),
    ],
    email: [
      validators.required('Email is required'),
      validators.email('Invalid email format'),
    ],
    password: [
      validators.required('Password is required'),
      validators.password('Password must be at least 6 characters'),
    ],
    confirmPassword: [
      validators.required('Please confirm your password'),
      validators.passwordMatch(formData.password)('Passwords do not match'),
    ],
  };

  return validateForm(formData, rules);
};

const validateExpenseForm = (formData) => {
  const rules = {
    categoryId: [
      validators.required('Category is required'),
    ],
    description: [
      validators.required('Description is required'),
      validators.minLength(3)('Description must be at least 3 characters'),
    ],
    amount: [
      validators.required('Amount is required'),
      validators.positiveNumber('Amount must be a positive number'),
    ],
    date: [
      validators.required('Date is required'),
      validators.date('Invalid date format'),
      validators.notFuture('Date cannot be in the future'),
    ],
  };

  return validateForm(formData, rules);
};

/*
import { validateForm, validators } from '@shared/lib/validation';

const MyForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationRules = {
      email: [
        validators.required('Email is required'),
        validators.email('Invalid email format'),
      ],
      password: [
        validators.required('Password is required'),
        validators.password('Password must be at least 6 characters'),
      ],
    };

    const { errors, isValid } = validateForm(formData, validationRules);

    if (!isValid) {
      setErrors(errors);
      return;
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <span className="error">{errors.password}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
*/

export {
  validateEmail,
  validateLoginForm,
  validateRegisterForm,
  validateExpenseForm,
};

