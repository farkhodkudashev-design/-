
const CURRENCY_RATES = {
  UZS: 1,
  RUB: 0.0057,
  USD: 0.000079
};

const CURRENCY_LOCALES = {
  UZS: "uz-UZ",
  RUB: "ru-RU",
  USD: "en-US"
};

function getCurrentCurrency() {
  return localStorage.getItem("nexora_currency") || "UZS";
}

function formatPrice(priceInUZS) {
  const currency = getCurrentCurrency();
  const amount = priceInUZS * CURRENCY_RATES[currency];

  if (currency === "UZS") {
    return new Intl.NumberFormat("uz-UZ", {
      maximumFractionDigits: 0
    }).format(Math.round(amount)) + " сум";
  }

  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0
  }).format(amount);
}

function initializeCurrency() {
  const select = document.getElementById("currencySelect");
  if (!select) return;

  select.value = getCurrentCurrency();

  select.addEventListener("change", () => {
    localStorage.setItem("nexora_currency", select.value);
    document.dispatchEvent(new CustomEvent("nexora:currencyChanged"));
  });
}

document.addEventListener("DOMContentLoaded", initializeCurrency);