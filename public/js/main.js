async function loadProducts() {
  const container = document.getElementById('products');
  container.innerHTML = 'Loading...';
  try {
    const products = await api.get('/api/products');
    container.innerHTML = '';
    for (const p of products) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.imageUrl}" alt="${p.name}"/>
        <div class="p">
          <h3>${p.name}</h3>
          <div class="price">$${p.price.toFixed(2)}</div>
          <p>${p.description}</p>
          <div style="display:flex;gap:8px;margin-top:8px">
            <a class="btn" href="/product.html?id=${p.id}">View</a>
            <button class="btn" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>
      `;
      card.querySelector('button').addEventListener('click', async () => {
        addToCart(p, 1);
      });
      container.appendChild(card);
    }
  } catch (e) {
    container.innerHTML = `<div class="notice">Failed to load products</div>`;
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
