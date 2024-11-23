document.addEventListener("DOMContentLoaded", () => {
    const saldoAtualDisplay = document.getElementById("saldo-atual");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  // Exibir nome, saldo e foto do usuário
  if (currentUser) {
    userNameDisplay.textContent = currentUser.username;
    userSaldoDisplay.textContent = `Saldo: R$${currentUser.saldo.toFixed(2)}`;
    profilePic.src = currentUser.photo || "./img-pag/CS2G-user.png";
    profilePic.style.display = "block";
  }

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
  