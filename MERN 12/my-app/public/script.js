document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const user = document.getElementById('user').value;
  
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
  
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName, email, password, user }),
        });
  
        if (response.ok) {
          document.getElementById('registerMessage').textContent = 'Successfully registered! Please go to the login page.';
        } else {
          const message = await response.text();
          alert(message);
        }
      });
    }
  
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const user = document.getElementById('loginUser').value;
  
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, user }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('email', email);
          localStorage.setItem('fullName', data.fullName);
          window.location.href = data.redirectUrl;
        } else {
          const message = await response.text();
          document.getElementById('loginMessage').textContent = message;
        }
      });
    }
  });
  