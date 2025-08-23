document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await api.post('/api/login', { email, password });
    window.location.href = '/';
  } catch (e) {
    alert('Login failed');
  }
});
