const router = require("express").Router();
const MesaController = require("../controllers/mesaController");
const UsuarioController = require("../controllers/UsuarioController");

router.get("/lista", MesaController.listarMesas);

// roras do ADM
router.post("/criar", UsuarioController.verificarAutenticacao, UsuarioController.verificaIsAdmin, MesaController.criarMesa);
router.get("/:id/reservas", UsuarioController.verificarAutenticacao, UsuarioController.verificaIsAdmin, MesaController.verReservasDaMesa);

module.exports = router;
