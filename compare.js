
function getCompareIds() {
  try {
    return JSON.parse(localStorage.getItem("nexora_compare") || "[]");
  } catch {
    return [];
  }
}

function toggleCompare(id) {
  let ids = getCompareIds();

  if (ids.includes(id)) {
    ids = ids.filter(item => item !== id);
  } else if (ids.length < 4) {
    ids.push(id);
  } else {
    showToast("Можно сравнить не более 4 товаров.");
    return;
  }

  localStorage.setItem("nexora_compare", JSON.stringify(ids));
  renderCompare();
}

function renderCompare() {
  const container = document.getElementById("compareGrid");
  if (!container) return;

  container.replaceChildren();
  const products = PRODUCTS.filter(p => getCompareIds().includes(p.id));

  if (!products.length) {
    container.innerHTML = '<div class="empty-state"><h2>Нет товаров для сравнения</h2><p>Добавьте товары через каталог.</p><a href="catalog.html" class="btn btn-dark">Открыть каталог ↗</a></div>';
    return;
  }

  products.forEach(product => {
    const card = createProductCard(product);
    const info = document.createElement("div");
    info.className = "product-info";

    [
      ["Бренд", product.brand],
      ["Категория", product.category],
      ["Рейтинг", product.rating + " / 5"],
      ["Отзывы", String(product.reviews)],
      ["Наличие", product.stock > 0 ? "В наличии" : "Нет в наличии"]
    ].forEach(([label, value]) => {
      const row = document.createElement("p");
      row.style.fontSize = "11px";
      row.textContent = label + ": " + value;
      info.appendChild(row);
    });

    const remove = document.createElement("button");
    remove.className = "btn btn-outline";
    remove.textContent = "Убрать из сравнения";
    remove.addEventListener("click", () => toggleCompare(product.id));

    info.appendChild(remove);
    card.appendChild(info);
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderCompare);
document.addEventListener("nexora:currencyChanged", renderCompare);