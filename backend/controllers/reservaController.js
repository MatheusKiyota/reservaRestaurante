const { PrismaClient } = require("@prisma/client");
const { error } = require("console");
const client = new PrismaClient();

class ReservaController {

  static async criarReserva(req, res) {
    const { data, mesa } = req.body;
    const clienteId = req.clienteId; 

    try {
      const reserva = await client.reserva.create({
        data: {
          clienteId,
          data: new Date(data),
          mesa,
        },
      });

      res.json({
        msg: "Reserva criada com sucesso",
        reservaId: reserva.id,
      });
    } catch (err) {
      res.json({
        msg: "Erro ao criar reserva",
        error: err.message,
      });
    }
  }


  static async listarReservas(req, res) {
    const clienteId = req.clienteId;

    try {
      const reservas = await client.reserva.findMany({
        where: { clienteId },
        orderBy: { data: "asc" },
      });

      res.json(reservas);
    } catch (err) {
      res.json({
        msg: "Erro ao listar reservas",
        error: err.message,
      });
    }
  }


  static async listarTodasReservas(req, res) {
    try {
      const reservas = await client.reserva.findMany({
        orderBy: { data: "asc" },
        include: { cliente: true },
      });

      res.json(reservas);
    } catch (err) {
      res.json({
        msg: "Erro ao listar todas as reservas",
        error: err.message,
      });
    }
  }


  static async cancelarReserva(req, res) {
    const { id } = req.params;
    const clienteId = req.clienteId;

    try {
      const reserva = await client.reserva.findUnique({
        where: { id: Number(id) },
      });

      if (!reserva) {
        return res.json({ msg: "Reserva não encontrada" });
      }

 
      if (reserva.clienteId !== clienteId && !req.isAdmin) {
        return res.json({ msg: "Acesso negado" });
      }

      await client.reserva.delete({ where: { id: Number(id) } });

      res.json({ msg: "Reserva cancelada com sucesso" });
    } catch (err) {
      res.json({
        msg: "Erro ao cancelar reserva",
        error: err.message,
      });
    }
  }
}

module.exports = ReservaController;
