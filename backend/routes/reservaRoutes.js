const router = require("express").Router();
const ReservaController = require("../controllers/reservaController");
const clienteController = require("../controllers/clienteController");

// criar reserva do CLIENTE
router.post("/criar", clienteController.verificarAutenticacao, ReservaController.criarReserva);

// ver próprias reservas
router.get("/meus", clienteController.verificarAutenticacao, ReservaController.listarReservasDoCliente);

// cancelar reservas
router.delete("/cancelar/:id", clienteController.verificarAutenticacao, ReservaController.cancelarReserva);

// listar todas reservas (APENAS ADM SUPREMO)
router.get("/todas", clienteController.verificarAutenticacao, clienteController.verificaIsAdmin, ReservaController.listarTodasReservas);

module.exports = router;
