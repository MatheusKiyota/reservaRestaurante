const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class UsuarioController {
    static async cadastrar(req, res) {
    const { nome, email, senha } = req.body;
    try {
      const salt = bcryptjs.genSaltSync(8);
      const hashSenha = bcryptjs.hashSync(senha, salt);

     const usuario = await client.usuario.create({
       data: {
       nome,
       email,
       senha: hashSenha,
       isAdmin: false, 
  },
});

      res.json({ usuarioId: usuario.id });
    } catch (err) {
      res.json({ msg: "Erro ao cadastrar usuário", error: err.message });
    }
  }

    static async login(req, res) {
  const { email, senha } = req.body;
  try {
    const usuario = await client.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(404).json({ msg: "Usuário não encontrado" });

    const senhaCorreta = bcryptjs.compareSync(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ msg: "Senha incorreta" });

    const token = jwt.sign(
      { id: usuario.id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ msg: "Autenticado", token });
  } catch (err) {
    res.status(500).json({ msg: "Erro no login", error: err.message });
  }
  }

    static async logout(req, res) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.json({ msg: "Token não encontrado!" });

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.decode(token);
      const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

      await client.revokedToken.create({
        data: {
          token,
          expiresAt,
        },
      });

      res.json({ msg: "Logout realizado com sucesso" });
    } catch (err) {
      res.json({ msg: "Erro no logout", error: err.message });
    }
  }

    static async verificarAutenticacao(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.json({ msg: "Token não encontrado!" });

  const token = authHeader.split(" ")[1]; 
  try {
    const revoked = await client.revokedToken.findUnique({ where: { token } });
    if (revoked) return res.json({ msg: "Token inválido!" });

    const payload = jwt.verify(token, process.env.JWT_SECRET); 
    req.usuarioId = payload.id;
    req.isAdmin = payload.isAdmin;
    next();
  } catch (err) {
    return res.json({ msg: "Token inválido!" });
  }
  }
 
    static async verificaIsAdmin(req, res, next) {
  if (!req.usuarioId) return res.json({ msg: "Você não está autenticado!" });

  const usuario = await client.usuario.findUnique({ where: { id: req.usuarioId } });
  if (!usuario || !usuario.isAdmin) {
    return res.json({ msg: "Acesso negado, você não é um administrador!" });
  }

  next();
  }

    static async verPerfil(req, res) {
  const usuarioId = req.usuarioId;
  try {
    const usuario = await client.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nome: true, email: true, isAdmin: true }, 
    });
    res.json(usuario);
  } catch (err) {
    res.json({ msg: "Erro ao buscar perfil", error: err.message });
  }
  }

    static async editarPerfil(req, res) {
  const usuarioId = req.usuarioId;
  const { nome, email, senha } = req.body;

  try {
    const data = { nome, email };

    if (senha) {
      const salt = bcryptjs.genSaltSync(8);
      data.senha = bcryptjs.hashSync(senha, salt);
    }

    const usuario = await client.usuario.update({
      where: { id: usuarioId },
      data,
      select: { id: true, nome: true, email: true, isAdmin: true }, 
    });

    res.json({ msg: "Perfil atualizado", usuario });
  } catch (err) {
    res.json({ msg: "Erro ao editar perfil", error: err.message });
  }
  }
}


module.exports = UsuarioController;
