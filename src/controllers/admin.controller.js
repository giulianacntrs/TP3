
const AdminRespuestas = require("../models/adminRespuestas");
const AdminUsuarios = require("../models/adminUsuarios");

async function crearPregunta(req, res) {
  try {
    const { texto_pregunta, tipo, opciones } = req.body;

    if (!texto_pregunta) {
      return res.status(400).json({ message: "El texto de la pregunta es obligatorio" });
    }


    return res.status(201).json({
      message: "Pregunta creada correctamente",
      pregunta: nuevaPregunta
    });

  } catch (error) {
    console.error("Error en crearPregunta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

const obtenerRespuestas = async (req, res) => {
  try {
    const respuestas = await AdminRespuestas.obtenerTodas();
    res.json(respuestas);
  } catch (err) {
    console.error("Error al obtener respuestas:", err);
    res.status(500).json({ message: "Error al obtener respuestas" });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await AdminUsuarios.obtenerTodos();
    res.json(usuarios);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    await AdminUsuarios.eliminar(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

module.exports = {
  obtenerRespuestas,
  obtenerUsuarios,
  eliminarUsuario
};
