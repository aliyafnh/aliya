// JavaS// transition.js
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-show");
});

document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href");
  if (!href) return;

  // kalau external link / anchor / buka tab baru, jangan kacau
  if (href.startsWith("#") || href.startsWith("http") || a.target === "_blank") return;

  e.preventDefault();

  document.body.classList.remove("page-show");
  setTimeout(() => {
    window.location.href = href;
  }, 300); // kena sama lebih kurang dgn CSS transition
});cript Document