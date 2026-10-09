
function renderOrders() {
  const container = document.getElementById("ordersList");
  if (!container) return;

  container.replaceChildren();

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("nexora_orders") || "[]");
  } catch {}

  if (!orders.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = '<h2>Пока нет заказов</h2><p>Ваши оформленные заказы появятся здесь.</p><a class="btn btn-dark" href="catalog.html">Перейти в каталог ↗</a>';
    container.appendChild(empty);
    return;
  }

  orders.forEach(order => {
    const card = document.createElement("article");
    card.className = "order-card";

    const head = document.createElement("div");
    head.className = "order-head";

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = "Заказ " + order.number;

    const date = document.createElement("p");
    date.style.color = "var(--muted)";
    date.style.fontSize = "11px";
    date.textContent = new Date(order.date).toLocaleString("ru-RU");

    info.append(title, date);

    const status = document.createElement("span");
    status.className = "order-status";
    status.textContent = order.status || "Обрабатывается";
    head.append(info, status);

    const items = document.createElement("div");
    items.className = "order-items";

    (order.items || []).forEach(item => {
      const row = document.createElement("div");
      row.className = "order-product";

      const name = document.createElement("span");
      name.textContent = `${item.name} × ${item.quantity}`;

      const price = document.createElement("strong");
      price.textContent = formatPrice(item.price * item.quantity);

      row.append(name, price);
      items.appendChild(row);
    });

    const bottom = document.createElement("div");
    bottom.className = "order-bottom";

    const total = document.createElement("strong");
    total.textContent = "Итого: " + formatPrice(order.total);

    const details = document.createElement("button");
    details.className = "btn btn-outline";
    details.textContent = "Подробнее";
    details.addEventListener("click", () => {
      const customer = order.customer || {};
      alert(
        "Заказ: " + order.number +
        "\nСтатус: " + order.status +
        "\nПолучатель: " + (customer.firstName || "") + " " + (customer.lastName || "") +
        "\nАдрес: " + (customer.city || "") + ", " + (customer.address || "") +
        "\nОплата: " + order.payment
      );
    });

    bottom.append(total, details);
    card.append(head, items, bottom);
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderOrders);