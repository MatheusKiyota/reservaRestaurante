const router = require("express").Router();
const clienteController = require("../controllers/clienteController");

router.post("/cadastro", clienteController.cadastrar);
router.post("/login", clienteController.login);
router.post("/logout", clienteController.logout);

module.exports = router;
