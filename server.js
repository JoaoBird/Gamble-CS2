/*const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rota para a página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "GambleCS2.html"));
});

// Caminho do arquivo JSON onde os usuários serão armazenados
const usersFilePath = "./users.json";

// Função para carregar usuários do arquivo JSON
function loadUsers() {
  if (!fs.existsSync(usersFilePath)) {
    // Cria um arquivo vazio se não existir
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    return [];
  }
}

// Função para salvar usuários no arquivo JSON
function saveUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Erro ao salvar usuários:", error);
  }
}
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  const users = loadUsers();

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  }

  res.status(200).json({
    message: "Login realizado com sucesso!",
    user: { username: user.username, saldo: user.saldo },
  });
});


// Rota para registrar usuários
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  const users = loadUsers();

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Usuário já registrado." });
  }

  const newUser = { username, password, saldo: 0 };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "Usuário registrado com sucesso!", user: newUser });
});

// Rota para listar todos os usuários (apenas para teste, pode ser removida em produção)
app.get("/users", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});*/
