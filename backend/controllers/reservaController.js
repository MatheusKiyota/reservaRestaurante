const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class ReservaController {
  static async criarReserva(req, res) {
    const { data, mesa_id, n_pessoas } = req.body;
    const usuarioId = req.usuarioId;

    try {
      // ver se mesa existe
      const mesa = await client.mesa.findUnique({ where: { id: Number(mesa_id) } });
      if (!mesa) return res.json({ msg: "Mesa não encontrada" });

      if (Number(n_pessoas) > mesa.n_lugares) {
        return res.json({ msg: "Número de pessoas excede a capacidade da mesa" });
      }

      const dataReserva = new Date(data);

      // checar conflito: mesma mesa na mesma data/hora (simplificação)
      const conflito = await client.reserva.findFirst({
        where: { mesa_id: Number(mesa_id), data: dataReserva },
      });
      if (conflito) return res.json({ msg: "Mesa já reservada nesse horário" });

      const reserva = await client.reserva.create({
        data: {
          usuario_id: usuarioId,
          mesa_id: Number(mesa_id),
          data: dataReserva,
          n_pessoas: Number(n_pessoas),
          status: true,
        },
      });

      res.json({ msg: "Reserva criada com sucesso", reservaId: reserva.id });
    } catch (err) {
      res.json({ msg: "Erro ao criar reserva", error: err.message });
    }
  }

  static async listarReservasDoCliente(req, res) {
    const usuarioId = req.usuarioId;
    try {
      const reservas = await client.reserva.findMany({
        where: { usuario_id: usuarioId },
        include: { mesa: true },
        orderBy: { data: "asc" },
      });
      res.json(reservas);
    } catch (err) {
      res.json({ msg: "Erro ao listar reservas", error: err.message });
    }
  }

  static async listarTodasReservas(req, res) {
    try {
      const reservas = await client.reserva.findMany({
        include: { usuario: true, mesa: true },
        orderBy: { data: "asc" },
      });
      res.json(reservas);
    } catch (err) {
      res.json({ msg: "Erro ao listar todas as reservas", error: err.message });
    }
  }

  static async cancelarReserva(req, res) {
    const { id } = req.params;
    const usuarioId = req.usuarioId;

    try {
      const reserva = await client.reserva.findUnique({ where: { id: Number(id) } });
      if (!reserva) return res.json({ msg: "Reserva não encontrada" });

      // usuário só cancela própria reserva, admin pode cancelar qualquer
      const usuario = await client.usuario.findUnique({ where: { id: usuarioId } });
      if (reserva.usuario_id !== usuarioId && usuario.tipo !== "adm") {
        return res.json({ msg: "Acesso negado" });
      }

      await client.reserva.delete({ where: { id: Number(id) } });
      res.json({ msg: "Reserva cancelada com sucesso" });
    } catch (err) {
      res.json({ msg: "Erro ao cancelar reserva", error: err.message });
    }
  }
}

module.exports = ReservaController;
