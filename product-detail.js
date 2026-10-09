
let selectedProduct = null;
let selectedQuantity = 1;

function renderProductDetail() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  selectedProduct = PRODUCTS.find(product => product.id === id) || PRODUCTS[0];

  if (!selectedProduct) {
    document.getElementById("productDetail").textContent = "Товар не найден.";
    return;
  }

  const p = selectedProduct;
  document.title = p.name + " — NEXORA";

  document.getElementById("breadcrumb").textContent = p.name;
  document.getElementById("detailImage").src = p.image;
  document.getElementById("detailImage").alt = p.name;
  document.getElementById("detailBrand").textContent = p.brand;
  document.getElementById("detailName").textContent = p.name;
  document.getElementById("detailRating").textContent = p.rating.toFixed(1);
  document.getElementById("detailReviews").textContent = `(${p.reviews} отзывов)`;
  document.getElementById("detailPrice").textContent = formatPrice(p.price);
  document.getElementById("detailOldPrice").textContent = formatPrice(p.oldPrice);
  document.getElementById("detailStock").textContent =
    p.stock > 0 ? `✓ В наличии: ${p.stock} шт.` : "Нет в наличии";
  document.getElementById("specBrand").textContent = p.brand;
  document.getElementById("specCategory").textContent =
    CATEGORIES.find(c => c.id === p.category)?.name || p.category;
  document.getElementById("specId").textContent = "NX-" + String(p.id).padStart(5, "0");

  renderProductList(
    "relatedProducts",
    PRODUCTS.filter(item => item.category === p.category && item.id !== p.id).slice(0, 4)
  );

  updateQuantity();
}

function updateQuantity() {
  document.getElementById("quantityValue").textContent = selectedQuantity;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("productDetail")) return;

  renderProductDetail();

  document.getElementById("quantityMinus").addEventListener("click", () => {
    selectedQuantity = Math.max(1, selectedQuantity - 1);
    updateQuantity();
  });

  document.getElementById("quantityPlus").addEventListener("click", () => {
    selectedQuantity = Math.min(selectedProduct.stock, selectedQuantity + 1);
    updateQuantity();
  });

  document.getElementById("addDetailCart").addEventListener("click", () => {
    if (!selectedProduct.stock) return showToast("Товара нет в наличии.");

    for (let i = 0; i < selectedQuantity; i++) {
      addToCart(selectedProduct.id);
    }
  });

  document.getElementById("buyNow").addEventListener("click", () => {
    if (!selectedProduct.stock) return showToast("Товара нет в наличии.");

    for (let i = 0; i < selectedQuantity; i++) {
      addToCart(selectedProduct.id);
    }
    location.href = "checkout.html";
  });

  document.getElementById("detailFavorite").addEventListener("click", () => {
    toggleWishlist(selectedProduct.id);
  });
});

document.addEventListener("nexora:currencyChanged", () => {
  if (selectedProduct) renderProductDetail();
});