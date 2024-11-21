document.addEventListener("DOMContentLoaded", () => {
    const saldoAtualDisplay = document.getElementById("saldo-atual");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!currentUser) {
      alert("Você precisa fazer login primeiro!");
      window.location.href = "index.html";
      return;
    }
  
    saldoAtualDisplay.textContent = currentUser.saldo;
  
    document.querySelectorAll(".add-saldo-option").forEach(option => {
      option.addEventListener("click", (e) => {
        const value = parseFloat(e.target.dataset.value);
        currentUser.saldo += value;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert(`R$${value} adicionados ao seu saldo!`);
        saldoAtualDisplay.textContent = currentUser.saldo;
      });
    });
  });
  