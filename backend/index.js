const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");




const clienteRoutes = require("./routes/clienteRoutes");
app.use("/cliente", clienteRoutes);

const reservaRoutes = require("./routes/reservaRoutes");
app.use("/reservas", reservaRoutes);

const mesaRoutes = require("./routes/mesaRoutes");
app.use("/mesas", mesaRoutes);

const ClienteController = require("./controllers/clienteController");

app.get("/areaLogado", ClienteController.verificarAutenticacao, (req, res) => {
  res.json({
    msg: "Você está logado e pode acessar recursos de reserva.",
  });
});


app.get(
  "/areaAdmin",
  ClienteController.verificarAutenticacao,
  ClienteController.verificaIsAdmin,
  (req, res) => {
    res.json({
      msg: "Você está logado como Administrador e pode gerenciar mesas e reservas.",
    });
  }
);


app.get("/", (req, res) => {
  res.render("home");
});


app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
