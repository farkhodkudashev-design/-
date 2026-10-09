
function renderBestSellers() {
  const items = [...PRODUCTS]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 16);

  renderProductList("bestSellersGrid", items);
}

document.addEventListener("DOMContentLoaded", renderBestSellers);
document.addEventListener("nexora:currencyChanged", renderBestSellers);
document.addEventListener("nexora:wishlistChanged", renderBestSellers);