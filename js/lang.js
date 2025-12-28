class LanguageManager {
    constructor() {
        this.lang = localStorage.getItem("lang") || "en";

        this.translations = {
            en: {
                dashboard: "Dashboard",
                customers: "Customers",
                orders: "Orders",
                products: "Products",
                add_product: "Add Product",
                logout: "Logout",
                search_placeholder: "Search...",
                export_pdf: "Export PDF",
                name: "Name",
                id: "Id",
                email: "Email",
                address: "Address",
                actions: "Actions",
                user: "User"
            },
            fr: {
                dashboard: "Tableau de bord",
                customers: "Clients",
                orders: "Commandes",
                products: "Produits",
                add_product: "Ajouter un produit",
                logout: "Déconnexion",
                search_placeholder: "Rechercher...",
                export_pdf: "Exporter PDF",
                name: "Nom",
                id: "Id",
                email: "Email",
                address: "Adresse",
                actions: "Actions",
                user: "Utilisateur"
            },
            ar: {
                dashboard: "لوحة التحكم",
                customers: "العملاء",
                orders: "الطلبات",
                products: "المنتجات",
                add_product: "إضافة منتج",
                logout: "تسجيل الخروج",
                search_placeholder: "بحث...",
                export_pdf: "تصدير PDF",
                name: "الاسم",
                id: "المعرف",
                email: "البريد الإلكتروني",
                address: "العنوان",
                actions: "الإجراءات",
                user: "المستخدم"
            }
        };

        this.apply();
        this.bind();
    }

    bind() {
        const select = document.getElementById("lang-select");
        select.value = this.lang;

        select.addEventListener("change", (e) => {
            this.lang = e.target.value;
            localStorage.setItem("lang", this.lang);
            this.apply();
        });
    }

    apply() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            el.textContent = this.translations[this.lang][el.dataset.i18n];
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            el.placeholder = this.translations[this.lang][el.dataset.i18nPlaceholder];
        });
        document.documentElement.dir = this.lang === "ar" ? "rtl" : "ltr";
    }
}

new LanguageManager();
