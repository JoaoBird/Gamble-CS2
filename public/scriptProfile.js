document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = "GambleCS2.html";
    return;
  }

  const userItemsKey = `user_items_${currentUser.username}`;
  let storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];

  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const profilePic = document.getElementById("profile-pic");
  const profileUsername = document.getElementById("profile-username");
  const userItemsGrid = document.getElementById("user-items-grid");

  userNameDisplay.textContent = currentUser.username;
  userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  profilePic.src = currentUser.photo || "./pages/img-pag/CS2G-user.png";
  profilePic.style.display = "block";
  profileUsername.textContent = currentUser.username;

  const renderUserItems = () => {
    userItemsGrid.innerHTML = "";
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

      itemElement.querySelector(".sell-btn").addEventListener("click", () => {
        currentUser.saldo += item.price;
        storedItems.splice(index, 1);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        localStorage.setItem(userItemsKey, JSON.stringify(storedItems));
        updateSaldoDisplay();
        renderUserItems();
        alert(`Você vendeu ${item.name} por R$${item.price.toFixed(2)}!`);
      });

      userItemsGrid.appendChild(itemElement);
    });

    addSellAllButton();
  };

  const updateSaldoDisplay = () => {
    userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  };

  const addSellAllButton = () => {
    let sellAllButton = document.getElementById("profile-sell-all-btn");

    if (storedItems.length === 0) {
        if (sellAllButton) {
            sellAllButton.remove(); // Remove o botão se não houver itens
        }
        return;
    }

    const totalValue = storedItems.reduce((sum, item) => sum + item.price, 0);

    if (!sellAllButton) {
        sellAllButton = document.createElement("button");
        sellAllButton.id = "profile-sell-all-btn";
        sellAllButton.style.backgroundColor = "#28a745"; // Cor verde
        sellAllButton.style.color = "#fff";
        sellAllButton.style.padding = "10px 20px";
        sellAllButton.style.border = "none";
        sellAllButton.style.borderRadius = "5px";
        sellAllButton.style.cursor = "pointer";
        sellAllButton.style.marginBottom = "10px";
        sellAllButton.style.transition = "background-color 0.3s";
        sellAllButton.textContent = `Vender Tudo - R$${totalValue.toFixed(2)}`;

        sellAllButton.addEventListener("click", () => {
            if (storedItems.length > 0) {
                currentUser.saldo += totalValue; // Atualiza o saldo
                localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Atualiza o saldo no localStorage
                alert(`Você vendeu todos os itens por R$${totalValue.toFixed(2)}!`);
                storedItems.length = 0; // Limpa o array de itens
                localStorage.setItem(userItemsKey, JSON.stringify(storedItems)); // Atualiza os itens no localStorage
                renderUserItems(); // Atualiza o grid
                
                // Desativa o botão e muda a aparência
                sellAllButton.disabled = true;
                sellAllButton.style.backgroundColor = "#6c757d"; // Cor cinza
                sellAllButton.style.cursor = "not-allowed";
                sellAllButton.textContent = "Todos os itens vendidos";
            }
        });

        userItemsGrid.parentNode.insertBefore(sellAllButton, userItemsGrid);
    }

    sellAllButton.textContent = `Vender Tudo - R$${totalValue.toFixed(2)}`;
};


  renderUserItems();
});
