
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adminProductCount").textContent = PRODUCTS.length;

  const orders = JSON.parse(localStorage.getItem("nexora_orders") || "[]");
  const users = JSON.parse(localStorage.getItem("nexora_demo_users") || "[]");

  document.getElementById("adminOrderCount").textContent = orders.length;
  document.getElementById("adminUserCount").textContent = users.length;

  const orderContainer = document.getElementById("adminOrders");

  if (!orders.length) {
    orderContainer.textContent = "Заказов пока нет.";
  } else {
    orders.slice(0, 10).forEach(order => {
      const row = document.createElement("div");
      row.className = "dashboard-card";
      row.style.marginBottom = "10px";
      row.textContent = `${order.number} · ${order.customer.firstName} ${order.customer.lastName} · ${formatPrice(order.total)} · ${order.status}`;
      orderContainer.appendChild(row);
    });
  }

  function renderAdminProducts(query = "") {
    const container = document.getElementById("adminProducts");
    container.replaceChildren();

    PRODUCTS.filter(p =>
      (p.name + " " + p.brand).toLowerCase().includes(query.toLowerCase())
    ).forEach(product => {
      const card = document.createElement("article");
      card.className = "dashboard-card";

      const title = document.createElement("h3");
      title.textContent = product.name;

      const brand = document.createElement("p");
      brand.textContent = product.brand;

      const price = document.createElement("strong");
      price.textContent = formatPrice(product.price);

      card.append(title, brand, price);
      container.appendChild(card);
    });
  }

  renderAdminProducts();

  document.getElementById("adminSearch").addEventListener("input", event => {
    renderAdminProducts(event.target.value);
  });

  document.getElementById("exportProducts").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(PRODUCTS, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nexora-products.json";
    link.click();
    URL.revokeObjectURL(url);
  });
});