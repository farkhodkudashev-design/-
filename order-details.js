
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("orderDetails");
  const params = new URLSearchParams(location.search);
  const number = params.get("id");
  const orders = JSON.parse(localStorage.getItem("nexora_orders") || "[]");
  const order = orders.find(item => item.number === number) || orders[0];

  if (!order) {
    container.textContent = "Заказ не найден. Сначала оформите заказ или откройте историю заказов.";
    return;
  }

  const heading = document.createElement("h2");
  heading.textContent = "Заказ " + order.number;

  const status = document.createElement("p");
  status.textContent = "Статус: " + order.status;

  const date = document.createElement("p");
  date.textContent = "Дата: " + new Date(order.date).toLocaleString("ru-RU");

  const customer = document.createElement("p");
  customer.textContent = "Получатель: " + order.customer.firstName + " " + order.customer.lastName;

  const address = document.createElement("p");
  address.textContent = "Адрес: " + order.customer.city + ", " + order.customer.address;

  const total = document.createElement("h3");
  total.textContent = "Итого: " + formatPrice(order.total);

  container.append(heading, status, date, customer, address);

  order.items.forEach(item => {
    const row = document.createElement("p");
    row.textContent = item.name + " × " + item.quantity + " — " + formatPrice(item.price * item.quantity);
    container.appendChild(row);
  });

  container.appendChild(total);
});