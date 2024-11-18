const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Servir os arquivos estáticos da pasta 'public'
app.use(express.static("public"));

// Caminho do arquivo de usuários
const usersFile = "users.txt";

// Rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ success: false, message: "Erro no servidor" });

    const users = data
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => JSON.parse(line));

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      res.json({ success: true, message: "Login bem-sucedido" });
    } else {
      res.json({ success: false, message: "Usuário ou senha inválidos" });
    }
  });
});

// Rota de registro
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const newUser = JSON.stringify({ username, password });
  fs.appendFile(usersFile, newUser + "\n", (err) => {
    if (err) return res.status(500).json({ success: false, message: "Erro ao salvar usuário" });
    res.json({ success: true, message: "Usuário registrado com sucesso" });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/GambleCS2.html");
});
