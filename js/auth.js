/**
 * Authentication Module - Handles registration, login, and validation
 */

const Auth = {
  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword(password) {
    return password && password.length >= 6;
  },

  /**
   * Validate registration form
   */
  validateRegistration(formData) {
    const errors = {};

    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password || formData.password === '') {
      errors.password = 'Password is required';
    } else if (!this.isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword || formData.confirmPassword === '') {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  },

  /**
   * Validate login form
   */
  validateLogin(formData) {
    const errors = {};

    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password || formData.password === '') {
      errors.password = 'Password is required';
    }

    return errors;
  },

  /**
   * Handle registration
   */
  handleRegistration(event) {
    event.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value
    };

    const errors = this.validateRegistration(formData);

    if (Object.keys(errors).length > 0) {
      this.displayRegistrationErrors(errors);
      return;
    }

    const result = Storage.registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      alert(result.message);
      window.location.href = 'index.html';
    } else {
      alert(result.message);
    }
  },

  /**
   * Handle login
   */
  handleLogin(event) {
    event.preventDefault();

    const formData = {
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    };

    const errors = this.validateLogin(formData);

    if (Object.keys(errors).length > 0) {
      this.displayLoginErrors(errors);
      return;
    }

    const result = Storage.loginUser(formData.email, formData.password);

    if (result.success) {
      window.location.href = 'dashboard.html';
    } else {
      this.displayLoginError(result.message);
    }
  },

  /**
   * Display registration errors
   */
  displayRegistrationErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    Object.entries(errors).forEach(([field, message]) => {
      const input = document.getElementById(field);
      if (input) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.after(errorDiv);
      }
    });
  },

  /**
   * Display login errors
   */
  displayLoginErrors(errors) {
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    Object.entries(errors).forEach(([field, message]) => {
      const input = document.getElementById(field);
      if (input) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.after(errorDiv);
      }
    });
  },

  /**
   * Display login error message
   */
  displayLoginError(message) {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message general-error';
    errorDiv.textContent = message;
    document.querySelector('.login-form').prepend(errorDiv);
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return Storage.getCurrentUser() !== null;
  },

  /**
   * Ensure user is logged in (redirect if not)
   */
  ensureLoggedIn() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
    }
  },

  /**
   * Logout user
   */
  logout() {
    Storage.logoutUser();
    window.location.href = 'index.html';
  }
};
