document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!currentUser) {
      alert("Você precisa fazer login primeiro!");
      window.location.href = "GambleCS2.html";
      return;
    }
  
    document.getElementById("profile-username").textContent = currentUser.username;
  
    const userItems = currentUser.items || [];
    const userItemsList = document.getElementById("user-items");
    userItemsList.innerHTML = userItems.length
      ? userItems.map(item => `<li>${item}</li>`).join("")
      : "<li>Você ainda não ganhou itens.</li>";
  });
  