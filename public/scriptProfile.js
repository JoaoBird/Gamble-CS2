document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = "GambleCS2.html";
    return;
  }

  const userItemsKey = `user_items_${currentUser.username}`;
  const filterInput = document.getElementById("filter-input");
  const userItemsGrid = document.querySelector(".user-items-grid");
  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const profilePic = document.getElementById("profile-pic");
  const addBalanceBtn = document.getElementById("add-balance-btn");
  const addBalanceModal = document.getElementById("add-balance-modal");
  const closeModalButton = document.getElementById("close-modal");
  const balanceInput = document.getElementById("balance-input");
  const confirmAddBalanceButton = document.getElementById("confirm-add-balance");

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

  const updateSaldoDisplay = () => {
    if (userSaldoDisplay) {
      userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
    }
  };

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

  const renderUserItems = (filteredItems = null) => {
    const storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];
    const items = filteredItems || storedItems;

    userItemsGrid.innerHTML = "";

    if (items.length === 0) {
      userItemsGrid.innerHTML = "<p>Você ainda não ganhou itens.</p>";
      return;
    }

    // Exibir os itens mais recentes primeiro
    const sortedItems = [...items].sort((a, b) => b.timestamp - a.timestamp);

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
        sellButton.addEventListener("click", () => sellItem(item));
      }

      userItemsGrid.appendChild(itemElement);
    });

    renderSellAllButton();
  };

  const sellItem = (item) => {
    const storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];
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
      updateSaldoDisplay();

      renderUserItems();
    }
  };

  filterInput.addEventListener("input", () => {
    const searchText = filterInput.value.toLowerCase();
    const storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];
    const filteredItems = storedItems.filter((item) =>
      item.name.toLowerCase().includes(searchText)
    );
    renderUserItems(filteredItems);
  });

  addBalanceBtn.addEventListener("click", () => {
    addBalanceModal.style.display = "flex";
  });

  closeModalButton.addEventListener("click", () => {
    addBalanceModal.style.display = "none";
    balanceInput.value = "";
  });

  confirmAddBalanceButton.addEventListener("click", () => {
    const addAmount = parseFloat(balanceInput.value);

    if (isNaN(addAmount) || addAmount < 1) {
      alert("Por favor, insira um valor válido (mínimo R$1).");
      return;
    }

    currentUser.saldo += addAmount;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateUserInterface();
    addBalanceModal.style.display = "none";
    alert(`R$${addAmount.toFixed(2)} adicionados ao seu saldo!`);
  });

  window.addEventListener("click", (event) => {
    if (event.target === addBalanceModal) {
      addBalanceModal.style.display = "none";
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && addBalanceModal.style.display === "flex") {
      addBalanceModal.style.display = "none";
    }
  });

  updateUserInterface();
  renderUserItems();
});
