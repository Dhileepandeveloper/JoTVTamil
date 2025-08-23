function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function loadProduct() {
  const id = getQueryParam('id');
  const container = document.getElementById('product-details');
  container.innerHTML = 'Loading...';
  try {
    const p = await api.get(`/api/products/${id}`);
    container.innerHTML = `
      <img src="${p.imageUrl}" alt="${p.name}"/>
      <div>
        <h2>${p.name}</h2>
        <div class="price">$${p.price.toFixed(2)}</div>
        <p>${p.description}</p>
        <label>Quantity <input type="number" id="qty" class="qty" value="1" min="1"/></label>
        <button class="btn" id="add">Add to Cart</button>
      </div>
    `;
    document.getElementById('add').addEventListener('click', () => {
      const qty = Number(document.getElementById('qty').value) || 1;
      addToCart(p, qty);
    });
  } catch (e) {
    container.innerHTML = `<div class="notice">Product not found</div>`;
  }
}

document.addEventListener('DOMContentLoaded', loadProduct);
