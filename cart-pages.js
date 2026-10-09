
function renderCartPage() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  container.replaceChildren();

  const cart = getCart();

  if (!cart.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = '<h2>Ваша корзина пока пуста</h2><p>Добавьте товары, которые вам понравились.</p><a class="btn btn-dark" href="catalog.html">Перейти в каталог ↗</a>';
    container.appendChild(empty);
    document.getElementById("cartSubtotal").textContent = formatPrice(0);
    document.getElementById("cartDiscount").textContent = formatPrice(0);
    document.getElementById("cartGrandTotal").textContent = formatPrice(0);
    document.getElementById("checkoutLink").style.pointerEvents = "none";
    document.getElementById("checkoutLink").style.opacity = ".5";
    return;
  }

  let subtotal = 0;
  let savings = 0;

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;

    subtotal += product.price * item.quantity;
    savings += (product.oldPrice - product.price) * item.quantity;

    const row = document.createElement("article");
    row.className = "cart-item";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const details = document.createElement("div");
    const brand = document.createElement("p");
    brand.textContent = product.brand;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const unitPrice = document.createElement("p");
    unitPrice.textContent = formatPrice(product.price) + " / шт.";

    const qty = document.createElement("div");
    qty.className = "cart-qty";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Уменьшить количество");
    minus.addEventListener("click", () => {
      changeCartQuantity(product.id, -1);
      renderCartPage();
    });

    const count = document.createElement("strong");
    count.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Увеличить количество");
    plus.addEventListener("click", () => {
      changeCartQuantity(product.id, 1);
      renderCartPage();
    });

    const remove = document.createElement("button");
    remove.className = "cart-remove";
    remove.textContent = "Удалить";
    remove.addEventListener("click", () => {
      removeFromCart(product.id);
      renderCartPage();
    });

    qty.append(minus, count, plus, remove);
    details.append(brand, title, unitPrice, qty);

    const price = document.createElement("strong");
    price.className = "cart-item-price";
    price.textContent = formatPrice(product.price * item.quantity);

    row.append(image, details, price);
    container.appendChild(row);
  });

  document.getElementById("cartSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("cartDiscount").textContent = "−" + formatPrice(savings);
  document.getElementById("cartGrandTotal").textContent = formatPrice(subtotal);
  document.getElementById("checkoutLink").style.pointerEvents = "auto";
  document.getElementById("checkoutLink").style.opacity = "1";
}

document.addEventListener("DOMContentLoaded", renderCartPage);
document.addEventListener("nexora:cartChanged", renderCartPage);
document.addEventListener("nexora:currencyChanged", renderCartPage);