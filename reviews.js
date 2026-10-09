
function loadReviews() {
  try {
    return JSON.parse(localStorage.getItem("nexora_reviews") || "[]");
  } catch {
    return [];
  }
}

function renderReviews() {
  const container = document.getElementById("reviewsList");
  if (!container) return;

  container.replaceChildren();

  const reviews = loadReviews();

  if (!reviews.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока нет отзывов. Вы можете оставить первый отзыв.";
    container.appendChild(empty);
    return;
  }

  reviews.forEach(review => {
    const card = document.createElement("article");
    card.className = "dashboard-card";
    card.style.marginBottom = "12px";

    const title = document.createElement("h3");
    title.textContent = review.productName;

    const stars = document.createElement("p");
    stars.style.color = "#d8a12c";
    stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    const text = document.createElement("p");
    text.textContent = review.text;

    const date = document.createElement("small");
    date.style.color = "var(--muted)";
    date.textContent = new Date(review.date).toLocaleDateString("ru-RU");

    const like = document.createElement("button");
    like.className = "btn btn-outline";
    like.textContent = "♡ Полезно (" + review.likes + ")";
    like.addEventListener("click", () => {
      review.likes += 1;
      localStorage.setItem("nexora_reviews", JSON.stringify(reviews));
      renderReviews();
    });

    card.append(title, stars, text, date, like);
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("reviewProduct");
  PRODUCTS.forEach(product => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    select.appendChild(option);
  });

  document.getElementById("reviewPhoto")?.addEventListener("change", event => {
    const file = event.target.files?.[0];
    const preview = document.getElementById("reviewPhotoPreview");
    if (!file || !preview) return;

    if (!file.type.startsWith("image/")) {
      alert("Выберите файл изображения.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Размер изображения не должен превышать 2 МБ.");
      event.target.value = "";
      return;
    }

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  });

  document.getElementById("reviewForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    const product = PRODUCTS.find(p =>
      p.id === Number(document.getElementById("reviewProduct").value)
    );

    const reviews = loadReviews();
    reviews.unshift({
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      rating: Number(document.getElementById("reviewRating").value),
      text: document.getElementById("reviewText").value.trim(),
      date: new Date().toISOString(),
      likes: 0
    });

    localStorage.setItem("nexora_reviews", JSON.stringify(reviews));
    event.currentTarget.reset();
    document.getElementById("reviewPhotoPreview").style.display = "none";
    renderReviews();
  });

  renderReviews();
});