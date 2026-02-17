export function logout() {
  // Clear the cookie by setting max-age to 0
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict";
  localStorage.removeItem("admin");
  window.location.href = "/login";
}
