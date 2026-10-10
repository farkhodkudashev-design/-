
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("nexora_cart") || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("nexora_cart", JSON.stringify(cart));
  updateCartCount();
  document.dispatchEvent(new CustomEvent("nexora:cartChanged"));
}

function addToCart(productId, quantity = 1) {
  const id = Number(productId);
  const product = PRODUCTS.find(item => item.id === id);
  if (!product || product.stock < 1) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity = Math.min(product.stock, existing.quantity + quantity);
  } else {
    cart.push({ id, quantity: Math.min(product.stock, Math.max(1, quantity)) });
  }

  saveCart(cart);
  if (typeof showToast === "function") showToast("Товар добавлен в корзину");
}

function changeCartQuantity(productId, difference) {
  const id = Number(productId);
  const cart = getCart();
  const item = cart.find(entry => entry.id === id);
  if (!item) return;

  const product = PRODUCTS.find(entry => entry.id === id);
  item.quantity += difference;
  if (item.quantity < 1 || !product || product.stock < 1) {
    saveCart(cart.filter(entry => entry.id !== id));
    return;
  }

  item.quantity = Math.min(item.quantity, product.stock);
  saveCart(cart);
}

function removeFromCart(productId) {
  const id = Number(productId);
  saveCart(getCart().filter(item => item.id !== id));
}

function updateCartCount() {
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.textContent = getCart().reduce((total, item) => total + item.quantity, 0);
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);