(function () {
    const SESSION_KEY = "cybsera_session";
    const LOGIN_PAGE = "login.html";

    function readSession() {
        const rawSession = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);

        if (!rawSession && localStorage.getItem("admin") === "true") {
            return {
                username: "Admin",
                role: "Administrateur"
            };
        }

        if (!rawSession) {
            return null;
        }

        try {
            const session = JSON.parse(rawSession);

            if (session.expiresAt && Date.now() > session.expiresAt) {
                clearSession();
                return null;
            }

            return session;
        } catch (error) {
            clearSession();
            return null;
        }
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem("admin");
        sessionStorage.removeItem(SESSION_KEY);
    }

    function logout() {
        clearSession();
        window.location.href = "./" + LOGIN_PAGE;
    }

    if (!readSession()) {
        window.location.replace("./" + LOGIN_PAGE);
        return;
    }

    window.CybseraAuth = {
        getSession: readSession,
        logout
    };

    document.addEventListener("DOMContentLoaded", () => {
        const session = readSession();
        const profileName = document.querySelector(".profile .info p b");
        const profileRole = document.querySelector(".profile .info small");

        if (profileName && session?.username) {
            profileName.textContent = session.username;
        }

        if (profileRole && session?.role) {
            profileRole.textContent = session.role;
        }

        document.querySelectorAll('a[href$="login.html"]').forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                logout();
            });
        });
    });
})();
