const STORAGE_KEY = "suppliers";
const tbody = document.querySelector('table tbody');
let suppliers = [];
let sortOrder = { column: null, asc: true };

// Charger depuis localStorage ou JSON
async function loadSuppliers() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        suppliers = JSON.parse(stored);
    } else {
        try {
            const res = await fetch('./../data/suppliers.json');
            suppliers = await res.json();
            saveSuppliers();
        } catch (err) {
            console.error("Erreur lors du chargement du JSON :", err);
        }
    }
    renderSuppliers();
}

function saveSuppliers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
}

// Affichage
function renderSuppliers(data = suppliers) {
    tbody.innerHTML = data.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.id}</td>
            <td>${s.email}</td>
            <td>${s.phone}</td>
            <td>
                <button onclick="editSupplier(${s.id})"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteSupplier(${s.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Ajouter
function addSupplier() {
    const name = prompt("Supplier name:");
    const email = prompt("Email:");
    const phone = prompt("Phone:");
    if (!name || !email || !phone) return;

    const id = suppliers.length ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
    suppliers.push({ id, name, email, phone });
    saveSuppliers();
    renderSuppliers();
}

// Modifier
function editSupplier(id) {
    const s = suppliers.find(s => s.id === id);
    if (!s) return;
    const name = prompt("Name:", s.name);
    const email = prompt("Email:", s.email);
    const phone = prompt("Phone:", s.phone);
    if (name && email && phone) {
        s.name = name;
        s.email = email;
        s.phone = phone;
        saveSuppliers();
        renderSuppliers();
    }
}

// Supprimer
function deleteSupplier(id) {
    if (!confirm("Delete this supplier?")) return;
    suppliers = suppliers.filter(s => s.id !== id);
    saveSuppliers();
    renderSuppliers();
}

// Recherche
document.getElementById('searchSuppliers').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderSuppliers(suppliers.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q)
    ));
});

// Tri
document.querySelectorAll('table thead th').forEach((th, index) => {
    const columns = ["name","id","email","phone"];
    if (index < 4) th.addEventListener('click', () => sortSuppliers(columns[index]));
});

function sortSuppliers(column) {
    if (sortOrder.column === column) sortOrder.asc = !sortOrder.asc;
    else sortOrder = { column, asc: true };

    suppliers.sort((a,b) => {
        if (a[column] < b[column]) return sortOrder.asc ? -1 : 1;
        if (a[column] > b[column]) return sortOrder.asc ? 1 : -1;
        return 0;
    });

    saveSuppliers();
    renderSuppliers();
}
// Ajouter
function addSupplier() {
    const name = prompt("Supplier name:");
    const email = prompt("Email:");
    const phone = prompt("Phone:");
    if (!name || !email || !phone) return;

    const id = suppliers.length ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
    suppliers.push({ id, name, email, phone });
    saveSuppliers();
    renderSuppliers();
}

// Lier le bouton Ajouter
document.getElementById('addSupplierBtn').addEventListener('click', addSupplier);


// Export PDF
document.getElementById('pdfSuppliersBtn').addEventListener('click', () => {
    if (!suppliers.length) return alert("No suppliers to export.");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const tableColumn = ["Name", "ID", "Email", "Phone"];
    const tableRows = suppliers.map(s => [s.name, s.id, s.email, s.phone]);
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("suppliers.pdf");
});

// Init
loadSuppliers();
