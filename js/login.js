document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.querySelector(".login-btn");

    loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "admin") {
            localStorage.setItem("admin", "true");
            window.location.href = "dashboard.html";
        } else {
            alert("Nom d'utilisateur ou mot de passe incorrect");
        }
    });

});
