document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------------
     LOGIN / AUTENTICACIÓN
  --------------------------------------------------- */
  const authArea = document.getElementById("authArea");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  if (authArea) {
    if (!token) {
      authArea.innerHTML = `
        <a href="login.html" class="btn btn-outline-light btn-sm">
          Iniciar sesión / Registrar
        </a>`;
    } else {
      authArea.style.display = "flex";
      authArea.style.alignItems = "center";
      authArea.style.gap = "10px";

      authArea.innerHTML = `
        <span class="text-light">Hola, <strong>${userName || "Usuario"}</strong>!</span>
        <button id="logoutBtn" class="btn btn-danger btn-sm">
          <i class="fas fa-power-off"></i>
        </button>
      `;

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        window.location.href = "login.html";
      });
    }
  }

  /* ---------------------------------------------------
     SIDEBAR Y MODO OSCURO
  --------------------------------------------------- */
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  const toggleSidebar = document.getElementById("toggleSidebar");
  const toggleTheme = document.getElementById("toggleTheme");

  // aplicar theme guardado
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem(
        "theme",
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    });
  }

  if (toggleSidebar) {
    toggleSidebar.addEventListener("click", () => {
      sidebar?.classList.toggle("collapsed");
      content?.classList.toggle("collapsed");
    });
  }

  /* ---------------------------------------------------
     ELEMENTOS DE FORMULARIO
  --------------------------------------------------- */
  const btnSueno = document.getElementById("btnSueno");
  const btnEjercicio = document.getElementById("btnEjercicio");
  const btnSocial = document.getElementById("btnSocial");

  const formSueno = document.getElementById("formSueno");
  const formEjercicio = document.getElementById("formEjercicio");
  const formSocial = document.getElementById("formSocial");

  const lista = document.getElementById("listaRegistros");

  const ocultarFormularios = () => {
    formSueno?.classList.add("d-none");
    formEjercicio?.classList.add("d-none");
    formSocial?.classList.add("d-none");
  };

  btnSueno?.addEventListener("click", () => {
    ocultarFormularios();
    formSueno?.classList.remove("d-none");
  });

  btnEjercicio?.addEventListener("click", () => {
    ocultarFormularios();
    formEjercicio?.classList.remove("d-none");
  });

  btnSocial?.addEventListener("click", () => {
    ocultarFormularios();
    formSocial?.classList.remove("d-none");
  });

  /* ---------------------------------------------------
     DATOS PARA EL GRÁFICO
  --------------------------------------------------- */
  let datos = {
    sueño: {},
    ejercicio: {},
    social: {},
  };

  /* ---------------------------------------------------
     AGREGAR REGISTRO (BACKEND PUERTO 8080)
  --------------------------------------------------- */
  async function agregarRegistro(tipo, dia, horas) {
    try {
      const response = await fetch("http://localhost:8080/diagnostico/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoDeTabla: tipo,
          descripcion1: capitalize(dia),
          descripcion2: horas,
        }),
      });

      if (!response.ok) throw new Error("Error al cargar registro");

      alert("Cargado con éxito ✅");
      actualizarTabla();
    } catch (err) {
      console.error(err);
      alert("No se pudo crear ❌");
    }
  }

  /* ---------------------------------------------------
     EVENTOS FORMULARIOS (USAN EL BACKEND UNIFICADO 8080)
  --------------------------------------------------- */
  formSueno?.addEventListener("submit", (e) => {
    e.preventDefault();
    agregarRegistro("sueño", suenoDia.value, suenoHoras.value);
    formSueno.reset();
  });

  formEjercicio?.addEventListener("submit", (e) => {
    e.preventDefault();
    agregarRegistro("ejercicio", ejercicioDia.value, ejercicioHoras.value);
    formEjercicio.reset();
  });

  formSocial?.addEventListener("submit", (e) => {
    e.preventDefault();
    agregarRegistro("social", socialDia.value, socialHoras.value);
    formSocial.reset();
  });

  /* ---------------------------------------------------
     ACTUALIZAR TABLA + GRÁFICO
  --------------------------------------------------- */
  async function actualizarTabla() {
    try {
      const response = await fetch("http://localhost:8080/diagnostico/obtener");
      if (!response.ok) throw new Error("Error al obtener datos");

      const data = await response.json();

      datos = { sueño: {}, ejercicio: {}, social: {} };
      lista.innerHTML = "";

      data.forEach((item) => {
        const tipo = item.tipoDeTabla.toLowerCase();
        const dia = item.descripcion1;
        const horas = Number(item.descripcion2);

        if (!datos[tipo]) datos[tipo] = {};
        datos[tipo][dia] = horas;

        const li = document.createElement("li");
        li.classList.add("list-group-item");

        const texto = document.createElement("span");
        texto.textContent = `${item.tipoDeTabla}: ${horas}h de ${dia}`;
        li.appendChild(texto);

        const btns = document.createElement("span");
        btns.style.float = "right";

        // modificar
        const btnModificar = document.createElement("button");
        btnModificar.textContent = "🔍";
        btnModificar.classList.add("btn", "btn-info", "btn-sm", "me-2");
        btnModificar.addEventListener("click", () => {
          window.location.href = `modificar.html?id=${item.id}`;
        });

        // eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "✖";
        btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
        btnEliminar.addEventListener("click", async () => {
          if (!confirm("¿Eliminar este registro?")) return;
          await fetch(`http://localhost:8080/diagnostico/borrar/${item.id}`, {
            method: "DELETE",
          });
          actualizarTabla();
        });

        btns.appendChild(btnModificar);
        btns.appendChild(btnEliminar);
        li.appendChild(btns);

        lista.appendChild(li);
      });

      actualizarGrafico(datos);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los datos ❌");
    }
  }

  /* ---------------------------------------------------
     GRÁFICO
  --------------------------------------------------- */
  const ctx = document.getElementById("graficoSemanal");
  let grafico = null;

  if (ctx) {
    grafico = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        datasets: [
          { label: "Sueño", data: [], backgroundColor: "rgba(13,110,253,0.7)" },
          { label: "Ejercicio", data: [], backgroundColor: "rgba(25,135,84,0.7)" },
          { label: "Social", data: [], backgroundColor: "rgba(255,193,7,0.7)" },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Horas" } },
        },
      },
    });
  }

  function actualizarGrafico(datos) {
    if (!grafico) return;

    const dias = grafico.data.labels;
    grafico.data.datasets[0].data = dias.map((d) => datos["sueño"][d] || 0);
    grafico.data.datasets[1].data = dias.map((d) => datos["ejercicio"][d] || 0);
    grafico.data.datasets[2].data = dias.map((d) => datos["social"][d] || 0);

    grafico.update();
  }

  /* ---------------------------------------------------
     CARGA INICIAL
  --------------------------------------------------- */
  actualizarTabla();

  /* ---------------------------------------------------
     FUNCIONES UTILES
  --------------------------------------------------- */
  function capitalize(t) {
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  }
});
