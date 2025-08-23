// Helper for API requests
const api = {
  get: async (path) => {
    const res = await fetch(path, { credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (path, data) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

// UI helpers (auth state in nav)
async function refreshNav() {
  try {
    const me = await api.get('/api/me');
    document.getElementById('login-link').style.display = 'none';
    document.getElementById('register-link').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('logout-btn').onclick = async () => {
      await api.post('/api/logout', {});
      location.reload();
    };
  } catch {
    document.getElementById('login-link').style.display = 'inline-block';
    document.getElementById('register-link').style.display = 'inline-block';
    document.getElementById('logout-btn').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  refreshNav();
  updateCartCount();
});
