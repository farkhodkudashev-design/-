
document.getElementById("contactForm")?.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!this.reportValidity()) return;

  document.getElementById("contactStatus").textContent =
    "Форма проверена. Для реальной отправки необходимо подключить сервер.";

  this.reset();
});