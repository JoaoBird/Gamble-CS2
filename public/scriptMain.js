document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const loginRegisterBtn = document.getElementById("login-register-btn");
  const addSaldoBtn = document.getElementById("add-saldo-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const gridContainer = document.querySelector(".grid-container");
  const closeModalBtn = document.getElementById("close-modal");
  const modalTitle = document.getElementById("modal-title");
  const actionButton = document.getElementById("actionButton");
  const toggleText = document.getElementById("toggleText");
  const toggleLink = document.getElementById("toggleLink");
  const usernameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("passwordInput");
  const profilePic = document.getElementById("profile-pic");

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let isLoginMode = true; // Controla se está no modo de login ou cadastro

  // Alternar entre login e cadastro
  toggleLink.addEventListener("click", () => {
    isLoginMode = !isLoginMode;
    modalTitle.textContent = isLoginMode ? "Entrar" : "Cadastrar";
    actionButton.textContent = isLoginMode ? "Entrar" : "Cadastrar";
    toggleText.innerHTML = isLoginMode
      ? 'Não tem conta? <span style="cursor: pointer; color: #4CAF50;">Cadastre-se</span>'
      : 'Já tem conta? <span style="cursor: pointer; color: #4CAF50;">Entre</span>';
  });

  // Ação do botão de login ou cadastro
  actionButton.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLoginMode) {
      // Lógica de login
      const user = users.find((u) => u.username === username && u.password === password);
      if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert(`Bem-vindo, ${user.username}!`);
        loginModal.style.display = "none";
        updateUserInterface();
      } else {
        alert("Usuário ou senha incorretos.");
      }
    } else {
      // Lógica de cadastro
      if (users.some((u) => u.username === username)) {
        alert("Usuário já cadastrado.");
      } else {
        const newUser = { username, password, saldo: 0 };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Usuário cadastrado com sucesso!");
        isLoginMode = true; // Volta para o modo login
        modalTitle.textContent = "Entrar";
        actionButton.textContent = "Entrar";
        toggleText.innerHTML =
          'Não tem conta? <span style="cursor: pointer; color: #4CAF50;">Cadastre-se</span>';
      }
    }
  });

  // Fecha o modal
  closeModalBtn.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  // Mostra o modal ao clicar no botão "Entrar/Cadastrar"
  loginRegisterBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
  });

  // Fecha o modal ao clicar fora dele
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  // Atualiza a interface do usuário
  function updateUserInterface() {
    if (currentUser && typeof currentUser.saldo === "number") {
      // Atualiza as informações do usuário logado
      userNameDisplay.textContent = currentUser.username;
      userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
      loginRegisterBtn.style.display = "none";
      addSaldoBtn.style.display = "block";
      logoutBtn.style.display = "block";

      // Exibe imagem de perfil
      profilePic.src = "path/to/default-user-image.png"; // Ajuste o caminho para a imagem padrão
      profilePic.style.display = "block";

      // Adiciona evento para redirecionar ao perfil
      profilePic.addEventListener("click", () => {
        window.location.href = "profile.html";
      });
    } else {
      // Exibe interface para usuário não logado
      userNameDisplay.textContent = "Guest";
      userSaldoDisplay.textContent = "Saldo: R$0.00";
      loginRegisterBtn.style.display = "block";
      addSaldoBtn.style.display = "none";
      logoutBtn.style.display = "none";

      profilePic.style.display = "none";
    }
    populateBoxes();
  }

  // Popula as caixas disponíveis
  function populateBoxes() {
    const boxes = [
      { name: "White and Bright", price: 5.45, id: "white-and-bright", image: "pages/img-pag/box1.png" },
      { name: "Green Wood Dragon", price: 0.10, id: "green-wood-dragon", image: "img/box2.png" },
      { name: "Mystery Box", price: 10.00, id: "mystery-box", image: "img/box3.png" },
    ];

    gridContainer.innerHTML = ""; // Limpa o conteúdo existente
    boxes.forEach((box) => {
      const boxElement = document.createElement("div");
      boxElement.className = "grid-item";
      boxElement.innerHTML = `
        <img src="${box.image}" alt="${box.name}">
        <h3>${box.name}</h3>
        <p>R$${box.price.toFixed(2)}</p>
        <button class="enter-box-btn" data-id="${box.id}" ${currentUser ? "" : "disabled"}>Entrar na Caixa</button>
      `;
      gridContainer.appendChild(boxElement);
    });

    // Adiciona os eventos aos botões
    document.querySelectorAll(".enter-box-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const boxId = e.target.dataset.id;
        if (!currentUser) {
          alert("Você precisa fazer login para acessar esta caixa!");
          return;
        }
        window.location.href = `pages/white-and-bright.html?boxId=${boxId}`;
      });
    });
  }

  // Sair do usuário atual
  logoutBtn.addEventListener("click", () => {
    if (currentUser) {
      localStorage.removeItem("currentUser");
      currentUser = null;
      alert("Você saiu com sucesso.");
      updateUserInterface();
    }
  });

  // Inicializa a interface
  updateUserInterface();
});
