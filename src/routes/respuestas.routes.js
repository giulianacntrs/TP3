const express = require("express");
const router = express.Router();
const respuestasController = require("../controllers/respuestas.controller");
const authTest = require("../middleware/authTest");

router.post("/", authTest, respuestasController.crearRespuesta);

router.get("/usuario/:id_usuario", respuestasController.obtenerRespuestasUsuario);

router.get("/session/:session_id", respuestasController.obtenerRespuestasSession);

router.post("/asociar", respuestasController.asociarRespuestas);


module.exports = router;
