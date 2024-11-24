document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Você precisa fazer login para acessar esta página!");
    window.location.href = "../GambleCS2.html";
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const boxName = urlParams.get("boxName");
  const boxImage = urlParams.get("boxImage");
  const boxId = urlParams.get("boxId");
  const itemListContainer = document.getElementById("item-list-container");
  const rouletteContainer = document.getElementById("roulette-container");
  const openOptionsContainer = document.querySelector(".open-options");
  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const profilePic = document.getElementById("profile-pic");
  userNameDisplay.textContent = currentUser.username;
  userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  profilePic.style.display = "block";

  // Atualizar título e imagem da caixa


  document.title = boxName || "Caixa Desconhecida";

  const boxTitleElement = document.getElementById("box-title");
  const boxImageElement = document.getElementById("box-image");
  

  if (boxTitleElement && boxImageElement) {
    boxTitleElement.textContent = boxName || "Caixa Desconhecida";
    boxImageElement.src = boxImage || "/public/pages/img-pag/default-box.png";
  }

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
      { name: "Bayonet Damascus Steel", price: 266.35, image: "/public/pages/img-itens/Bayonet-Damascus-Steel.png" },
      { name: "Driver Gloves King Snake", price: 190.55, image: "/public/pages/img-itens/King-Snake.png" },
      { name: "Desert Eagle Printstream", price: 34.44, image: "/public/pages/img-itens/Desert-Printstream.png" },
      { name: "M4A4 Temukau", price: 12.20, image: "/public/pages/img-itens/M4A4-Temukau.png" },
      { name: "Desert Eagle Mecha Industries", price: 3.94, image: "/public/pages/img-itens/Desert-Mecha.png" },
      { name: "AK-47 Crossfade", price: 3.05, image: "/public/pages/img-itens/AK-47-Crossfade.png" },
      { name: "MP9 Airlock", price: 2.05, image: "/public/pages/img-itens/MP9-Airlock.png" },
      { name: "Five Seven Kami", price: 1.52, image: "/public/pages/img-itens/Five-Seven-Kami.png" },
      { name: "P250 Franklin", price: 0.68, image: "/public/pages/img-itens/P250-Franklin.png" },
      { name: "Desert Eagle Tilted", price: 0.58, image: "/public/pages/img-itens/Desert-Tilted.png" },
    ],
  };

  function calculateItemChances(items) {
    const totalWeight = items.reduce((sum, item) => sum + 1 / item.price, 0);
    return items.map((item) => ({
      ...item,
      chance: (1 / item.price) / totalWeight * 100,
    }));
  }

  function chooseItemBasedOnProbability(items) {
    const chances = items.map((item) => item.chance);
    const cumulativeChances = [];
    let sum = 0;
    chances.forEach((chance) => {
      sum += chance;
      cumulativeChances.push(sum);
    });

    const random = Math.random() * 100;
    for (let i = 0; i < cumulativeChances.length; i++) {
      if (random < cumulativeChances[i]) {
        return items[i];
      }
    }
    return items[items.length - 1];
  }

  function animateSquares(results, callback) {
    const totalDuration = 4000;
    const intervalTime = 100;
    const startTime = Date.now();
  
    // Esconde os botões enquanto a animação ocorre
    document.getElementById("open-box-btn").style.display = "none";
    document.querySelectorAll(".quantity-btn").forEach((btn) => (btn.style.display = "none"));
  
    results.forEach((finalItem) => {
      const square = document.createElement("div");
      square.classList.add("grid-item");
      rouletteContainer.appendChild(square);
  
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * items[boxId].length);
        const randomItem = items[boxId][randomIndex];
  
        square.innerHTML = `
          <img src="${randomItem.image}" alt="${randomItem.name}" style="width: 100%; max-width: 150px; margin-bottom: 10px;">
          <p>Carregando...</p>
        `;
  
        if (Date.now() - startTime > totalDuration) {
          clearInterval(interval);
          const isRare = finalItem.chance < 5;
          square.innerHTML = `
            <img src="${finalItem.image}" alt="${finalItem.name}" style="width: 100%; max-width: 150px; margin-bottom: 10px;" class="${isRare ? 'rare-item' : ''}">
            <h3>${finalItem.name}</h3>
            <p>R$${finalItem.price.toFixed(2)}</p>
            ${isRare ? `<p>Chance: ${finalItem.chance.toFixed(2)}%</p>` : ''}
            <button class="sell-btn">Vender</button>
          `;
  
          square.querySelector(".sell-btn").addEventListener("click", () => {
            currentUser.saldo += finalItem.price;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            updateSaldoDisplay();
            alert(`Você vendeu ${finalItem.name} por R$${finalItem.price.toFixed(2)}!`);
            square.remove();
            results = results.filter((item) => item !== finalItem);
          });
        }
      }, intervalTime);
    });
  
    // Salva os itens no perfil após a animação
    setTimeout(() => {
      saveItemsToUserProfile(results);
  
      document.getElementById("open-box-btn").style.display = "inline-block";
      document.querySelectorAll(".quantity-btn").forEach((btn) => (btn.style.display = "inline-block"));
  
      callback(results);
    }, totalDuration);
  }
  
  
  
  function addSellAllButton(results) {
    let sellAllButton = document.getElementById("sell-all-btn");
  
    // Função para calcular o valor total dos itens disponíveis para venda
    const calculateTotalValue = () => results.reduce((sum, item) => sum + item.price, 0);
  
    // Função para atualizar o texto do botão "Vender Tudo"
    const updateSellAllButtonText = () => {
      if (sellAllButton) {
        const totalValue = calculateTotalValue();
        sellAllButton.textContent = `Vender Tudo - R$${totalValue.toFixed(2)}`;
        sellAllButton.disabled = totalValue === 0; // Desabilita o botão se não houver mais itens
      }
    };
  
    // Função para remover o botão "Vender Tudo" se não houver mais itens
    const removeSellAllButtonIfNoItems = () => {
      if (results.length === 0 && sellAllButton) {
        sellAllButton.remove();
        sellAllButton = null;
      }
    };
  
    // Cria o botão "Vender Tudo" se ele não existir
    if (!sellAllButton) {
      sellAllButton = document.createElement("button");
      sellAllButton.id = "sell-all-btn";
      sellAllButton.style.backgroundColor = "#d9534f";
      sellAllButton.style.color = "#fff";
      sellAllButton.style.padding = "10px 20px";
      sellAllButton.style.border = "none";
      sellAllButton.style.borderRadius = "5px";
      sellAllButton.style.cursor = "pointer";
      sellAllButton.style.marginTop = "10px";
      sellAllButton.style.transition = "background-color 0.3s";
  
      const openBoxButton = document.getElementById("open-box-btn");
      openBoxButton.parentNode.insertBefore(sellAllButton, openBoxButton.nextSibling);
  
      // Adiciona evento para vender todos os itens
      sellAllButton.addEventListener("click", () => {
        const totalValue = calculateTotalValue();
        currentUser.saldo += totalValue; // Adiciona o valor total ao saldo
        localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Atualiza o saldo no localStorage
        updateSaldoDisplay();
        alert(`Você vendeu todos os itens por R$${totalValue.toFixed(2)}!`);
        results.length = 0; // Limpa os resultados
        rouletteContainer.innerHTML = ""; // Remove os itens da tela
        removeSellAllButtonIfNoItems(); // Remove o botão
      });
    }
  
    // Atualiza o texto do botão inicialmente
    updateSellAllButtonText();
  
    // Adiciona eventos de clique para vender individualmente os itens
    results.forEach((item) => {
      const itemElement = Array.from(rouletteContainer.children).find((element) =>
        element.querySelector("h3")?.textContent === item.name
      );
  
      if (itemElement) {
        const sellButton = itemElement.querySelector(".sell-btn");
  
        if (sellButton) {
          sellButton.addEventListener("click", () => {
            // Remove o item do array de resultados
            const index = results.findIndex((res) => res.name === item.name);
            if (index > -1) {
              results.splice(index, 1);
            }
            currentUser.saldo += item.price; // Adiciona o valor do item ao saldo
            localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Atualiza o saldo no localStorage
            updateSaldoDisplay(); // Atualiza o saldo exibido
            itemElement.remove(); // Remove o item da tela
            updateSellAllButtonText(); // Atualiza o texto do botão "Vender Tudo"
            removeSellAllButtonIfNoItems(); // Remove o botão se não houver mais itens
          });
        }
      }
    });
  }
  
  

  function openBoxes() {
    const totalCost = boxPrices[boxId] * selectedMultiplier;

    if (currentUser.saldo < totalCost) {
      alert("Saldo insuficiente!");
      return;
    }

    currentUser.saldo -= totalCost;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateSaldoDisplay();

    const results = [];
    for (let i = 0; i < selectedMultiplier; i++) {
      const itemWithChances = calculateItemChances(items[boxId]);
      results.push(chooseItemBasedOnProbability(itemWithChances));
    }

    animateSquares(results, addSellAllButton);
  }

  function renderItems() {
    itemListContainer.innerHTML = "";
    const itemWithChances = calculateItemChances(items[boxId]);
    itemWithChances.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("grid-item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>R$${item.price.toFixed(2)}</p>
        <p>Chance: ${item.chance.toFixed(2)}%</p>
      `;
      itemListContainer.appendChild(itemElement);
    });
  }

  function updateSaldoDisplay() {
    userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  }

  let selectedMultiplier = 1;

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
        <button id="open-box-btn">Abrir Caixa - R$${boxPrices[boxId].toFixed(2)}</button>
      </div>
    `;

    document.querySelectorAll(".quantity-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".quantity-btn").forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
        selectedMultiplier = parseInt(e.target.getAttribute("data-count"));
        document.getElementById("open-box-btn").textContent = `Abrir Caixa - R$${(boxPrices[boxId] * selectedMultiplier).toFixed(2)}`;
      });
    });

    document.getElementById("open-box-btn").addEventListener("click", openBoxes);
  }

  updateSaldoDisplay();
  renderItems();

  function saveItemsToUserProfile(items) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
  
    const userItemsKey = `user_items_${currentUser.username}`;
    const existingItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];
    const updatedItems = [...existingItems, ...items];
    localStorage.setItem(userItemsKey, JSON.stringify(updatedItems));
  }
  
  
  
});
