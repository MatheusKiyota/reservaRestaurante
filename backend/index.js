const express = require("express");
const exphbs = require("express-handlebars");
const ClienteController = require("./controllers/clienteController");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

const clienteRoutes = require("./routes/clienteRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const mesaRoutes = require("./routes/mesaRoutes");

app.use("/cliente", clienteRoutes);
app.use("/reservas", reservaRoutes);
app.use("/mesas", mesaRoutes);

app.get(
  "/areaLogado",
  ClienteController.verificarAutenticacao,
  ClienteController.verificaIsAdmin,
  (req, res) => {
    res.json({
      msg: "Você está logado como Administrador e pode acessar recursos restritos.",
    });
  }
);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(8000, () => {
  console.log("Servidor rodando na porta 8000");
});
