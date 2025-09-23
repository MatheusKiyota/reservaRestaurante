const router = require("express").Router();
const ClienteController = require("../controllers/clienteController");


router.post("/cadastro", ClienteController.cadastrar);
router.post("/login", ClienteController.login);

module.exports = router;
