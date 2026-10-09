
function renderWishlistPage() {
  const container = document.getElementById("wishlistProducts");
  if (!container) return;

  const ids = getWishlist();
  const items = PRODUCTS.filter(product => ids.includes(product.id));

  if (!items.length) {
    container.innerHTML = '<div class="empty-state"><h2>Здесь пока пусто ♡</h2><p>Добавляйте понравившиеся товары из каталога.</p><a class="btn btn-dark" href="catalog.html">Открыть каталог ↗</a></div>';
    return;
  }

  renderProductList("wishlistProducts", items);
}

document.addEventListener("DOMContentLoaded", renderWishlistPage);
document.addEventListener("nexora:wishlistChanged", renderWishlistPage);
document.addEventListener("nexora:currencyChanged", renderWishlistPage);