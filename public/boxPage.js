document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Verifica se o usuário está logado
  if (!currentUser) {
    alert("Você precisa fazer login para abrir uma caixa!");
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

  const winningsContainer = document.querySelector(".winnings");
  const saldoDisplay = document.getElementById("saldo-atual");
  const itemListContainer = document.querySelector(".grid-container");

  // Atualiza o saldo exibido na interface
  function updateSaldoDisplay() {
    saldoDisplay.textContent = `R$${currentUser.saldo.toFixed(2)}`;
  }

  // Renderiza os itens da caixa na interface
  function renderItems() {
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

  // Abre caixas e exibe os resultados
  function openBoxes(count) {
    const boxPrice = 5.45; // Preço fixo por caixa (pode ser ajustado para cada caixa)
    const totalCost = boxPrice * count;

    if (currentUser.saldo < totalCost) {
      alert("Saldo insuficiente!");
      return;
    }

    // Deduz o saldo do usuário
    currentUser.saldo -= totalCost;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateSaldoDisplay();

    // Gera os resultados
    const results = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * items[boxId].length);
      results.push(items[boxId][randomIndex]);
    }

    displayResults(results);
  }

  // Exibe os resultados na interface
  function displayResults(results) {
    winningsContainer.innerHTML = ""; // Limpa resultados anteriores
    results.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <p>${item.name} - R$${item.price.toFixed(2)}</p>
      `;
      winningsContainer.appendChild(itemElement);
    });
  }

  // Adiciona eventos para os botões de abrir caixas
  document.querySelectorAll(".open-options button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const count = parseInt(btn.getAttribute("data-count"));
      openBoxes(count);
    });
  });

  // Inicializa a interface
  updateSaldoDisplay();
  renderItems();
});
