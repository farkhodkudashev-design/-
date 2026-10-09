
document.addEventListener("DOMContentLoaded", () => {
  renderProductList(
    "dealsGrid",
    PRODUCTS
      .filter(p => p.oldPrice > p.price)
      .sort((a, b) =>
        (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)
      )
  );
});

document.addEventListener("nexora:currencyChanged", () => {
  renderProductList(
    "dealsGrid",
    PRODUCTS.filter(p => p.oldPrice > p.price)
  );
});