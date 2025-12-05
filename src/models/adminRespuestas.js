const pool = require("./mysql");

const TestRespuestas = {

  // 🔹 Guardar respuesta (invitado o usuario)
  guardarRespuesta: async ({ session_id, pregunta_id, id_usuario = null, valor }) => {
    const [res] = await pool.query(
      `INSERT INTO respuestas (id_usuario, session_id, id_pregunta, valor)
       VALUES (?, ?, ?, ?)`,
      [id_usuario, session_id, pregunta_id, valor]
    );
    return res.insertId;
  },

  // 🔹 Obtener respuestas por session_id (modo invitado)
  obtenerPorSession: async (session_id) => {
    const [rows] = await pool.query(
      `SELECT r.*, p.texto_pregunta
       FROM respuestas r
       INNER JOIN preguntas p ON p.id_pregunta = r.id_pregunta
       WHERE r.session_id = ?
       ORDER BY r.id_respuesta ASC`,
      [session_id]
    );
    return rows;
  },

  // 🔹 Obtener respuestas por usuario logueado
  obtenerPorUsuario: async (id_usuario) => {
    const [rows] = await pool.query(
      `SELECT r.*, p.texto_pregunta
       FROM respuestas r
       INNER JOIN preguntas p ON p.id_pregunta = r.id_pregunta
       WHERE r.id_usuario = ?
       ORDER BY r.id_respuesta ASC`,
      [id_usuario]
    );
    return rows;
  },

  // 🔹 Al iniciar sesión → asociar todas las respuestas de la session al usuario
  asociarAUsuario: async ({ session_id, id_usuario }) => {
    const [res] = await pool.query(
      `UPDATE respuestas
       SET id_usuario = ?, session_id = NULL
       WHERE session_id = ?`,
      [id_usuario, session_id]
    );
    return res.affectedRows;
  }
};

module.exports = { TestRespuestas };
