
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("nexora_wishlist") || "[]");
  } catch {
    return [];
  }
}

function saveWishlist(ids) {
  localStorage.setItem("nexora_wishlist", JSON.stringify(ids));
  updateWishlistCount();
  document.dispatchEvent(new CustomEvent("nexora:wishlistChanged"));
}

function toggleWishlist(productId) {
  const id = Number(productId);
  const wishlist = getWishlist();

  if (wishlist.includes(id)) {
    saveWishlist(wishlist.filter(item => item !== id));
    showToast("Товар удалён из избранного");
  } else {
    saveWishlist([...wishlist, id]);
    showToast("♡ Товар добавлен в избранное");
  }

  renderProducts();
}

function updateWishlistCount() {
  const badge = document.getElementById("wishlistCount");
  if (badge) badge.textContent = getWishlist().length;
}

document.addEventListener("DOMContentLoaded", updateWishlistCount);