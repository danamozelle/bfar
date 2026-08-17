const form = document.getElementById('auth-form');
const title = document.getElementById('form-title');
const subhead = document.getElementById('form-subhead');
const note = document.getElementById('form-note');
const nameField = document.getElementById('name-field');
const confirmField = document.getElementById('confirm-field');
const rememberRow = document.getElementById('remember-row');
const switchBtn = document.getElementById('switch-mode');
const switchPrompt = document.getElementById('switch-prompt');
const submitLabel = document.getElementById('submit-label');
const submitBtn = document.getElementById('submit-btn');
const pwToggle = document.getElementById('pw-toggle');
const pwInput = document.getElementById('password');
const pwIcon = document.getElementById('pw-icon');

let mode = 'login'; // or 'register'

// Password validation function
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('at least 1 uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('at least 1 lowercase letter');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('at least 1 special character');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Show password requirements on focus
pwInput.addEventListener('focus', function() {
    if (mode === 'register') {
        const requirements = document.getElementById('password-requirements');
        if (requirements) {
            requirements.style.display = 'block';
        }
    }
});

pwInput.addEventListener('blur', function() {
    setTimeout(() => {
        const requirements = document.getElementById('password-requirements');
        if (requirements) {
            requirements.style.display = 'none';
        }
    }, 2000);
});

// Real-time password validation
pwInput.addEventListener('input', function() {
    if (mode === 'register') {
        const password = this.value;
        const result = validatePassword(password);
        const requirements = document.getElementById('password-requirements');
        
        if (requirements && password.length > 0) {
            const items = requirements.querySelectorAll('li');
            // Update each requirement
            const checks = [
                { condition: password.length >= 8, index: 0 },
                { condition: /[A-Z]/.test(password), index: 1 },
                { condition: /[a-z]/.test(password), index: 2 },
                { condition: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), index: 3 }
            ];
            
            checks.forEach(({ condition, index }) => {
                if (items[index]) {
                    items[index].style.color = condition ? '#1E7A4A' : '#8A1620';
                    items[index].style.textDecoration = condition ? 'line-through' : 'none';
                }
            });
        }
    }
});

function setMode(next) {
  mode = next;
  const isRegister = mode === 'register';

  // Update title
  title.textContent = isRegister ? 'Create an account' : 'Log in to your account';
  
  // Update subhead (make sure the element exists in HTML)
  if (subhead) {
    subhead.textContent = isRegister
      ? 'Register to access fisherfolk registration, permits, and reporting services.'
      : 'Access fisherfolk registration, permits, and reporting services.';
  }
  
  // Show/hide fields (Force display: none to override grid display)
  if (isRegister) {
      nameField.style.display = 'grid';
      nameField.hidden = false;
      
      confirmField.style.display = 'block';
      confirmField.hidden = false;
      
      rememberRow.hidden = true;
  } else {
      nameField.style.display = 'none';
      nameField.hidden = true;
      
      confirmField.style.display = 'none';
      confirmField.hidden = true;
      
      rememberRow.hidden = false;
  }
  
  // Update button text
  submitLabel.textContent = isRegister ? 'Create account' : 'Log in';
  
  // Update switch text
  switchPrompt.textContent = isRegister ? 'Already have an account?' : "Don't have an account?";
  switchBtn.textContent = isRegister ? 'Log in' : 'Register';
  
  // Update password autocomplete
  pwInput.autocomplete = isRegister ? 'new-password' : 'current-password';
  
  // Hide password requirements when switching to login
  const requirements = document.getElementById('password-requirements');
  if (requirements) {
      requirements.style.display = 'none';
  }
  
  // Clear any previous notes
  hideNote();
}

// Event listener for switch button
switchBtn.addEventListener('click', function() {
    setMode(mode === 'login' ? 'register' : 'login');
});

// Password toggle
pwToggle.addEventListener('click', () => {
  const showing = pwInput.type === 'text';
  pwInput.type = showing ? 'password' : 'text';
  pwToggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  pwIcon.innerHTML = showing
    ? '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>'
    : '<path d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M6.5 6.7C3.9 8.4 2 12 2 12s4 7 11 7c1.8 0 3.4-.4 4.8-1.1M17.5 5.5C16 4.7 14.1 4 12 4c-.8 0-1.5.1-2.2.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
});

function showNote(message, kind = 'error') {
  note.textContent = message;
  note.hidden = false;
  note.classList.toggle('ok', kind === 'ok');
}

function hideNote() {
  note.hidden = true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideNote();

  const email = document.getElementById('email').value.trim();
  const password = pwInput.value;
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const confirm = document.getElementById('confirm').value;

  // Password validation for registration
  if (mode === 'register') {
      const result = validatePassword(password);
      if (!result.valid) {
          showNote('Password must contain: ' + result.errors.join(', '));
          return;
      }
      
      if (password !== confirm) {
          showNote('Passwords do not match.');
          return;
      }
  }

  submitBtn.disabled = true;
  const originalLabel = submitLabel.textContent;
  submitLabel.textContent = mode === 'register' ? 'Creating account…' : 'Logging in…';

  try {
    // Bypassing .htaccess completely by pointing directly to the .php file
    const endpoint = mode === 'register' ? '/bfar-portal/register.php' : '/bfar-portal/login.php';
    
    const body = mode === 'register' 
      ? { email, password, firstName, lastName } 
      : { email, password };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      showNote(data.error || 'Something went wrong. Please try again.');
      return;
    }

    const displayName = data.user.firstName || data.user.email;
    showNote(`Welcome, ${displayName}.`, 'ok');
    window.location.href = '/bfar-portal/dashboard.html';
  } catch (err) {
    console.error(err);
    showNote('Error: ' + err.message);
} finally {
    submitBtn.disabled = false;
    submitLabel.textContent = originalLabel;
  }
});

// Force the page to start in Login mode immediately
setMode('login');