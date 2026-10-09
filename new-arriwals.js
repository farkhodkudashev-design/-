
function renderNewArrivals() {
  const items = PRODUCTS
    .filter(product => product.badge === "Новинка")
    .sort((a, b) => b.id - a.id);

  renderProductList("newArrivalsGrid", items);
}

document.addEventListener("DOMContentLoaded", renderNewArrivals);
document.addEventListener("nexora:currencyChanged", renderNewArrivals);
document.addEventListener("nexora:wishlistChanged", renderNewArrivals);