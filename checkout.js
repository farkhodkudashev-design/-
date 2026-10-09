
function renderCheckoutSummary() {
  const cart = getCart();
  const itemsContainer = document.getElementById("checkoutItems");
  if (!itemsContainer) return;

  itemsContainer.replaceChildren();

  let subtotal = 0;

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;

    subtotal += product.price * item.quantity;

    const row = document.createElement("div");
    row.className = "summary-row";

    const name = document.createElement("span");
    name.textContent = `${product.name} × ${item.quantity}`;

    const price = document.createElement("strong");
    price.textContent = formatPrice(product.price * item.quantity);

    row.append(name, price);
    itemsContainer.appendChild(row);
  });

  const delivery = document.querySelector('[name="delivery"]:checked')?.value || "standard";
  const shipping = delivery === "express" ? 50000 : delivery === "pickup" ? 0 : subtotal >= 1000000 ? 0 : 25000;

  document.getElementById("checkoutSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("checkoutShipping").textContent = shipping ? formatPrice(shipping) : "Бесплатно";
  document.getElementById("checkoutTotal").textContent = formatPrice(subtotal + shipping);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  renderCheckoutSummary();

  document.querySelectorAll('[name="delivery"]').forEach(input => {
    input.addEventListener("change", renderCheckoutSummary);
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const cart = getCart();
    if (!cart.length) {
      alert("Ваша корзина пуста.");
      location.href = "catalog.html";
      return;
    }

    const data = new FormData(form);
    const orderItems = cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return product ? {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      } : null;
    }).filter(Boolean);

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = data.get("delivery");
    const shipping = delivery === "express" ? 50000 :
      delivery === "pickup" ? 0 : subtotal >= 1000000 ? 0 : 25000;

    const order = {
      number: "NX-" + Date.now().toString().slice(-9),
      date: new Date().toISOString(),
      status: "Обрабатывается",
      currency: getCurrentCurrency(),
      items: orderItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      customer: {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        phone: data.get("phone"),
        email: data.get("email"),
        country: data.get("country"),
        city: data.get("city"),
        address: data.get("address"),
        apartment: data.get("apartment"),
        postalCode: data.get("postalCode")
      },
      delivery,
      payment: data.get("payment")
    };

    const orders = JSON.parse(localStorage.getItem("nexora_orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("nexora_orders", JSON.stringify(orders));
    localStorage.removeItem("nexora_cart");

    alert("Демонстрационный заказ создан! Номер: " + order.number);
    location.href = "orders.html";
  });
});

document.addEventListener("nexora:currencyChanged", renderCheckoutSummary);