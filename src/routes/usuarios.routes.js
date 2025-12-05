const express = require("express");
const {
  registrarUsuario,
  loginUsuario,
  checkEmail
} = require("../controllers/usuarios.controller");

const router = express.Router();

router.post("/registro", registrarUsuario);

router.post("/login", loginUsuario);

router.get("/check-email", checkEmail);

module.exports = router;
