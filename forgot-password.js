
document.getElementById("forgotForm")?.addEventListener("submit", event => {
  event.preventDefault();

  if (!event.currentTarget.reportValidity()) return;

  document.getElementById("recoveryStatus").textContent =
    "Демонстрационный режим: отправка письма не настроена. Для восстановления пароля подключите backend и сервис электронной почты.";
});