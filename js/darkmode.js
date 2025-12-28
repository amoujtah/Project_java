const themeToggle = document.querySelector(".theme-toggler");
const sunIcon = themeToggle.querySelector(".fa-sun");
const moonIcon = themeToggle.querySelector(".fa-moon");

// 🔁 Charger le thème sauvegardé au chargement de la page
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
    document.body.classList.add("dark-theme-variables");
    sunIcon.classList.remove("active");
    moonIcon.classList.add("active");
}

// 🌙 Basculer le thème
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme-variables");

    const isDark = document.body.classList.contains("dark-theme-variables");

    // Sauvegarde dans localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");

    sunIcon.classList.toggle("active");
    moonIcon.classList.toggle("active");
});