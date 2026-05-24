const SESSION_KEY = "cybsera_session";
const DEMO_ADMINS = [
    {
        username: "admin",
        password: "admin",
        name: "Admin",
        role: "Administrateur"
    }
];

function getStoredSession() {
    const rawSession = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);

    if (!rawSession) {
        return null;
    }

    try {
        const session = JSON.parse(rawSession);

        if (session.expiresAt && Date.now() > session.expiresAt) {
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }

        return session;
    } catch (error) {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        return null;
    }
}

function setMessage(message, type = "error") {
    const messageBox = document.getElementById("loginMessage");
    messageBox.textContent = message;
    messageBox.classList.toggle("success", type === "success");
}

document.addEventListener("DOMContentLoaded", () => {
    if (getStoredSession()) {
        window.location.replace("./index.html");
        return;
    }

    const form = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberInput = document.getElementById("remember");
    const submitButton = form.querySelector(".login-btn");
    const passwordToggle = document.querySelector(".password-toggle");
    const forgotButton = document.getElementById("forgotPassword");

    passwordToggle.addEventListener("click", () => {
        const isPasswordVisible = passwordInput.type === "text";
        passwordInput.type = isPasswordVisible ? "password" : "text";
        passwordToggle.setAttribute(
            "aria-label",
            isPasswordVisible ? "Afficher le mot de passe" : "Masquer le mot de passe"
        );
        passwordToggle.querySelector("i").className = isPasswordVisible
            ? "fa-solid fa-eye"
            : "fa-solid fa-eye-slash";
    });

    forgotButton.addEventListener("click", () => {
        setMessage("Contactez l'administrateur système pour réinitialiser l'accès.");
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();
        const admin = DEMO_ADMINS.find((user) => user.username === username && user.password === password);

        if (!username || !password) {
            setMessage("Veuillez remplir les deux champs.");
            return;
        }

        if (!admin) {
            setMessage("Nom d'utilisateur ou mot de passe incorrect.");
            passwordInput.value = "";
            passwordInput.focus();
            return;
        }

        const rememberSession = rememberInput.checked;
        const duration = rememberSession ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
        const session = {
            username: admin.name,
            role: admin.role,
            createdAt: Date.now(),
            expiresAt: Date.now() + duration
        };
        const storage = rememberSession ? localStorage : sessionStorage;

        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem("admin");
        sessionStorage.removeItem(SESSION_KEY);
        storage.setItem(SESSION_KEY, JSON.stringify(session));

        submitButton.disabled = true;
        setMessage("Connexion validée. Ouverture du back-office...", "success");

        window.setTimeout(() => {
            window.location.href = "./index.html";
        }, 450);
    });
});
