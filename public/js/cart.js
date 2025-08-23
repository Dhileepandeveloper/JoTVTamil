// Simple cart store using localStorage
const CART_KEY = 'cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product, qty = 1) {
  const cart = loadCart();
  const found = cart.find(i => i.productId === product.id);
  if (found) found.qty += qty;
  else cart.push({ productId: product.id, name: product.name, price: product.price, qty });
  saveCart(cart);
  alert('Added to cart');
}

function removeFromCart(productId) {
  const cart = loadCart().filter(i => i.productId !== productId);
  saveCart(cart);
}

function updateQty(productId, qty) {
  const cart = loadCart();
  const it = cart.find(i => i.productId === productId);
  if (it) {
    it.qty = Math.max(1, Number(qty) || 1);
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const total = loadCart().reduce((sum, i) => sum + i.qty, 0);
    countEl.textContent = total;
  }
}
