
let catalogState = {
  category: new URLSearchParams(location.search).get("category") || "",
  brand: new URLSearchParams(location.search).get("brand") || "",
  query: new URLSearchParams(location.search).get("q") || "",
  sort: new URLSearchParams(location.search).get("sort") || "popular",
  min: 0,
  max: 25000000,
  rating: 0,
  stock: false,
  discount: false
};

function initCatalogFilters() {
  const categoryContainer = document.getElementById("categoryFilters");
  const brandContainer = document.getElementById("brandFilters");

  if (categoryContainer) {
    CATEGORIES.forEach(category => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = category.id;
      checkbox.checked = catalogState.category === category.id;

      checkbox.addEventListener("change", () => {
        catalogState.category = checkbox.checked ? category.id : "";
        renderCatalog();
      });

      label.append(checkbox, document.createTextNode(category.name));
      categoryContainer.appendChild(label);
    });
  }

  if (brandContainer) {
    [...new Set(PRODUCTS.map(p => p.brand))].sort().forEach(brand => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = brand;
      checkbox.checked = catalogState.brand === brand;

      checkbox.addEventListener("change", () => {
        catalogState.brand = checkbox.checked ? brand : "";
        renderCatalog();
      });

      label.append(checkbox, document.createTextNode(brand));
      brandContainer.appendChild(label);
    });
  }

  const min = document.getElementById("minPrice");
  const max = document.getElementById("maxPrice");
  const sort = document.getElementById("sortSelect");

  min?.addEventListener("input", () => {
    catalogState.min = Number(min.value);
    document.getElementById("minPriceLabel").textContent =
      Number(min.value).toLocaleString("ru-RU");
    renderCatalog();
  });

  max?.addEventListener("input", () => {
    catalogState.max = Number(max.value);
    document.getElementById("maxPriceLabel").textContent =
      Number(max.value).toLocaleString("ru-RU");
    renderCatalog();
  });

  document.querySelectorAll(".rating-filter").forEach(box => {
    box.addEventListener("change", () => {
      catalogState.rating = box.checked ? Number(box.value) : 0;
      document.querySelectorAll(".rating-filter").forEach(other => {
        if (other !== box) other.checked = false;
      });
      renderCatalog();
    });
  });

  document.getElementById("inStock")?.addEventListener("change", event => {
    catalogState.stock = event.target.checked;
    renderCatalog();
  });

  document.getElementById("discountOnly")?.addEventListener("change", event => {
    catalogState.discount = event.target.checked;
    renderCatalog();
  });

  sort?.addEventListener("change", () => {
    catalogState.sort = sort.value;
    renderCatalog();
  });

  if (sort) sort.value = catalogState.sort;

  document.getElementById("resetFilters")?.addEventListener("click", () => {
    catalogState = {
      category: "", brand: "", query: "", sort: "popular",
      min: 0, max: 25000000, rating: 0, stock: false, discount: false
    };

    document.querySelectorAll(".filter-panel input[type=checkbox]").forEach(el => el.checked = false);
    if (min) min.value = "0";
    if (max) max.value = "25000000";
    if (sort) sort.value = "popular";
    document.getElementById("minPriceLabel").textContent = "0";
    document.getElementById("maxPriceLabel").textContent = "25 000 000";
    renderCatalog();
  });
}

function renderCatalog() {
  let items = PRODUCTS.filter(product => {
    const searchText = catalogState.query.toLowerCase();
    const matchesQuery = !searchText ||
      [product.name, product.brand, product.category].some(value =>
        value.toLowerCase().includes(searchText)
      );

    return matchesQuery &&
      (!catalogState.category || product.category === catalogState.category) &&
      (!catalogState.brand || product.brand === catalogState.brand) &&
      product.price >= catalogState.min &&
      product.price <= catalogState.max &&
      product.rating >= catalogState.rating &&
      (!catalogState.stock || product.stock > 0) &&
      (!catalogState.discount || product.oldPrice > product.price);
  });

  if (catalogState.sort === "priceAsc") items.sort((a,b) => a.price-b.price);
  if (catalogState.sort === "priceDesc") items.sort((a,b) => b.price-a.price);
  if (catalogState.sort === "rating") items.sort((a,b) => b.rating-a.rating);
  if (catalogState.sort === "new") items.sort((a,b) => b.id-a.id);
  if (catalogState.sort === "discount") {
    items.sort((a,b) => (1-b.price/b.oldPrice)-(1-a.price/a.oldPrice));
  }
  if (catalogState.sort === "popular") items.sort((a,b) => b.reviews-a.reviews);

  const count = document.getElementById("resultCount");
  if (count) count.textContent = `Найдено товаров: ${items.length}`;

  renderProductList("catalogProducts", items);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("catalogProducts")) return;
  initCatalogFilters();
  renderCatalog();
});

document.addEventListener("nexora:currencyChanged", renderCatalog);
document.addEventListener("nexora:wishlistChanged", renderCatalog);