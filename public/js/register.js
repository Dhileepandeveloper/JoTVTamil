document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await api.post('/api/register', { name, email, password });
    window.location.href = '/';
  } catch (e) {
    alert('Registration failed');
  }
});
