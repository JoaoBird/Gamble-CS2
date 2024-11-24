document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Verificar se o usuário está logado
  if (!currentUser) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = "GambleCS2.html";
    return;
  }

  // Chaves e elementos da interface
  const userItemsKey = `user_items_${currentUser.username}`;
  let storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];

  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const profilePic = document.getElementById("profile-pic");
  const profileUsername = document.getElementById("profile-username");
  const userItemsGrid = document.getElementById("user-items-grid");
  const addBalanceBtn = document.getElementById("add-balance-btn");
  const addBalanceModal = document.getElementById("add-balance-modal");
  const closeModal = document.getElementById("close-modal");
  const balanceInput = document.getElementById("balance-input");
  const confirmAddBalance = document.getElementById("confirm-add-balance");

  // Atualizar informações do usuário na interface
  const updateUserInterface = () => {
    if (userNameDisplay) userNameDisplay.textContent = currentUser.username;
    if (userSaldoDisplay) userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
    if (profilePic) {
      profilePic.src = currentUser.photo || "./pages/img-pag/CS2G-user.png";
      profilePic.style.display = "block";
    }
    if (profileUsername) profileUsername.textContent = currentUser.username;
  };

  // Atualizar saldo exibido na interface
  const updateSaldoDisplay = () => {
    if (userSaldoDisplay) {
      userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
    }
  };

  // Abrir modal de adicionar saldo
  if (addBalanceBtn && addBalanceModal) {
    addBalanceBtn.addEventListener("click", () => {
      addBalanceModal.style.display = "flex";
    });
  }

  // Fechar modal
  if (closeModal && addBalanceModal) {
    closeModal.addEventListener("click", () => {
      addBalanceModal.style.display = "none";
    });
  }

  // Adicionar saldo
  if (confirmAddBalance && balanceInput) {
    confirmAddBalance.addEventListener("click", () => {
      const value = parseFloat(balanceInput.value);

      if (value >= 1) {
        currentUser.saldo += value;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updateUserInterface();
        addBalanceModal.style.display = "none";
        alert(`Saldo adicionado com sucesso! Novo saldo: R$${currentUser.saldo.toFixed(2)}`);
      } else {
        alert("O valor mínimo para adicionar é R$1.");
      }
    });
  }

  // Renderizar itens do usuário
  const renderUserItems = () => {
    userItemsGrid.innerHTML = ""; // Limpar grid

    if (storedItems.length === 0) {
      userItemsGrid.innerHTML = "<p>Você ainda não ganhou itens.</p>";
      return;
    }

    storedItems.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("grid-item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100%; max-width: 150px; margin-bottom: 10px;">
        <h3>${item.name}</h3>
        <p>Valor: R$${item.price.toFixed(2)}</p>
        <button class="sell-btn" data-index="${index}">Vender</button>
      `;

      // Função para vender um item individual
      itemElement.querySelector(".sell-btn").addEventListener("click", () => {
        currentUser.saldo += item.price;
        storedItems.splice(index, 1); // Remover item do array
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        localStorage.setItem(userItemsKey, JSON.stringify(storedItems));
        updateSaldoDisplay();
        renderUserItems();
        alert(`Você vendeu ${item.name} por R$${item.price.toFixed(2)}!`);
      });

      userItemsGrid.appendChild(itemElement);
    });

    addSellAllButton(); // Adicionar botão de "Vender Tudo" se aplicável
  };

  // Adicionar botão "Vender Tudo"
  const addSellAllButton = () => {
    let sellAllButton = document.getElementById("profile-sell-all-btn");

    // Remover botão se não houver itens
    if (storedItems.length === 0) {
      if (sellAllButton) sellAllButton.remove();
      return;
    }

    // Calcular valor total dos itens
    const totalValue = storedItems.reduce((sum, item) => sum + item.price, 0);

    if (!sellAllButton) {
      sellAllButton = document.createElement("button");
      sellAllButton.id = "profile-sell-all-btn";
      sellAllButton.style.backgroundColor = "#28a745";
      sellAllButton.style.color = "#fff";
      sellAllButton.style.padding = "10px 20px";
      sellAllButton.style.border = "none";
      sellAllButton.style.borderRadius = "5px";
      sellAllButton.style.cursor = "pointer";
      sellAllButton.style.marginBottom = "10px";
      sellAllButton.style.transition = "background-color 0.3s";
      sellAllButton.textContent = `Vender Tudo - R$${totalValue.toFixed(2)}`;

      // Função para vender todos os itens
      sellAllButton.addEventListener("click", () => {
        if (storedItems.length > 0) {
          currentUser.saldo += totalValue; // Atualizar saldo
          localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Salvar saldo
          alert(`Você vendeu todos os itens por R$${totalValue.toFixed(2)}!`);
          storedItems.length = 0; // Limpar itens
          localStorage.setItem(userItemsKey, JSON.stringify(storedItems)); // Atualizar localStorage
          renderUserItems(); // Atualizar interface

          // Desativar botão e mudar aparência
          sellAllButton.disabled = true;
          sellAllButton.style.backgroundColor = "#6c757d";
          sellAllButton.style.cursor = "not-allowed";
          sellAllButton.textContent = "Todos os itens vendidos";
        }
      });

      userItemsGrid.parentNode.insertBefore(sellAllButton, userItemsGrid);
    }

    // Atualizar texto do botão
    sellAllButton.textContent = `Vender Tudo - R$${totalValue.toFixed(2)}`;
  };

  // Inicializar interface
  updateUserInterface();
  renderUserItems();
});
