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
  const userItemsGrid = document.querySelector(".user-items-grid");
  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const profilePic = document.getElementById("profile-pic");

  // Elementos do modal
  const addBalanceBtn = document.getElementById("add-balance-btn");
  const addBalanceModal = document.getElementById("add-balance-modal"); // Usando o modal específico de saldo
  const closeModalButton = document.getElementById("close-modal");
  const balanceInput = document.getElementById("balance-input");
  const confirmAddBalanceButton = document.getElementById("confirm-add-balance");
  const modalTitle = document.getElementById("modal-title");

  // Atualizar informações do usuário na interface
  const updateUserInterface = () => {
    if (userNameDisplay) {
      userNameDisplay.textContent = `Bem-vindo, ${currentUser.username}!`;
    }
    if (userSaldoDisplay) {
      userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
    }
    if (profilePic) {
      profilePic.src = currentUser.photo || "./pages/img-pag/CS2G-user.png";
      profilePic.style.display = "block";
    }
  };

  // Abrir o modal
  addBalanceBtn.addEventListener("click", () => {
    addBalanceModal.style.display = "flex";
  });

  // Fechar o modal
  closeModalButton.addEventListener("click", () => {
    addBalanceModal.style.display = "none";
    balanceInput.value = ""; // Limpa o valor do campo de entrada
  });

  // Confirmar adição de saldo
  const addBalance = () => {
    const addAmount = parseFloat(balanceInput.value);

    if (isNaN(addAmount) || addAmount < 1) {
      alert("Por favor, insira um valor válido (mínimo R$1).");
      return;
    }

    // Atualizar saldo do usuário
    currentUser.saldo += addAmount;
    localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Salvar no localStorage
    updateUserInterface(); // Atualizar interface
    addBalanceModal.style.display = "none"; // Fechar modal
    alert(`R$${addAmount.toFixed(2)} adicionados ao seu saldo!`);
  };

  // Fechar o modal ao clicar fora da área do conteúdo
  window.addEventListener("click", (event) => {
    if (event.target === addBalanceModal) {
      addBalanceModal.style.display = "none";
    }
  });

  // Fechar o modal ao pressionar a tecla ESC
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && addBalanceModal.style.display === "flex") {
      addBalanceModal.style.display = "none";
    }
  });

  confirmAddBalanceButton.addEventListener("click", addBalance);

  // Atualizar saldo exibido na interface
  const updateSaldoDisplay = () => {
    if (userSaldoDisplay) {
      userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
    }
  };

  // Renderizar o botão "Vender Tudo"
  const renderSellAllButton = () => {
    const storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];
    const itemsToSell = storedItems.filter((item) => !item.sold);

    let sellAllButton = document.getElementById("sell-all-btn");

    if (itemsToSell.length === 0) {
      if (sellAllButton) {
        sellAllButton.remove();
      }
      return;
    }

    const totalValue = itemsToSell.reduce((sum, item) => sum + item.price, 0);

    if (!sellAllButton) {
      sellAllButton = document.createElement("button");
      sellAllButton.id = "sell-all-btn";
      sellAllButton.textContent = `Vender Tudo - R$${totalValue.toFixed(2)}`;
      sellAllButton.className = "sell-all-btn";

      sellAllButton.addEventListener("click", () => {
        itemsToSell.forEach((item) => (item.sold = true));
        localStorage.setItem(userItemsKey, JSON.stringify(storedItems));
        currentUser.saldo += totalValue;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert(`Você vendeu todos os itens por R$${totalValue.toFixed(2)}!`);
        renderUserItems();
        updateSaldoDisplay();
        sellAllButton.remove();
      });

      const container = document.querySelector(".items-container");
      container.insertBefore(sellAllButton, userItemsGrid);
    } else {
      sellAllButton.textContent = `Vender Tudo - R$${totalValue.toFixed(2)}`;
    }
  };

  // Renderizar itens do usuário
  const renderUserItems = () => {
    const storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];
    userItemsGrid.innerHTML = "";

    if (storedItems.length === 0) {
      userItemsGrid.innerHTML = "<p>Você ainda não ganhou itens.</p>";
      return;
    }

    const sortedItems = storedItems.slice().reverse();

    sortedItems.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("grid-item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>Valor: R$${item.price.toFixed(2)}</p>
        <button class="sell-btn" ${item.sold ? "disabled" : ""}>
          ${item.sold ? "Vendido" : "Vender"}
        </button>
      `;

      const sellButton = itemElement.querySelector(".sell-btn");
      if (item.sold) {
        itemElement.style.opacity = "0.5";
        sellButton.style.backgroundColor = "#6c757d";
      } else {
        sellButton.addEventListener("click", () => {
          const itemIndex = storedItems.findIndex(
            (storedItem) =>
              storedItem.name === item.name &&
              storedItem.image === item.image &&
              !storedItem.sold
          );

          if (itemIndex !== -1) {
            storedItems[itemIndex].sold = true;
            localStorage.setItem(userItemsKey, JSON.stringify(storedItems));
            currentUser.saldo += item.price;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert(`Você vendeu ${item.name} por R$${item.price.toFixed(2)}!`);
            renderUserItems();
            updateSaldoDisplay();
          }
        });
      }

      userItemsGrid.appendChild(itemElement);
    });

    renderSellAllButton();
  };

  // Inicializar interface
  updateUserInterface();
  renderUserItems();
});
