const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class ClienteController {

  static async cadastrar(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const salt = bcryptjs.genSaltSync(8);
      const hashSenha = bcryptjs.hashSync(senha, salt);

      const cliente = await client.cliente.create({
        data: {
          nome,
          email,
          senha: hashSenha,
        },
      });

      res.json({ clienteId: cliente.id });
    } catch (err) {
      res.json({
        msg: "Erro ao cadastrar cliente",
        error: err.message,
      });
    }
  }


  static async login(req, res) {
    const { email, senha } = req.body;

    try {
      const cliente = await client.cliente.findUnique({
        where: { email },
      });

      if (!cliente) {
        return res.json({ msg: "Cliente não encontrado" });
      }

      const senhaCorreta = bcryptjs.compareSync(senha, cliente.senha);
      if (!senhaCorreta) {
        return res.json({ msg: "Senha incorreta" });
      }

      const token = jwt.sign(
        { id: cliente.id },
        process.env.SENHA_SERVIDOR,
        { expiresIn: "1h" }
      );

      res.json({
        msg: "Autenticado",
        token,
      });
    } catch (err) {
      res.json({
        msg: "Erro no login",
        error: err.message,
      });
    }
  }


  static async verificarAutenticacao(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.json({ msg: "Token não encontrado!" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SENHA_SERVIDOR, (err, payload) => {
      if (err) {
        return res.json({ msg: "Token inválido!" });
      }

      req.clienteId = payload.id;
      next();
    });
  }


  static async verificaIsAdmin(req, res, next) {
    if (!req.clienteId) {
      return res.json({ msg: "Você não está autenticado!" });
    }

    const cliente = await client.cliente.findUnique({
      where: { id: req.clienteId },
    });

    if (!cliente.isAdmin) {
      return res.json({ msg: "Acesso negado, você não é um administrador!" });
    }

    next();
  }
}

 
module.exports = ClienteController;
