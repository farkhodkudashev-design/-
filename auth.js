
function getDemoUsers() {
  try {
    return JSON.parse(localStorage.getItem("nexora_demo_users") || "[]");
  } catch {
    return [];
  }
}

function saveDemoUsers(users) {
  localStorage.setItem("nexora_demo_users", JSON.stringify(users));
}

function showAuthMessage(message) {
  const container = document.getElementById("toastContainer");
  if (!container) {
    alert(message);
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.getElementById("registerForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const firstName = String(data.get("firstName")).trim();
  const lastName = String(data.get("lastName")).trim();
  const email = String(data.get("email")).trim().toLowerCase();
  const phone = String(data.get("phone")).trim();
  const password = String(data.get("password"));
  const confirmPassword = String(data.get("confirmPassword"));

  if (password.length < 8) {
    showAuthMessage("Пароль должен содержать не менее 8 символов.");
    return;
  }

  if (password !== confirmPassword) {
    showAuthMessage("Пароли не совпадают.");
    return;
  }

  const users = getDemoUsers();

  if (users.some(user => user.email === email)) {
    showAuthMessage("Этот email уже зарегистрирован.");
    return;
  }

  // Демо-режим: сохраняются только профиль и флаг регистрации.
  // Пароль намеренно не сохраняется.
  const user = {
    id: "demo-" + Date.now(),
    firstName,
    lastName,
    email,
    phone,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveDemoUsers(users);

  // Только демонстрационная отметка входа, без реальной защиты.
  sessionStorage.setItem("nexora_demo_session", user.id);
  sessionStorage.setItem("nexora_demo_email", user.email);

  showAuthMessage("Демо-аккаунт создан!");
  setTimeout(() => location.href = "profile.html", 700);
});

document.getElementById("loginForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const email = String(data.get("email")).trim().toLowerCase();

  const user = getDemoUsers().find(item => item.email === email);

  if (!user) {
    showAuthMessage("Демо-аккаунт не найден. Сначала зарегистрируйтесь.");
    return;
  }

  // Пароли здесь не проверяются: полноценный вход реализуется на backend.
  sessionStorage.setItem("nexora_demo_session", user.id);
  sessionStorage.setItem("nexora_demo_email", user.email);

  showAuthMessage("Демо-вход выполнен.");
  setTimeout(() => location.href = "profile.html", 700);
});

document.querySelectorAll("[data-social]").forEach(button => {
  button.addEventListener("click", () => {
    showAuthMessage(
      "Вход через " + button.dataset.social +
      " будет доступен после настройки OAuth на сервере."
    );
  });
});