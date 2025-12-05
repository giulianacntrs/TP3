// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("ID inválido");
  window.location.href = "index.html";
}

// --------------------------------------------------
// CARGAR DATOS EXISTENTES
// --------------------------------------------------
async function cargarDatos() {
  try {
    const response = await fetch(`http://localhost:8080/diagnostico/obtener/${id}`);

    if (!response.ok) throw new Error("No se pudo obtener el registro");

    const data = await response.json();

    document.getElementById("tipo").value = data.tipoDeTabla;
    document.getElementById("dia").value = data.descripcion1;
    document.getElementById("horas").value = data.descripcion2;

  } catch (error) {
    console.error(error);
    alert("Error cargando datos");
  }
}

cargarDatos();

// --------------------------------------------------
// GUARDAR CAMBIOS
// --------------------------------------------------
document.getElementById("formModificar").addEventListener("submit", async (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const dia = capitalize(document.getElementById("dia").value.trim());
  const horas = document.getElementById("horas").value;

  const body = {
    tipoDeTabla: tipo,
    descripcion1: dia,
    descripcion2: horas
  };

  try {
    const response = await fetch(`http://localhost:8080/diagnostico/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error("No se pudo actualizar");

    alert("Registro actualizado correctamente");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert("Error al guardar cambios");
  }
});


function capitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}