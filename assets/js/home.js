const HOME_THEME_KEY = "theme";
const HOME_DARK_THEME = "dark";
const HOME_LIGHT_THEME = "light";
const HOME_MOBILE_BREAKPOINT = 720;
const HOME_SCROLL_THRESHOLD = 12;
const HOME_REVEAL_THRESHOLD = 0.12;
const HOME_REVEAL_MARGIN = "0px 0px -8% 0px";
const HOME_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HOME_DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

console.info("[home] Homepage module started.");

function setHomeTheme(theme) {
  const isDark = theme === HOME_DARK_THEME;
  const toggle = document.querySelector("[data-theme-toggle]");

  document.documentElement.toggleAttribute("data-theme", isDark);
  if (isDark) {
    document.documentElement.setAttribute("data-theme", HOME_DARK_THEME);
  }
  toggle.setAttribute("aria-pressed", String(isDark));
}

function initHomeTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");
  const darkMode = window.matchMedia(HOME_DARK_MODE_QUERY);
  const savedTheme = localStorage.getItem(HOME_THEME_KEY);
  const initialTheme = savedTheme || (darkMode.matches ? HOME_DARK_THEME : HOME_LIGHT_THEME);

  setHomeTheme(initialTheme);
  toggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.hasAttribute("data-theme")
      ? HOME_LIGHT_THEME
      : HOME_DARK_THEME;
    localStorage.setItem(HOME_THEME_KEY, nextTheme);
    setHomeTheme(nextTheme);
  });

  darkMode.addEventListener("change", (event) => {
    if (!localStorage.getItem(HOME_THEME_KEY)) {
      setHomeTheme(event.matches ? HOME_DARK_THEME : HOME_LIGHT_THEME);
    }
  });
}

function closeHomeMenu() {
  const menu = document.querySelector("[data-home-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");

  menu.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
}

function initHomeMenu() {
  const menu = document.querySelector("[data-home-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const links = menu.querySelectorAll("a");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  links.forEach((link) => link.addEventListener("click", closeHomeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > HOME_MOBILE_BREAKPOINT) {
      closeHomeMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHomeMenu();
    }
  });
}

function initHomeHeader() {
  const header = document.querySelector("[data-home-header]");
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > HOME_SCROLL_THRESHOLD);

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initHomeReveal() {
  const items = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia(HOME_REDUCED_MOTION_QUERY).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("home-ready");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: HOME_REVEAL_THRESHOLD,
    rootMargin: HOME_REVEAL_MARGIN,
  });

  items.forEach((item) => observer.observe(item));
}

function setHomeYear() {
  const year = document.querySelector("[data-current-year]");
  year.textContent = String(new Date().getFullYear());
}

document.documentElement.classList.remove("no-js");
initHomeTheme();
initHomeMenu();
initHomeHeader();
initHomeReveal();
setHomeYear();

console.info("[home] Homepage module finished.");
