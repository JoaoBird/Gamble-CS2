document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const openLoginModalButton = document.getElementById("open-login-modal");
  const closeModalButton = document.getElementById("close-modal");
  const modalTitle = document.getElementById("modal-title");
  const actionButton = document.getElementById("actionButton");
  const toggleText = document.getElementById("toggleText");
  const toggleLink = document.getElementById("toggleLink");
  const usernameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("passwordInput");
  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const logoutBtn = document.getElementById("logout-btn");
  const profilePic = document.getElementById("profile-pic");
  const gridContainer = document.querySelector(".grid-container");
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let isLoginMode = true;

  // Alternar entre login e cadastro
  if (toggleLink) {
    toggleLink.addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      if (modalTitle) modalTitle.textContent = isLoginMode ? "Entrar" : "Cadastrar";
      if (actionButton) actionButton.textContent = isLoginMode ? "Entrar" : "Cadastrar";
      if (toggleText)
        toggleText.innerHTML = isLoginMode
          ? 'Não tem conta? <span style="cursor: pointer; color: #4CAF50;">Cadastre-se</span>'
          : 'Já tem conta? <span style="cursor: pointer; color: #4CAF50;">Entre</span>';
    });
  }

  // Ação de login/cadastro
  if (actionButton) {
    actionButton.addEventListener("click", () => {
      if (!usernameInput || !passwordInput) return;

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      if (isLoginMode) {
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
          currentUser = user;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          alert(`Bem-vindo, ${user.username}!`);
          if (loginModal) loginModal.style.display = "none";
          updateUserInterface();
        } else {
          alert("Usuário ou senha incorretos.");
        }
      } else {
        if (users.some((u) => u.username === username)) {
          alert("Usuário já cadastrado.");
        } else {
          users.push({ username, password, saldo: 0 });
          localStorage.setItem("users", JSON.stringify(users));
          alert("Usuário cadastrado com sucesso!");
          if (toggleLink) toggleLink.click();
        }
      }
    });
  }

  // Atualiza a interface
  function updateUserInterface() {
    if (currentUser) {
      if (userNameDisplay) userNameDisplay.textContent = currentUser.username;
      if (userSaldoDisplay)
        userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
      if (logoutBtn) logoutBtn.style.display = "block";
      if (openLoginModalButton) openLoginModalButton.style.display = "none";
      if (profilePic) {
        profilePic.src = "/public/pages/img-pag/CS2G-user.png"; // Caminho da imagem do avatar
        profilePic.style.display = "block";
        // Adiciona redirecionamento ao clicar no avatar
        profilePic.addEventListener("click", () => {
          window.location.href = "./profile.html"; // Caminho da página de perfil
        });
      }
    } else {
      if (userNameDisplay) userNameDisplay.textContent = "Guest";
      if (userSaldoDisplay) userSaldoDisplay.textContent = "Saldo: R$0.00";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (openLoginModalButton) openLoginModalButton.style.display = "block";
      if (profilePic) profilePic.style.display = "none";
    }
    if (gridContainer) populateBoxes();
  }

  // Popula as caixas no grid
  function populateBoxes() {
    const boxes = [
      { name: "White and Bright", price: 5.45, id: "white-and-bright", image: "pages/img-pag/box1.png" },
      { name: "Green Wood Dragon", price: 0.10, id: "green-wood-dragon", image: "img/box2.png" },
      { name: "Mystery Box", price: 10.00, id: "mystery-box", image: "img/box3.png" },
    ];

    if (!gridContainer) return;

    gridContainer.innerHTML = "";
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

  // Sair
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (currentUser) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex((u) => u.username === currentUser.username);
        if (userIndex !== -1) {
          users[userIndex].saldo = currentUser.saldo;
          localStorage.setItem("users", JSON.stringify(users));
        }
        localStorage.removeItem("currentUser");
        currentUser = null;
        alert("Você saiu com sucesso.");
        updateUserInterface();
      }
    });
  }

  if (openLoginModalButton) {
    openLoginModalButton.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "flex";
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "none";
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  updateUserInterface();
});