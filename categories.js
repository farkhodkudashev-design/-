
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("allCategories");
  if (!container) return;

  const images = {
    smartphones: "photo-1511707171634-5f897ff02aa9",
    laptops: "photo-1496181133206-80ce9b88a853",
    monitors: "photo-1527443224154-c4a3942d3acf",
    gaming: "photo-1593305841991-05c297ba4575",
    audio: "photo-1505740420928-5e560c06d30e",
    wearables: "photo-1523275335684-37898b6baf30",
    cameras: "photo-1516035069371-29a1b244cc32",
    home: "photo-1556228720-195a672e8a03",
    fashion: "photo-1542291026-7eec264c27ff",
    accessories: "photo-1553062407-98eeb64c6a62"
  };

  CATEGORIES.forEach(category => {
    const link = document.createElement("a");
    link.className = "category-card";
    link.href = "catalog.html?category=" + encodeURIComponent(category.id);

    const image = document.createElement("img");
    image.loading = "lazy";
    image.alt = category.name;
    image.src = `https://images.unsplash.com/${images[category.id] || images.home}?auto=format&fit=crop&w=700&q=80`;

    const details = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = category.icon + " " + category.name;

    const text = document.createElement("p");
    const count = PRODUCTS.filter(p => p.category === category.id).length;
    text.textContent = count + " товаров · Смотреть ↗";

    details.append(heading, text);
    link.append(image, details);
    container.appendChild(link);
  });
});