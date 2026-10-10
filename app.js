
const TRANSLATIONS = {
  ru: {
    catalog:"Каталог", brands:"Бренды", deals:"Акции",
    new:"Новинки", popular:"Популярное", delivery:"Доставка",
    support:"Поддержка", shopNow:"Перейти к покупкам",
    viewDeals:"Смотреть акции", addCart:"В корзину",
    allProducts:"Все товары", search:"Поиск товаров, брендов и категорий..."
  },
  uz: {
    catalog:"Katalog", brands:"Brendlar", deals:"Chegirmalar",
    new:"Yangiliklar", popular:"Ommabop", delivery:"Yetkazib berish",
    support:"Yordam", shopNow:"Xarid qilish",
    viewDeals:"Chegirmalarni ko'rish", addCart:"Savatga",
    allProducts:"Barcha mahsulotlar", search:"Mahsulot va brendlarni qidirish..."
  },
  en: {
    catalog:"Catalog", brands:"Brands", deals:"Deals",
    new:"New arrivals", popular:"Popular", delivery:"Delivery",
    support:"Support", shopNow:"Shop now",
    viewDeals:"View deals", addCart:"Add to cart",
    allProducts:"All products", search:"Search products, brands and categories..."
  },
  tr: {
    catalog:"Katalog", brands:"Markalar", deals:"İndirimler",
    new:"Yeni ürünler", popular:"Popüler", delivery:"Teslimat",
    support:"Destek", shopNow:"Alışverişe başla",
    viewDeals:"Fırsatları gör", addCart:"Sepete ekle",
    allProducts:"Tüm ürünler", search:"Ürün, marka ve kategori ara..."
  },
  de: {
    catalog:"Katalog", brands:"Marken", deals:"Angebote",
    new:"Neuheiten", popular:"Beliebt", delivery:"Lieferung",
    support:"Support", shopNow:"Jetzt einkaufen",
    viewDeals:"Angebote ansehen", addCart:"In den Warenkorb",
    allProducts:"Alle Produkte", search:"Produkte, Marken und Kategorien suchen..."
  },
  es: {
    catalog:"Catálogo", brands:"Marcas", deals:"Ofertas",
    new:"Novedades", popular:"Popular", delivery:"Envío",
    support:"Ayuda", shopNow:"Comprar ahora",
    viewDeals:"Ver ofertas", addCart:"Añadir al carrito",
    allProducts:"Todos los productos", search:"Buscar productos, marcas y categorías..."
  },
  zh: {
    catalog:"商品目录", brands:"品牌", deals:"优惠",
    new:"新品", popular:"热门", delivery:"配送",
    support:"帮助", shopNow:"立即购物",
    viewDeals:"查看优惠", addCart:"加入购物车",
    allProducts:"全部商品", search:"搜索商品、品牌和分类..."
  },
  ko: {
    catalog:"카탈로그", brands:"브랜드", deals:"할인",
    new:"신상품", popular:"인기 상품", delivery:"배송",
    support:"고객 지원", shopNow:"지금 쇼핑하기",
    viewDeals:"할인 보기", addCart:"장바구니 담기",
    allProducts:"전체 상품", search:"상품, 브랜드 및 카테고리 검색..."
  }
};

function getCurrentLanguage() {
  return localStorage.getItem("nexora_language") || "ru";
}

function translate(key) {
  const lang = getCurrentLanguage();
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.ru[key] || key;
}

function applyLanguage() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (translate(key)) element.textContent = translate(key);
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.placeholder = translate("search");
}

function initializeLanguage() {
  const select = document.getElementById("languageSelect");
  if (!select) return;

  select.value = getCurrentLanguage();

  select.addEventListener("change", () => {
    localStorage.setItem("nexora_language", select.value);
    applyLanguage();
    renderProducts();
  });

  applyLanguage();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderProductList(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const wishlist = typeof getWishlist === "function" ? getWishlist() : [];
  container.innerHTML = products.map(product => {
    const discount = product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;
    const badge = product.badge
      ? `<span class="product-badge${discount ? " sale" : ""}">${escapeHTML(product.badge)}</span>`
      : "";

    return `<article class="product-card">
      <div class="product-image">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
        <div class="product-badges">${badge}${discount ? `<span class="product-badge sale">−${discount}%</span>` : ""}</div>
        <div class="product-tools"><button class="product-tool${wishlist.includes(product.id) ? " selected" : ""}" data-wishlist="${product.id}" aria-label="Избранное">♡</button></div>
      </div>
      <div class="product-info">
        <span class="product-brand">${escapeHTML(product.brand)}</span>
        <a class="product-name" href="product.html?id=${product.id}">${escapeHTML(product.name)}</a>
        <div class="product-rating"><span class="star">★</span>${escapeHTML(product.rating)} <span class="reviews">(${escapeHTML(product.reviews)} отзывов)</span></div>
        <div class="product-price-row"><strong class="product-price">${formatPrice(product.price)}</strong>${discount ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` : ""}</div>
        <div class="product-stock">В наличии: ${escapeHTML(product.stock)}</div>
        <div class="product-actions"><button class="add-cart-btn" data-add-to-cart="${product.id}">В корзину</button><a class="quick-view-btn" href="product.html?id=${product.id}" aria-label="Подробнее о товаре">↗</a></div>
      </div>
    </article>`;
  }).join("");

  container.onclick = event => {
    const wishlistButton = event.target.closest("[data-wishlist]");
    const cartButton = event.target.closest("[data-add-to-cart]");
    if (wishlistButton) toggleWishlist(Number(wishlistButton.dataset.wishlist));
    if (cartButton) addToCart(Number(cartButton.dataset.addToCart));
  };
}

function renderProducts(category = "all") {
  const popular = [...PRODUCTS].sort((first, second) => second.reviews - first.reviews);
  const featured = category === "all"
    ? popular
    : popular.filter(product => product.category === category);

  renderProductList("featuredProducts", featured.slice(0, 8));
  renderProductList("dealProducts", PRODUCTS.filter(product => product.oldPrice > product.price).slice(0, 8));
  renderProductList("newProducts", PRODUCTS.filter(product => product.badge === "Новинка").sort((a, b) => b.id - a.id).slice(0, 8));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  document.getElementById("productTabs")?.addEventListener("click", event => {
    const tab = event.target.closest("[data-category]");
    if (!tab) return;

    document.querySelectorAll("#productTabs .tab").forEach(item => item.classList.toggle("active", item === tab));
    renderProducts(tab.dataset.category);
  });
});

document.addEventListener("nexora:currencyChanged", () => renderProducts());
document.addEventListener("nexora:wishlistChanged", () => renderProducts());

document.addEventListener("DOMContentLoaded", initializeLanguage);