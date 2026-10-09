
function getProfileUser() {
  const id = sessionStorage.getItem("nexora_demo_session");
  return JSON.parse(localStorage.getItem("nexora_demo_users") || "[]")
    .find(user => user.id === id);
}

function renderProfile() {
  const user = getProfileUser();

  if (!user) {
    location.href = "login.html";
    return;
  }

  document.getElementById("profileGreeting").textContent =
    "Привет, " + user.firstName + "!";

  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profileFirstName").value = user.firstName;
  document.getElementById("profileLastName").value = user.lastName;
  document.getElementById("profileEmailInput").value = user.email;
  document.getElementById("profilePhone").value = user.phone || "";

  const orders = JSON.parse(localStorage.getItem("nexora_orders") || "[]");
  document.getElementById("orderCount").textContent = orders.length;
  document.getElementById("favoriteCount").textContent =
    JSON.parse(localStorage.getItem("nexora_wishlist") || "[]").length;
  document.getElementById("bonusPoints").textContent = "0";
}

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();

  document.getElementById("profileForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const user = getProfileUser();
    if (!user) return;

    user.firstName = document.getElementById("profileFirstName").value.trim();
    user.lastName = document.getElementById("profileLastName").value.trim();
    user.phone = document.getElementById("profilePhone").value.trim();

    const users = JSON.parse(localStorage.getItem("nexora_demo_users") || "[]");
    const updated = users.map(item => item.id === user.id ? user : item);
    localStorage.setItem("nexora_demo_users", JSON.stringify(updated));

    alert("Профиль обновлён в демонстрационном режиме.");
    renderProfile();
  });

  document.getElementById("logoutButton")?.addEventListener("click", () => {
    sessionStorage.removeItem("nexora_demo_session");
    sessionStorage.removeItem("nexora_demo_email");
    location.href = "index.html";
  });
});