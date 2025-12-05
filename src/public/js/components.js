/* ============================
      INJECT GLOBAL CSS
=============================== */
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* -------- SIDEBAR -------- */
    .sidebar {
      position: fixed;
      top: 56px;
      left: 0;
      width: 240px;
      height: 100vh;
      background: var(--bg-sidebar);
      padding: 20px 10px;
      transition: transform 0.3s ease;
      overflow-y: auto;
      z-index: 999;
    }

    .sidebar.collapsed {
      transform: translateX(-100%);
    }

    /* -------- CONTENIDO (ID) -------- */
    #content {
      margin-left: 240px;
      transition: margin-left 0.3s ease;
      margin-top: 56px;
    }

    #content.collapsed {
      margin-left: 0;
    }

    /* -------- MENU -------- */
    .sidebar .menu li {
      list-style: none;
      margin: 15px 0;
    }

    .sidebar .menu a {
      display: block;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--text);
      text-decoration: none;
      font-size: 1.1rem;
    }

    .sidebar .menu a:hover {
      background: rgba(255,255,255,0.1);
    }

    /* -------- NAVBAR -------- */
    #navbar {
      position: fixed;
      width: 100%;
      top: 0;
      height: 56px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      z-index: 999;
      background: var(--navbar-bg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .menu-btn {
      font-size: 1.4rem;
      cursor: pointer;
    }

    .theme-btn {
      cursor: pointer;
      font-size: 1.3rem;
      padding: 5px 10px;
      border-radius: 8px;
    }

    .auth-area {
      font-weight: bold;
    }

    /* -------- MODO CLARO / OSCURO -------- */
    :root {
      --bg: #f7f7f7;
      --text: #222;
      --bg-sidebar: #ffffff;
      --navbar-bg: #ffffff;
    }

    body.dark {
      --bg: #121212;
      --text: #e5e5e5;
      --bg-sidebar: #1d1d1d;
      --navbar-bg: #1d1d1d;
    }

    body {
      background: var(--bg);
      color: var(--text);
      transition: background 0.3s, color 0.3s;
    }
  `;
  document.head.appendChild(style);
}


/* ============================
         LOAD NAVBAR
=============================== */
export function loadNavbar() {
  injectStyles(); // <== inyecta el CSS apenas cargue navbar

  const navbar = document.getElementById("navbar");
  navbar.innerHTML = `
    <div class="nav-left">
      <i class="fa-solid fa-bars menu-btn" id="toggleSidebar"></i>
      <span class="fw-bold">Mi Panel</span>
    </div>

    <div class="nav-right">
      <span class="theme-btn" id="toggleTheme">🌓</span>
      <span class="auth-area" id="authArea"></span>
    </div>
  `;

  initThemeButton();
  initSidebarToggle();
}


/* ============================
        LOAD SIDEBAR
=============================== */
export function loadSidebar() {
  const sidebar = document.getElementById("sidebar");

  sidebar.innerHTML = `
    <ul class="menu">
      <li><a href="../components/dashboard.html"><i class="fa-solid fa-chart-line"></i> Dashboard</a></li>
      <li><a href="../components/sueno.html"><i class="fa-solid fa-moon"></i> Sueño</a></li>
      <li><a href="../components/ejercicio.html"><i class="fa-solid fa-dumbbell"></i> Ejercicio</a></li>
      <li><a href="../components/social.html"><i class="fa-solid fa-user-group"></i> Social</a></li>
      <li><a href="../components/perfil.html"><i class="fa-solid fa-user"></i> Perfil</a></li>
    </ul>
  `;
}


/* ============================
       TOGGLE SIDEBAR
=============================== */
function initSidebarToggle() {
  const btn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    content.classList.toggle("collapsed");
  });
}


/* ============================
       MODE DARK / LIGHT
=============================== */
function initThemeButton() {
  const themeBtn = document.getElementById("toggleTheme");

  // cargar tema guardado
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // guardar estado
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}


/* ============================
        AUTH AREA TEXT
=============================== */
export function updateAuthArea(name) {
  const authArea = document.getElementById("authArea");

  if (!name) {
    authArea.innerHTML = `<a href="../auth/login.html">Iniciar sesión</a>`;
    return;
  }

  authArea.innerHTML = `
    Hola, ${name} |
    <a href="#" id="logoutBtn">Salir</a>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "../auth/login.html";
  });
}
