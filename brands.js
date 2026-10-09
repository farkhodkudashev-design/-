
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("allBrands");
  if (!container) return;

  const descriptions = {
    Apple: "Технологии и устройства",
    Samsung: "Электроника и дисплеи",
    Xiaomi: "Умные устройства",
    Sony: "Аудио и развлечения",
    ASUS: "Компьютеры и gaming",
    Lenovo: "Ноутбуки и компьютеры",
    HP: "Компьютерная техника",
    Logitech: "Периферия и аксессуары",
    Razer: "Игровые устройства",
    Nike: "Спортивный стиль",
    Adidas: "Одежда и обувь",
    JBL: "Аудиотехника"
  };

  const brands = [...new Set([
    ...PRODUCTS.map(p => p.brand),
    "Apple", "Samsung", "Xiaomi", "Sony", "ASUS",
    "Lenovo", "HP", "Logitech", "Razer", "Nike", "Adidas", "JBL"
  ])].sort();

  brands.forEach(brand => {
    const link = document.createElement("a");
    link.className = "brand-card";
    link.href = "catalog.html?brand=" + encodeURIComponent(brand);

    const title = document.createElement("strong");
    title.textContent = brand;

    const subtitle = document.createElement("span");
    const count = PRODUCTS.filter(p => p.brand === brand).length;
    subtitle.textContent = descriptions[brand] || `${count} товаров в каталоге`;

    link.append(title, subtitle);
    container.appendChild(link);
  });
});