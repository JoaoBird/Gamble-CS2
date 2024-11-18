// Identifique o ID da caixa a partir do HTML
const boxId = document.body.getAttribute("data-box-id");

// Lista de itens para todas as caixas
const items = {
  "white-and-bright": [
    { name: "Item 1", price: "$10", image: "../img/item1.png" },
    { name: "Item 2", price: "$20", image: "../img/item2.png" },
    { name: "Item 3", price: "$30", image: "../img/item3.png" },
  ],
  "green-wood-dragon": [
    { name: "Item A", price: "$5", image: "../img/itemA.png" },
    { name: "Item B", price: "$15", image: "../img/itemB.png" },
  ],
};

// Seleciona a seção onde os itens serão exibidos
const itemList = document.querySelector(".item-list");

// Verifique se a caixa existe antes de adicionar os itens
if (items[boxId]) {
  items[boxId].forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p>${item.name} - ${item.price}</p>
    `;
    itemList.appendChild(itemElement);
  });
} else {
  itemList.innerHTML = "<p>Caixa não encontrada!</p>";
}
