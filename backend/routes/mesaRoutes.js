const router = require("express").Router();
const MesaController = require("../controllers/mesaController");
const clienteController = require("../controllers/clienteController");

router.get("/lista", MesaController.listarMesas);

// roras do ADM
router.post("/criar", clienteController.verificarAutenticacao, clienteController.verificaIsAdmin, MesaController.criarMesa);
router.get("/:id/reservas", clienteController.verificarAutenticacao, clienteController.verificaIsAdmin, MesaController.verReservasDaMesa);

module.exports = router;
