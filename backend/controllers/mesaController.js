const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class MesaController {
  static async criarMesa(req, res) {
    const { codigo, n_lugares } = req.body;
    try {
      const mesa = await client.mesa.create({
        data: { codigo, n_lugares: Number(n_lugares) },
      });
      res.json({ msg: "Mesa criada", mesaId: mesa.id });
    } catch (err) {
      res.json({ msg: "Erro ao criar mesa", error: err.message });
    }
  }

  static async verReservasDaMesa(req, res) {
    const { id } = req.params;
    try {
      const reservas = await client.reserva.findMany({
        where: { mesa_id: Number(id) },
        include: { usuario: true },
        orderBy: { data: "asc" },
      });
      res.json(reservas);
    } catch (err) {
      res.json({ msg: "Erro ao listar reservas da mesa", error: err.message });
    }
  }
}

module.exports = MesaController;
