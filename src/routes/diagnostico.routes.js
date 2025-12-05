const express = require("express");
const { registrarDiagnostico,obtenerDiagnostico,borrarDiagnostico,obtenerUnDiagnostico,editarUnDiagnostico } = require("../controllers/diagnostico.controller");

const router = express.Router();

router.post("/registro", registrarDiagnostico);
router.get("/obtener", obtenerDiagnostico);
router.delete("/borrar/:id", borrarDiagnostico);
router.get("/obtener/:id", obtenerUnDiagnostico);
router.put("/editar/:id", editarUnDiagnostico);

module.exports = router;