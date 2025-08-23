async function loadOrders() {
  const container = document.getElementById('orders');
  container.innerHTML = 'Loading...';
  try {
    const orders = await api.get('/api/orders');
    if (orders.length === 0) {
      container.innerHTML = '<p>No orders yet.</p>';
      return;
    }
    container.innerHTML = '';
    for (const o of orders) {
      const div = document.createElement('div');
      div.className = 'card';
      const itemsHtml = o.items.map(i => `<li>${i.name} x ${i.qty} ($${i.price.toFixed(2)})</li>`).join('');
      div.innerHTML = `
        <div class="p">
          <h3>Order #${o.id}</h3>
          <p>Status: ${o.status}</p>
          <ul>${itemsHtml}</ul>
          <p><strong>Total: $${o.total.toFixed(2)}</strong></p>
          <small>${new Date(o.createdAt).toLocaleString()}</small>
        </div>
      `;
      container.appendChild(div);
    }
  } catch (e) {
    container.innerHTML = '<p>Please login to see your orders.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadOrders);
