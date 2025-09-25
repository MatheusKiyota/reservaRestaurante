const router = require("express").Router();
const UsuarioController = require("../controllers/UsuarioController");

router.post("/cadastro", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);
router.post("/logout", UsuarioController.logout);

router.get("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.verPerfil);
router.put("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.editarPerfil);

module.exports = router;
