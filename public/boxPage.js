document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const itemListContainer = document.getElementById("item-list-container");
  const rouletteContainer = document.getElementById("roulette-container");
  const openOptionsContainer = document.querySelector(".open-options");
  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const profilePic = document.getElementById("profile-pic");

  const urlParams = new URLSearchParams(window.location.search);
  const boxId = urlParams.get("boxId");

  // Validação de usuário e caixa
  if (!currentUser) {
    alert("Você precisa fazer login para acessar esta página!");
    window.location.href = "../GambleCS2.html";
    return;
  }

  if (!boxId) {
    alert("Caixa inválida!");
    window.location.href = "../GambleCS2.html";
    return;
  }

  const boxPrices = {
    "white-and-bright": 5.45,
    "green-wood-dragon": 0.10,
    "mystery-box": 10.00,
  };

  const items = {
    "white-and-bright": [
      { name: "Driver Gloves King Snake", price: 190.55, image: "/public/pages/img-itens/King-Snake.png" },
      { name: "Bayonet Damascus Steel", price: 266.35, image: "/public/pages/img-itens/Bayonet-Damascus-Steel.png" },
      { name: "Desert Eagle Printstream", price: 34.44, image: "/public/pages/img-itens/Desert-Printstream.png" },
    ],
  };

  if (!items[boxId]) {
    alert("Caixa inválida!");
    window.location.href = "../GambleCS2.html";
    return;
  }

  let boxPrice = boxPrices[boxId];
  let selectedMultiplier = 1;

  // Exibir nome, saldo e foto do usuário
  if (currentUser) {
    userNameDisplay.textContent = currentUser.username;
    userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
    profilePic.src = currentUser.photo || "/public/pages/img-pag/CS2G-user.png";
    profilePic.style.display = "block";
  }

  // Atualizar exibição de saldo
  function updateSaldoDisplay() {
    userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  }

  // Renderizar os itens disponíveis para a caixa
  function renderItems() {
    itemListContainer.innerHTML = "";
    items[boxId].forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("grid-item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>R$${item.price.toFixed(2)}</p>
      `;
      itemListContainer.appendChild(itemElement);
    });
  }

  // Animação de troca de imagens nos quadrados
  function animateSquares(results, callback) {
    const totalDuration = 3000;
    const intervalTime = 100;
    const startTime = Date.now();

    const randomizeSquare = (square, finalItem) => {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * items[boxId].length);
        const randomItem = items[boxId][randomIndex];

        square.innerHTML = `
          <img src="${randomItem.image}" alt="${randomItem.name}" style="width: 100%; max-width: 150px; margin-bottom: 10px;">
          <p>Carregando...</p>
        `;

        if (Date.now() - startTime > totalDuration) {
          clearInterval(interval);
          square.innerHTML = `
            <img src="${finalItem.image}" alt="${finalItem.name}" style="width: 100%; max-width: 150px; margin-bottom: 10px;">
            <h3>${finalItem.name}</h3>
            <p>R$${finalItem.price.toFixed(2)}</p>
            <button class="sell-btn">Vender</button>
          `;

          square.querySelector(".sell-btn").addEventListener("click", () => {
            currentUser.saldo += finalItem.price;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            updateSaldoDisplay();
            alert(`Você vendeu ${finalItem.name} por R$${finalItem.price.toFixed(2)}!`);
            square.remove();
          });
        }
      }, intervalTime);
    };

    results.forEach((finalItem) => {
      const square = document.createElement("div");
      square.classList.add("grid-item");
      rouletteContainer.appendChild(square);
      randomizeSquare(square, finalItem);
    });

    setTimeout(() => {
      // Salva os itens no perfil do usuário após a animação
      results.forEach((item) => {
        currentUser.items = currentUser.items || [];
        currentUser.items.push(item);
      });

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      callback(results);
    }, totalDuration);
  }

  // Adicionar botão "Vender Tudo"
  function addSellAllButton(results) {
    let sellAllButton = document.getElementById("sell-all-btn");
    if (!sellAllButton) {
      sellAllButton = document.createElement("button");
      sellAllButton.id = "sell-all-btn";
      sellAllButton.textContent = "Vender Tudo";
      sellAllButton.style.backgroundColor = "#d9534f";
      sellAllButton.style.color = "#fff";
      sellAllButton.style.padding = "10px 20px";
      sellAllButton.style.border = "none";
      sellAllButton.style.borderRadius = "5px";
      sellAllButton.style.cursor = "pointer";
      sellAllButton.style.transition = "background-color 0.3s";

      sellAllButton.addEventListener("click", () => {
        const totalValue = results.reduce((sum, item) => sum + item.price, 0);
        currentUser.saldo += totalValue;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updateSaldoDisplay();
        alert(`Você vendeu todos os itens por R$${totalValue.toFixed(2)}!`);
        rouletteContainer.innerHTML = ""; // Limpa os itens
        sellAllButton.remove();
      });

      // Adiciona o botão ao lado do botão "Abrir Caixa"
      const openBoxButton = document.getElementById("open-box-btn");
      openBoxButton.parentNode.insertBefore(sellAllButton, openBoxButton.nextSibling);
    }
  }

  // Abrir caixas
  function openBoxes() {
    const totalCost = boxPrice * selectedMultiplier;

    if (currentUser.saldo < totalCost) {
      alert("Saldo insuficiente!");
      return;
    }

    currentUser.saldo -= totalCost;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateSaldoDisplay();

    const results = [];
    for (let i = 0; i < selectedMultiplier; i++) {
      const randomIndex = Math.floor(Math.random() * items[boxId].length);
      results.push(items[boxId][randomIndex]);
    }

    animateSquares(results, addSellAllButton);
  }

  // Renderizar botões de opções
  if (openOptionsContainer) {
    openOptionsContainer.innerHTML = `
      <div style="text-align: center;">
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <button data-count="1" class="quantity-btn">1x</button>
          <button data-count="2" class="quantity-btn">2x</button>
          <button data-count="3" class="quantity-btn">3x</button>
          <button data-count="5" class="quantity-btn">5x</button>
          <button data-count="10" class="quantity-btn">10x</button>
        </div>
        <button id="open-box-btn">Abrir Caixa - R$${boxPrice.toFixed(2)}</button>
      </div>
    `;

    document.querySelectorAll(".quantity-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".quantity-btn").forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
        selectedMultiplier = parseInt(e.target.getAttribute("data-count"));
        document.getElementById("open-box-btn").textContent = `Abrir Caixa - R$${(boxPrice * selectedMultiplier).toFixed(2)}`;
      });
    });

    document.getElementById("open-box-btn").addEventListener("click", openBoxes);
  }

  updateSaldoDisplay();
  renderItems();
});
