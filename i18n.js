
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

document.addEventListener("DOMContentLoaded", initializeLanguage);