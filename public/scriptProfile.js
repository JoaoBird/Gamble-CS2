document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = "GambleCS2.html";
    return;
  }

  const userNameDisplay = document.getElementById("user-name");
  const userSaldoDisplay = document.getElementById("user-saldo");
  const profilePic = document.getElementById("profile-pic");
  const profileUsername = document.getElementById("profile-username");
  const userItemsGrid = document.getElementById("user-items-grid");
  const addBalanceBtn = document.getElementById("add-balance-btn");

  // Atualizar informações do usuário
  userNameDisplay.textContent = currentUser.username;
  userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  profilePic.src = currentUser.photo || "./pages/img-pag/CS2G-user.png"; // Caminho corrigido para a foto do usuário
  profilePic.style.display = "block";
  profileUsername.textContent = currentUser.username;

  // Exibir itens do usuário
  const userItems = currentUser.items || []; // Garante que o array exista
  function renderUserItems() {
    userItemsGrid.innerHTML = ""; // Limpa o grid
    if (userItems.length === 0) {
      userItemsGrid.innerHTML = "<p>Você ainda não ganhou itens.</p>";
      return;
    }
  
    userItems.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("grid-item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100%; max-width: 150px; margin-bottom: 10px;">
        <h3>${item.name}</h3>
        <p>Valor: R$${item.price.toFixed(2)}</p>
        <button class="sell-btn" data-index="${index}">Vender</button>
      `;
  
      // Evento para vender o item
      itemElement.querySelector(".sell-btn").addEventListener("click", () => {
        currentUser.saldo += item.price; // Atualiza o saldo
        userItems.splice(index, 1); // Remove o item do array
        localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Atualiza o localStorage
        updateSaldoDisplay();
        renderUserItems(); // Atualiza o grid
        alert(`Você vendeu ${item.name} por R$${item.price.toFixed(2)}!`);
      });
  
      userItemsGrid.appendChild(itemElement);
    });
  }
  

  // Atualizar saldo do usuário
  function updateSaldoDisplay() {
    userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
  }

  // Botão de adicionar saldo
  addBalanceBtn.addEventListener("click", () => {
    const amount = parseFloat(prompt("Digite o valor a ser adicionado:", "0.00"));
    if (!isNaN(amount) && amount > 0) {
      currentUser.saldo += amount;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateSaldoDisplay();
      alert(`Saldo atualizado! Seu saldo agora é R$${currentUser.saldo.toFixed(2)}.`);
    } else {
      alert("Valor inválido!");
    }
  });

  // Renderizar os itens do usuário ao carregar a página
  renderUserItems();
});
