export function logout() {
  // Clear cookie
  document.cookie = "auth_token=; path=/; max-age=0";
  // Clear localStorage
  localStorage.removeItem("admin");
  // Redirect
  window.location.href = "/login";
}
