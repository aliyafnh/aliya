/* =========================
   ABOUT ME rail: make text longer (optional but makes motion nicer)
   + MY STYLE: pop out + drag + autosave
========================= */

(() => {
  // ---- ABOUT RAIL (optional polish: repeat text so motion looks continuous)
  const rails = document.querySelectorAll(".about-rail-text");
  if (rails.length) {
    const base = "ABOUT.ME • ";
    rails.forEach(el => (el.textContent = base.repeat(28)));
  }

  // ---- MY STYLE
  const section = document.querySelector(".style-section");
  if (!section) return;

  const items = Array.from(section.querySelectorAll(".style-item"));
  const STORAGE_KEY = "aliya_style_positions_v1";

  const loadPositions = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  };

  const savePositions = (map) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  };

  const applyFromData = (el) => {
    const tx = Number(el.dataset.x || 0);
    const ty = Number(el.dataset.y || 0);
    const tr = Number(el.dataset.r || 0);
    const ts = Number(el.dataset.s || 1);

    el.style.setProperty("--tx", `${tx}px`);
    el.style.setProperty("--ty", `${ty}px`);
    el.style.setProperty("--tr", `${tr}deg`);
    el.style.setProperty("--ts", `${ts}`);
  };

  const applyFromSavedOrData = () => {
    const saved = loadPositions();
    items.forEach((el) => {
      const key = el.dataset.key;
      if (saved[key]) {
        el.style.setProperty("--tx", `${saved[key].x}px`);
        el.style.setProperty("--ty", `${saved[key].y}px`);
        el.style.setProperty("--tr", `${saved[key].r}deg`);
        el.style.setProperty("--ts", `${saved[key].s}`);
      } else {
        applyFromData(el);
      }
    });
  };

  const getCurrent = (el) => {
    const style = getComputedStyle(el);
    const x = parseFloat(style.getPropertyValue("--tx")) || 0;
    const y = parseFloat(style.getPropertyValue("--ty")) || 0;
    const r = parseFloat(style.getPropertyValue("--tr")) || 0;
    const s = parseFloat(style.getPropertyValue("--ts")) || 1;
    return { x, y, r, s };
  };

  // Apply initial positions
  applyFromSavedOrData();

  // ---- pop out sequence (run once when section enters)
  let triggered = false;

  const popOut = () => {
    section.classList.add("is-active");
    items.forEach((el, i) => {
      el.style.transitionDelay = `${120 * i}ms`;
      requestAnimationFrame(() => el.classList.add("is-out"));
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        popOut();
      }
    },
    { threshold: 0.35 }
  );
  io.observe(section);

  // ---- drag
  let activeEl = null;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  function onDown(e) {
    const target = e.target.closest(".style-item");
    if (!target) return;
    if (!target.classList.contains("is-out")) return;

    activeEl = target;

    const p = getCurrent(activeEl);
    baseX = p.x;
    baseY = p.y;

    startX = e.clientX;
    startY = e.clientY;

    activeEl.classList.add("dragging");
    if (activeEl.setPointerCapture) activeEl.setPointerCapture(e.pointerId);

    e.preventDefault();
  }

  function onMove(e) {
    if (!activeEl) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    activeEl.style.setProperty("--tx", `${baseX + dx}px`);
    activeEl.style.setProperty("--ty", `${baseY + dy}px`);

    e.preventDefault();
  }

  function onUp() {
    if (!activeEl) return;

    const key = activeEl.dataset.key;
    const p = getCurrent(activeEl);

    const map = loadPositions();
    map[key] = { x: p.x, y: p.y, r: p.r, s: p.s };
    savePositions(map);

    activeEl.classList.remove("dragging");
    activeEl = null;
  }

  section.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove, { passive: false });
  window.addEventListener("pointerup", onUp);
})();
	
	function onDown(e) {
  const target = e.target.closest(".style-item");
  if (!target) return;
  if (!target.classList.contains("is-out")) return;

  activeEl = target;

  const p = getCurrent(activeEl);
  baseX = p.x;
  baseY = p.y;

  startX = e.clientX;
  startY = e.clientY;

  activeEl.classList.add("dragging");

  // ✅ jangan ada delay masa drag
  activeEl.style.transitionDelay = "0ms";

  if (activeEl.setPointerCapture) activeEl.setPointerCapture(e.pointerId);
  e.preventDefault();
}
	
	// FORCE navigation for BACK TO HOME (tak kisah ada layer/JS lain kacau)
document.addEventListener(
  "click",
  (e) => {
    const btn = e.target.closest("a.back-home");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const href = btn.getAttribute("href") || "index.html";
    window.location.assign(href);
  },
  true // capture mode (penting!)
);