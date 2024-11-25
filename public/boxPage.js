let selectedMultiplier = 1;

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Verificar se o usuário está logado
  if (!currentUser) {
    alert("Você precisa fazer login para acessar esta página!");
    window.location.href = "../GambleCS2.html";
    return;
  }

  const userItemsKey = `user_items_${currentUser.username}`;
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

  // Atualizar interface inicial
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

  if (!boxId) {
    alert("Caixa inválida!");
    window.location.href = "../GambleCS2.html";
    return;
  }

  const boxPrices = {
    "white-and-bright": 5.45,
    "green-wood-dragon": 0.20,
    "doppler-mining": 1.17,
    "pandoras-box":26.03,
    "lazy-tiger":58.99,

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
    "green-wood-dragon": [
      { name: "M4A4 In Living Color", price: 8.5, image: "/public/pages/img-itens/M4A4-Color.png" },
      { name: "AK-47 Ice Coaled", price: 4.78, image: "/public/pages/img-itens/AK-47-Ice.png" },
      { name: "AWP Worm God", price: 1.39, image: "/public/pages/img-itens/AWP-Worm-God.png" },
      { name: "M4A1-S Emphorosaur-S", price: 0.397, image: "/public/pages/img-itens/M4A1-Emphorosaur-S.png" },
      { name: "MP9 Sand Scale", price: 0.149, image: "/public/pages/img-itens/MP9-Sand-Scale.png" },
      { name: "SG553 Atlas", price: 0.129, image: "/public/pages/img-itens/SG553-Atlas.png" },
      { name: "UMP-45 Gunsmoke", price: 0.036, image: "/public/pages/img-itens/UMP-45-Gunsmoke.png" },
      { name: "Nova Sand Dune", price: 0.009, image: "/public/pages/img-itens/Nova-Sand-Dune.png" },
      { name: "SCAR-20 Sand Mash", price: 0.008, image: "/public/pages/img-itens/SCAR-20-Sand-Mash.png" },
      { name: "G3SG1 Desert Storm", price: 0.006, image: "/public/pages/img-itens/G3SG1-Desert-Storm.png" },
    ],
    "doppler-mining": [
      { name: "Talon Knife Doppler", price: 990.92, image: "/public/pages/img-itens/Talon-Doppler.png" },
      { name: "Gut Knife Doppler", price: 201.92, image: "/public/pages/img-itens/Gut-Doppler.png" },
      { name: "MAC-10 Candy Apple", price: 0.134, image: "/public/pages/img-itens/MAC-10-Candy-Apple.png" },
      { name: "G3SG1 Green Apple", price: 0.076, image: "/public/pages/img-itens/G3SG1-Green-Apple.png" },
      { name: "MP5-SD Desert Strike", price: 0.075, image: "/public/pages/img-itens/MP5-SD-Desert-Strike.png" },
      { name: "AK-47 Safari Mesh", price: 0.071, image: "/public/pages/img-itens/AK-47-Safari-Mesh.png" },
      { name: "MP7 Motherboard", price: 0.055, image: "/public/pages/img-itens/MP7-Motherboard.png" },
      { name: "UMP-45 Gunsmoke", price: 0.036, image: "/public/pages/img-itens/UMP-45-Gunsmoke.png" },
      { name: "PP-Bizon Night Ops", price: 0.034, image: "/public/pages/img-itens/PP-Bizon-Night-Ops.png" },
    ],
    "pandoras-box": [
    { name: "Sport Gloves Superconductor", price: 4007.68, image: "/public/pages/img-itens/Sport-Gloves-Superconductor.png" },
    { name: "Moto Gloves Cool Mint", price: 148.98, image: "/public/pages/img-itens/Moto-Gloves-Cool-Mint.png" },
    { name: "Hand Wraps Duct Tape", price: 85.82, image: "/public/pages/img-itens/Hand-Wraps-Duct-Tape.png" },
    { name: "M9 Bayonet Doppler", price: 1305.51, image: "/public/pages/img-itens/M9-Bayonet-Doppler.png" },
    { name: "Karambit Bright Water", price: 645.92, image: "/public/pages/img-itens/Karambit-Bright-Water.png" },
    { name: "AWP Medusa", price: 1601.85, image: "/public/pages/img-itens/AWP-Medusa.png" },
    { name: "M4A1-S Printstream", price: 184.07, image: "/public/pages/img-itens/M4A1-S-Printstream.png" },
    { name: "AWP Neo-Noir", price: 22.24, image: "/public/pages/img-itens/AWP-Neo-Noir.png" },
    { name: "AK-47 Ice Coaled", price: 4.78, image: "/public/pages/img-itens/AK-47-Ice.png" },
    { name: "M4A1-S Decimator", price: 10.88, image: "/public/pages/img-itens/M4A1-S-Decimator.png" },
    { name: "AWP Sun in Leo", price: 22.15, image: "/public/pages/img-itens/AWP-Sun-in-Leo.png" },
    ],
    "lazy-tiger": [
    { name: "Butterfly Knife Tiger Tooth", price: 1634.7, image: "/public/pages/img-itens/Butterfly-Knife-Tiger-Tooth.png" },
    { name: "Karambit Tiger Tooth", price: 1172.61, image: "/public/pages/img-itens/Karambit-Tiger-Tooth.png" },
    { name: "M4A1-S Blood Tiger", price: 5.4, image: "/public/pages/img-itens/M4A1-S-Blood-Tiger.png" },
    { name: "P250 Bengal Tiger", price: 12.2, image: "/public/pages/img-itens/P250-Bengal-Tiger.png" },
    { name: "AUG Bengal Tiger", price: 6.29, image: "/public/pages/img-itens/AUG-Bengal-Tiger.png" }
    ],


  };

  // Atualizar informações do usuário na interface
  userNameDisplay.textContent = currentUser.username;
  userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  profilePic.style.display = "block";

  // Adicionar evento de redirecionamento ao clicar no nome ou na foto do usuário
  [userNameDisplay, profilePic].forEach((element) => {
    element.addEventListener("click", () => {
      window.location.href = "../profile.html";
    });
    element.style.cursor = "pointer";
  });


  // Função para exibir o botão "Ir para o Perfil"
  function displayProfileButton() {
    // Verifica se o botão já foi criado
    if (document.getElementById("profile-link")) {
        return;
    }

    // Criação do contêiner para o botão
    const profileButtonContainer = document.createElement("div");
    profileButtonContainer.id = "profile-button-container";
    profileButtonContainer.innerHTML = `
      <button id="profile-link" style="
        background-color: #28a745;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        margin-top: 10px;
        cursor: pointer;">
        Ir para o Perfil
      </button>
    `;
    profileButtonContainer.style.textAlign = "center";

    // Localiza o botão "Abrir Caixa" e insere o botão de perfil logo abaixo
    const openBoxButton = document.getElementById("open-box-btn");
    if (openBoxButton) {
        openBoxButton.parentNode.appendChild(profileButtonContainer);
    }

    // Adiciona evento de clique no botão
    document.getElementById("profile-link").addEventListener("click", () => {
        window.location.href = "../profile.html";
    });

    // Adiciona evento de clique no botão
    document.getElementById("profile-link").addEventListener("click", () => {
        window.location.href = "../profile.html";
    });
}



  function renderItems() {
    // Limpa os itens existentes
    itemListContainer.innerHTML = "";
  
    // Calcula as chances dos itens
    const itemWithChances = calculateItemChances(items[boxId]);
  
    // Renderiza cada item
    itemWithChances.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("grid-item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100%; max-width: 150px; margin-bottom: 10px;">
        <h3>${item.name}</h3>
        <p>R$${item.price.toFixed(2)}</p>
        <p>Chance: ${item.chance.toFixed(2)}%</p>
      `;
      itemListContainer.appendChild(itemElement);
    });
  }
  
  // Função chamada após o carregamento inicial
  renderItems();
  
  function saveItemsToUserProfile(newItems) {
    let storedItems = JSON.parse(localStorage.getItem(userItemsKey)) || [];
    storedItems = [...storedItems, ...newItems];
    localStorage.setItem(userItemsKey, JSON.stringify(storedItems));
  }

  function calculateItemChances(items) {
    const totalWeight = items.reduce((sum, item) => sum + 1 / item.price, 0);
    return items.map((item) => ({
      ...item,
      chance: ((1 / item.price) / totalWeight) * 100,
    }));
  }
  
  function chooseItemBasedOnProbability(items, lastSelectedItems) {
    const itemWithChances = calculateItemChances(items);
    const cumulativeChances = [];
    let sum = 0;
  
    itemWithChances.forEach((item) => {
      sum += item.chance;
      cumulativeChances.push(sum);
    });
  
    let selectedItem;
    let attempts = 0;
    do {
      const random = Math.random() * 100; // Número aleatório entre 0 e 100
      for (let i = 0; i < cumulativeChances.length; i++) {
        if (random <= cumulativeChances[i]) {
          selectedItem = itemWithChances[i];
          break;
        }
      }
      attempts++;
      // Evitar repetições consecutivas
    } while (lastSelectedItems.includes(selectedItem.name) && attempts < 5);
  
    return selectedItem || itemWithChances[itemWithChances.length - 1]; // Retorna o último como fallback
  }
  
  function openBoxes() {
    const totalCost = boxPrices[boxId] * selectedMultiplier;
  
    if (currentUser.saldo < totalCost) {
      alert("Saldo insuficiente!");
      return;
    }
  
    currentUser.saldo -= totalCost; // Deduz saldo
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateSaldoDisplay();
  
    const lastSelectedItems = [];
    const results = Array.from({ length: selectedMultiplier }, () => {
      const item = chooseItemBasedOnProbability(items[boxId], lastSelectedItems);
      lastSelectedItems.push(item.name);
      return item;
    });
  
    animateSquares(results); // Exibe os itens
    saveItemsToUserProfile(results); // Salva no perfil
  }
  

  function chooseItemBasedOnProbability(items, lastSelectedItems) {
    const itemWithChances = calculateItemChances(items);
    const cumulativeChances = [];
    let sum = 0;
  
    itemWithChances.forEach((item) => {
      sum += item.chance;
      cumulativeChances.push(sum);
    });
  
    let selectedItem;
    let attempts = 0;
    do {
      const random = Math.random() * 100; // Número aleatório entre 0 e 100
      for (let i = 0; i < cumulativeChances.length; i++) {
        if (random <= cumulativeChances[i]) {
          selectedItem = itemWithChances[i];
          break;
        }
      }
      attempts++;
      // Evitar repetições consecutivas
    } while (lastSelectedItems.includes(selectedItem.name) && attempts < 5);
  
    return selectedItem || itemWithChances[itemWithChances.length - 1]; // Retorna o último como fallback
  }

  function displayProfileButton() {
    // Verifica se o botão já foi criado
    if (document.getElementById("profile-link")) {
      return;
    }
  
    // Criação do contêiner para o botão
    const profileButtonContainer = document.createElement("div");
    profileButtonContainer.id = "profile-button-container";
    profileButtonContainer.innerHTML = `
      <button id="profile-link" style="
        background-color: #28a745;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        margin-top: 20px;
        cursor: pointer;">
        Ir para o Perfil
      </button>
    `;
    profileButtonContainer.style.textAlign = "center";
  
    // Adiciona o botão logo abaixo da roleta
    const parentContainer = document.getElementById("roulette-container");
    if (parentContainer) {
      parentContainer.parentNode.appendChild(profileButtonContainer);
    }
  
    // Adiciona evento de clique no botão
    const profileButton = document.getElementById("profile-link");
    if (profileButton) {
      profileButton.addEventListener("click", () => {
        window.location.href = "../profile.html";
      });
    }
  }
  
  function animateSquares(results) {
    const totalDuration = 4000; // Duração total da animação
    const intervalTime = 100; // Intervalo entre as mudanças
    const startTime = Date.now();

    if (results.length < 5) {
      rouletteContainer.style.display = "flex";
      rouletteContainer.style.justifyContent = "center";
      rouletteContainer.style.gap = "10px";
    } else {
      rouletteContainer.style.display = "grid";

    }

    // Limpa os resultados anteriores na roleta
    rouletteContainer.innerHTML = "";
  
    results.forEach((item, index) => {
      const square = document.createElement("div");
      square.classList.add("grid-item");
      rouletteContainer.appendChild(square);
  
      const interval = setInterval(() => {
        const randomItem = items[boxId][Math.floor(Math.random() * items[boxId].length)];
        square.innerHTML = `
          <img src="${randomItem.image}" alt="${randomItem.name}" style="width: 100px;">
          <p>Carregando...</p>
        `;
  
        if (Date.now() - startTime > totalDuration) {
          clearInterval(interval);
          square.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 100px;">
            <h3>${item.name}</h3>
            <p>R$${item.price.toFixed(2)}</p>
          `;
        }
            // Adicionar brilho se a chance do item for menor ou igual a 5%
    if (item.chance <= 5) {
      setTimeout(() => {
        square.style.border = "2px solid gold";
        square.style.boxShadow = "0 0 20px 5px rgba(255, 215, 0, 0.8)";
        square.style.transition = "all 0.3s ease-in-out";
      }, 4000); // Aplica o brilho logo após o término da rotação
    }
      }, intervalTime); // Incremento para diferenciar animações simultâneas
    });
  
    // Exibe o botão "Ir para o Perfil" após a animação terminar
    setTimeout(() => {
      displayProfileButton();
    }, totalDuration);
  }
  

  
  // Mostra o botão "Ir para o Perfil" após a roleta girar
  function displayProfileButton() {
    if (document.getElementById("profile-link")) return;

    const profileButton = document.createElement("button");
    profileButton.id = "profile-link";
    profileButton.textContent = "Ir para o Perfil";
    profileButton.style.cssText = `
      background-color: #28a745;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    `;

    profileButton.addEventListener("click", () => {
      window.location.href = "../profile.html";
    });

    const openBoxButton = document.getElementById("open-box-btn");
    openBoxButton.parentNode.appendChild(profileButton);
  }

  function openBoxes() {
    const totalCost = boxPrices[boxId] * selectedMultiplier;
  
    if (currentUser.saldo < totalCost) {
      alert("Saldo insuficiente!");
      return;
    }
  
    // Deduz o saldo e atualiza o localStorage
    currentUser.saldo -= totalCost;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateSaldoDisplay();
    
    // Gera os resultados com base no número de caixas abertas
    const lastSelectedItems = [];
    const results = Array.from({ length: selectedMultiplier }, () => {
    const item = chooseItemBasedOnProbability(items[boxId], lastSelectedItems);
    lastSelectedItems.push(item.name);
    return item;
  });
  
    // Anima e exibe os resultados
    animateSquares(results);
  
    // Salva os itens no perfil do usuário
    saveItemsToUserProfile(results);
  }

  function updateSaldoDisplay() {
    userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  }

  if (openOptionsContainer) {
    const initialPrice = boxPrices[boxId];
    openOptionsContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 10px;">
          <button data-count="1" class="quantity-btn">1x</button>
          <button data-count="2" class="quantity-btn">2x</button>
          <button data-count="3" class="quantity-btn">3x</button>
          <button data-count="5" class="quantity-btn">5x</button>
          <button data-count="10" class="quantity-btn">10x</button>
        </div>
        <button id="open-box-btn">Abrir Caixa - R$${initialPrice.toFixed(2)}</button>
        <p style="margin-top: 10px; color: #aaa; font-size: 14px;">Atenção: as skins só podem ser vendidas na página de Perfil do usuário.</p>
      </div>
    `;


    document.querySelectorAll(".quantity-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".quantity-btn").forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
        selectedMultiplier = parseInt(e.target.getAttribute("data-count"));
        document.getElementById(
          "open-box-btn"
        ).textContent = `Abrir Caixa - R$${(boxPrices[boxId] * selectedMultiplier).toFixed(2)}`;
      });
    });
    

    document.getElementById("open-box-btn").addEventListener("click", openBoxes);
  }

  updateSaldoDisplay();
});
