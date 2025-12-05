const pool = require("./mysql");

const Diagnostico = {
  async crear({ tipoDeTabla, descripcion1, descripcion2 }) {
    const [result] = await pool.query(
      `INSERT INTO diagnostico (tipoDeTabla, descripcion1, descripcion2)
       VALUES (?, ?, ?)`,
      [tipoDeTabla, descripcion1, descripcion2]
    );

    return result.insertId;
  },

  async obtener() {
    const [rows] = await pool.query(
      `SELECT * FROM diagnostico`
    );
    return rows;
  },

  async borrar(id) {
    const [result] = await pool.query(
      `DELETE FROM diagnostico WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0; // true si se eliminó
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT * FROM diagnostico WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  },

  async editar(id, { tipoDeTabla, descripcion1, descripcion2 }) {
    const [result] = await pool.query(
      `UPDATE diagnostico
       SET tipoDeTabla = ?, descripcion1 = ?, descripcion2 = ?
       WHERE id = ?`,
      [tipoDeTabla, descripcion1, descripcion2, id]
    );

    return result.affectedRows > 0;
  }



};



module.exports = Diagnostico;