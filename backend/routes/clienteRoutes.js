const router = require("express").Router();
const clienteController = require("../controllers/clienteController");

router.post("/cadastro", clienteController.cadastrar);
router.post("/login", clienteController.login);
router.post("/logout", clienteController.logout);

router.get("/perfil", clienteController.verificarAutenticacao, clienteController.verPerfil);
router.put("/perfil", clienteController.verificarAutenticacao, clienteController.editarPerfil);

module.exports = router;
