const { TestRespuestas } = require("../models/adminRespuestas");


const respuestasController = {

  crearRespuesta: async (req, res) => {
    try {
      const id_usuario = req.user ? req.user.id_usuario : null;

      const { session_id, id_pregunta, valor } = req.body;

      if (!id_pregunta || !valor) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      if (!id_usuario && !session_id) {
        return res.status(400).json({
          message: "Falta session_id para usuario invitado"
        });
      }

      const id_respuesta = await TestRespuestas.guardarRespuesta({
        id_usuario,
        session_id,
        pregunta_id: id_pregunta,
        valor
      });

      res.json({
        message: "Respuesta guardada",
        id_respuesta
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al guardar la respuesta" });
    }
  },

  // 🔹 Obtener respuestas por usuario logueado
  obtenerRespuestasUsuario: async (req, res) => {
    try {
      const { id_usuario } = req.params;

      const respuestas = await TestRespuestas.obtenerPorUsuario(id_usuario);

      res.json(respuestas);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener respuestas" });
    }
  },

  // 🔹 Obtener respuestas por session_id (modo invitado)
  obtenerRespuestasSession: async (req, res) => {
    try {
      const { session_id } = req.params;

      const respuestas = await TestRespuestas.obtenerPorSession(session_id);

      res.json(respuestas);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener respuestas" });
    }
  },

  // 🔹 Asociar respuestas del invitado al usuario logueado
  asociarRespuestas: async (req, res) => {
    try {
      const { session_id, id_usuario } = req.body;

      if (!session_id || !id_usuario) {
        return res.status(400).json({ message: "Faltan datos" });
      }

      await TestRespuestas.asociarAUsuario({ session_id, id_usuario });

      res.json({ message: "Respuestas asociadas al usuario" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al asociar respuestas" });
    }
  }
};

module.exports = respuestasController;
