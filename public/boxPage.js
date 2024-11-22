document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Verifica se o usuário está logado
  if (!currentUser) {
    alert("Você precisa fazer login para acessar esta página!");
    window.location.href = "../GambleCS2.html";
    return;
  }

  // Recupera o ID da caixa da URL
  const urlParams = new URLSearchParams(window.location.search);
  const boxId = urlParams.get("boxId");

  // Define os itens disponíveis por caixa
  const items = {
    "white-and-bright": [
      { name: "Driver Gloves King Snake", price: 190.55, image: "./img-itens/King-Snake.png" },
      { name: "Bayonet Damascus Steel", price: 266.35, image: "./img-itens/Bayonet-Damascus-Steel.png" },
      { name: "Desert Eagle Printstream", price: 34.44, image: "./img-itens/Desert-Printstream.png" },
    ],
    "green-wood-dragon": [
      { name: "Green Dragon", price: 50.0, image: "../img-itens/green-dragon.png" },
      { name: "Wooden Shield", price: 15.0, image: "../img-itens/wooden-shield.png" },
    ],
    "mystery-box": [
      { name: "Mystery Item 1", price: 50, image: "../img-itens/mystery1.png" },
      { name: "Mystery Item 2", price: 100, image: "../img-itens/mystery2.png" },
    ],
  };

  // Verifica se o boxId é válido
  if (!boxId || !items[boxId]) {
    alert("Caixa inválida!");
    window.location.href = "../GambleCS2.html";
    return;
  }

  const saldoDisplay = document.getElementById("saldo-atual");
  const itemListContainer = document.querySelector(".grid-container");
  const rouletteContainer = document.getElementById("roulette-container");

  // Atualiza o saldo exibido na interface
  function updateSaldoDisplay() {
    if (saldoDisplay && currentUser) {
      saldoDisplay.textContent = `R$${currentUser.saldo.toFixed(2)}`;
    }
  }

  // Renderiza os itens da caixa
  function renderItems() {
    if (!itemListContainer || !items[boxId]) return;

    itemListContainer.innerHTML = ""; // Limpa os itens anteriores
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

  // Renderiza a roleta com os resultados
  function renderRoulette(results) {
    if (!rouletteContainer) {
      console.error("Erro: Elemento da roleta não encontrado!");
      return;
    }

    rouletteContainer.innerHTML = ""; // Limpa roletas existentes
    rouletteContainer.style.display = "block"; // Torna a roleta visível

    results.forEach((item, index) => {
      const rouletteElement = document.createElement("div");
      rouletteElement.classList.add("roulette-item");

      rouletteElement.innerHTML = `
        <img src="./img-itens/placeholder.png" alt="Roleta em andamento" id="roulette-item-img-${index}">
        <p id="roulette-item-text-${index}">Girando...</p>
      `;

      rouletteContainer.appendChild(rouletteElement);

      // Simula rotação e finaliza no item correto
      animateRoulette(index, item);
    });
  }

  function animateRoulette(index, winningItem) {
    const rouletteImg = document.getElementById(`roulette-item-img-${index}`);
    const rouletteText = document.getElementById(`roulette-item-text-${index}`);

    if (!rouletteImg || !rouletteText) {
      console.error("Erro: Elementos da roleta não encontrados!");
      return;
    }

    let interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items[boxId].length);
      const randomItem = items[boxId][randomIndex];
      rouletteImg.src = randomItem.image;
      rouletteText.textContent = randomItem.name;
    }, 100);

    // Finaliza a roleta no item correto após 3 segundos
    setTimeout(() => {
      clearInterval(interval);
      rouletteImg.src = winningItem.image;
      rouletteText.textContent = `${winningItem.name} - R$${winningItem.price.toFixed(2)}`;

      // Adiciona botões para vender ou abrir novamente
      rouletteContainer.innerHTML += `
        <button class="sell-btn">Vender por R$${winningItem.price.toFixed(2)}</button>
        <button class="open-again-btn">Abrir Novamente</button>
      `;

      document.querySelector(".sell-btn").addEventListener("click", () => {
        currentUser.saldo += winningItem.price;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert("Item vendido!");
        location.reload();
      });

      document.querySelector(".open-again-btn").addEventListener("click", () => {
        location.reload();
      });
    }, 3000);
  }

  // Abre caixas e exibe os resultados
  function openBoxes(count) {
    const boxPrice = 5.45; // Preço fixo por caixa
    const totalCost = boxPrice * count;

    if (currentUser.saldo < totalCost) {
      alert("Saldo insuficiente para abrir essas caixas!");
      return;
    }

    // Deduz o saldo
    currentUser.saldo -= totalCost;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateSaldoDisplay();

    // Gera os resultados
    const results = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * items[boxId].length);
      results.push(items[boxId][randomIndex]);
    }

    renderRoulette(results); // Exibe a roleta
  }

  // Configura os botões de abrir caixas
  const openOptionsContainer = document.querySelector(".open-options");
  openOptionsContainer.innerHTML = `
    <span style="font-size: 18px; font-weight: bold; margin-right: 10px;">Abrir Caixa</span>
    <button data-count="1">1x</button>
    <button data-count="2">2x</button>
    <button data-count="3">3x</button>
    <button data-count="5">5x</button>
    <button data-count="10">10x</button>
  `;

  document.querySelectorAll(".open-options button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const count = parseInt(btn.getAttribute("data-count"));
      openBoxes(count);
    });
  });

  updateSaldoDisplay();
  renderItems();
});
