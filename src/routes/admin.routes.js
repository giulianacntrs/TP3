const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const authAdmin = require("../middleware/authAdmin");  

// --- RESPUESTAS ---
router.get("/respuestas", authAdmin, adminController.obtenerRespuestas);

// --- USUARIOS ---
router.get("/usuarios", authAdmin, adminController.obtenerUsuarios);
router.delete("/usuarios/:id", authAdmin, adminController.eliminarUsuario);


module.exports = router;
