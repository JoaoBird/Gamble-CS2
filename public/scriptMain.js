document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginModal = document.getElementById("login-modal");
  const loginRegisterBtn = document.getElementById("login-register-btn");
  const addSaldoBtn = document.getElementById("add-saldo-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const gridContainer = document.querySelector(".grid-container");
  const showRegisterBtn = document.getElementById("show-register");
  const showLoginBtn = document.getElementById("show-login");

  let currentUser = null;

  // Alternar entre formulários de login e cadastro
  function switchToForm(type) {
    if (type === "login") {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      showRegisterBtn.style.display = "inline-block";
      showLoginBtn.style.display = "none";
    } else {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      showRegisterBtn.style.display = "none";
      showLoginBtn.style.display = "inline-block";
    }
  }

  // Atualizar interface com base no estado do usuário
  function updateUserInterface() {
    if (currentUser) {
      userNameDisplay.textContent = currentUser.username;
      userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo}`;
      loginRegisterBtn.style.display = "none";
      addSaldoBtn.style.display = "inline-block";
      logoutBtn.style.display = "inline-block";
    } else {
      userNameDisplay.textContent = "Guest";
      userSaldoDisplay.textContent = "Saldo: R$0";
      loginRegisterBtn.style.display = "inline-block";
      addSaldoBtn.style.display = "none";
      logoutBtn.style.display = "none";
    }
  }

  // Função para popular as caixas no grid
  function populateBoxes() {
    const boxes = [
      { name: "White and Bright", price: "R$5.45", id: "white-and-bright" },
      { name: "Green Wood Dragon", price: "R$0.10", id: "green-wood-dragon" },
    ];

    // Limpar a grid antes de popular
    gridContainer.innerHTML = "";

    // Adicionar cada caixa ao grid
    boxes.forEach((box) => {
      const boxElement = document.createElement("div");
      boxElement.className = "grid-item";
      boxElement.innerHTML = `
        <img src="img/box.png" alt="${box.name}">
        <h3>${box.name}</h3>
        <p>${box.price}</p>
        <button class="enter-box-btn" data-id="${box.id}">Entrar na Caixa</button>
      `;
      gridContainer.appendChild(boxElement);
    });

    // Adicionar evento aos botões "Entrar na Caixa"
    document.querySelectorAll(".enter-box-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const boxId = button.getAttribute("data-id");
        if (!currentUser) {
          alert("Você precisa fazer login primeiro!");
          return;
        }

        if (boxId === "white-and-bright") {
          alert(`Bem-vindo à caixa White and Bright!`);
        } else if (boxId === "green-wood-dragon") {
          alert(`Bem-vindo à caixa Green Wood Dragon!`);
        } else {
          alert("Caixa ainda em desenvolvimento.");
        }
      });
    });
  }

  // Abrir modal
  loginRegisterBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
    switchToForm("login");
  });

  // Fechar modal ao clicar fora
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  // Alternar para cadastro
  showRegisterBtn.addEventListener("click", () => switchToForm("register"));

  // Alternar para login
  showLoginBtn.addEventListener("click", () => switchToForm("login"));

  // Submissão do formulário de login
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        currentUser = data.user;
        alert("Login realizado com sucesso!");
        loginModal.style.display = "none";
        updateUserInterface();
      } else {
        alert(data.message || "Erro ao fazer login.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });

  // Submissão do formulário de cadastro
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Usuário registrado com sucesso!");
        switchToForm("login");
      } else {
        alert(data.message || "Erro no cadastro.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });

  // Logout do usuário
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    alert("Você saiu da conta!");
    updateUserInterface();
  });

  // Adicionar saldo
  addSaldoBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Você precisa fazer login primeiro!");
      return;
    }

    const amount = prompt("Quanto deseja adicionar?");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    const response = await fetch("/addSaldo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentUser.username, amount: parseFloat(amount) }),
    });

    const data = await response.json();
    if (data.success) {
      currentUser.saldo = data.saldo;
      alert(`Saldo atualizado com sucesso! Novo saldo: R$${currentUser.saldo}`);
      updateUserInterface();
    } else {
      alert(data.message);
    }
  });

  // Popular caixas e atualizar interface ao carregar a página
  populateBoxes();
  updateUserInterface();
});


