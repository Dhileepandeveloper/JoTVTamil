function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  const cart = loadCart();
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '0.00';
    return;
  }
  container.innerHTML = '';
  let total = 0;
  for (const it of cart) {
    total += it.price * it.qty;
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div style="flex:1">${it.name} - $${it.price.toFixed(2)}</div>
      <div>
        <input type="number" class="qty" min="1" value="${it.qty}" data-id="${it.productId}"/>
        <button class="btn remove" data-id="${it.productId}">Remove</button>
      </div>
    `;
    row.querySelector('.qty').addEventListener('change', (e) => {
      updateQty(it.productId, Number(e.target.value) || 1);
      renderCart();
    });
    row.querySelector('.remove').addEventListener('click', () => {
      removeFromCart(it.productId);
      renderCart();
    });
    container.appendChild(row);
  }
  totalEl.textContent = total.toFixed(2);
}

async function checkout() {
  const cart = loadCart();
  if (cart.length === 0) return alert('Cart is empty');
  try {
    const order = await api.post('/api/orders', {
      items: cart.map(c => ({ productId: c.productId, qty: c.qty }))
    });
    clearCart();
    renderCart();
    alert('Order placed! Order ID: ' + order.id);
    window.location.href = '/orders.html';
  } catch (e) {
    alert('Please login before checkout.');
    window.location.href = '/login.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  document.getElementById('checkout-btn').addEventListener('click', checkout);
});
