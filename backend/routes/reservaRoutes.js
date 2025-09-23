const router = require("express").Router();
const ReservaController = require("../controllers/reservaController");
const ClienteController = require("../controllers/clienteController"); // para verificar autenticação


router.post(
  "/criar",
  ClienteController.verificarAutenticacao,
  ReservaController.criarReserva
);

router.get(
  "/meus",
  ClienteController.verificarAutenticacao,
  ReservaController.listarReservas
);

router.get(
  "/todas",
  ClienteController.verificarAutenticacao,
  ClienteController.verificaIsAdmin,
  ReservaController.listarTodasReservas
);

router.delete(
  "/cancelar/:id",
  ClienteController.verificarAutenticacao,
  ReservaController.cancelarReserva
);

module.exports = router;
