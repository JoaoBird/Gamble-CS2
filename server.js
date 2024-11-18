const express = require('express');
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Servir os arquivos estáticos da pasta 'public'
app.use(express.static("public"));

// Caminho do arquivo de usuários
const usersFile = "users.json";

// Função auxiliar para ler e salvar usuários
const readUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf8");
  return JSON.parse(data || "[]");
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, message: "Login bem-sucedido", user });
  } else {
    res.json({ success: false, message: "Usuário ou senha inválidos" });
  }
});

// Rota de registro
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ success: false, message: "Usuário já existe" });
  }

  const newUser = { username, password, saldo: 0, itens: [] };
  users.push(newUser);
  saveUsers(users);

  res.json({ success: true, message: "Usuário registrado com sucesso", user: newUser });
});

// Rota para adicionar saldo
app.post("/addSaldo", (req, res) => {
  const { username, amount } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

  user.saldo += amount;
  saveUsers(users);

  res.json({ success: true, saldo: user.saldo });
});

// Rota para listar itens do usuário
app.get("/itens/:username", (req, res) => {
  const { username } = req.params;

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

  res.json({ success: true, itens: user.itens });
});

// Rota para adicionar um item ao inventário
app.post("/addItem", (req, res) => {
  const { username, item } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

  user.itens.push(item);
  saveUsers(users);

  res.json({ success: true, itens: user.itens });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

