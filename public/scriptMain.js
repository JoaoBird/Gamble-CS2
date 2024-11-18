document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            document.getElementById("user-name").textContent = username;
            alert("Login bem-sucedido!");
          } else {
            alert("Usuário ou senha inválidos.");
          }
        });
    });
  });
  const gridContainer = document.querySelector(".grid-container");

  // Lista de caixas
  const boxes = [
    { name: "White and Bright", price: "$5.45", id: "white-and-bright" },
    { name: "Green Wood Dragon", price: "$0.10", id: "green-wood-dragon" },
    { name: "High 10", price: "$0.13", id: "high-10" },
    { name: "Ra", price: "$0.12", id: "ra" },
    { name: "Vibing", price: "$0.21", id: "vibing" },
    { name: "Neon", price: "$0.36", id: "neon" },
    { name: "Cake", price: "$0.15", id: "cake" },
    { name: "Bubble gum", price: "$0.43", id: "bubble-gum" },
  ];
  
  // Função para carregar as caixas na página
  function populateBoxes() {
    // Verifica se o container já tem caixas adicionadas
    if (gridContainer.children.length > 0) {
      console.log("Caixas já renderizadas. Evitando duplicação...");
      return; // Evita adicionar as caixas novamente
    }
  }
  const items = {
    "white-and-bright": [
      { name: "Item 1", price: "$10", image: "img/item1.png" },
      { name: "Item 2", price: "$20", image: "img/item2.png" },
      // Continue adicionando itens
    ],
    "green-wood-dragon": [
      { name: "Item A", price: "$5", image: "img/itemA.png" },
      { name: "Item B", price: "$15", image: "img/itemB.png" },
      // Continue adicionando itens
    ],
    // Adicione os itens para outras caixas
  };
  


  boxes.forEach((box) => {
    const boxElement = document.createElement("div");
    boxElement.classList.add("grid-item");
    boxElement.innerHTML = `
      <img src="img/box.png" alt="${box.name}" class="box-image">
      <div class="box-info">
        <h3>${box.name}</h3>
        <p>${box.price}</p>
        <a href="pages/${box.id}.html">
          <button class="open-box">Abrir</button>
        </a>
      </div>
    `;
    gridContainer.appendChild(boxElement);
  });


// Executa a função de preenchimento quando a página for carregada
document.addEventListener("DOMContentLoaded", populateBoxes);
//LOGIN
const loginModal = document.getElementById("login-modal");
const registerBtn = document.getElementById("registerBtn");

// Mostrar modal de login quando o usuário clicar
registerBtn.addEventListener("click", () => {
  loginModal.classList.add("show");
});

// Fechar o modal ao submeter o formulário de login ou cadastro
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Aqui você pode adicionar a lógica para enviar esses dados para o servidor
  console.log("Username:", username, "Password:", password);

  // Fechar o modal após o login/cadastro
  loginModal.classList.remove("show");
});
