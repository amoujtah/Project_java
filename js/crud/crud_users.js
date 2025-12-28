const STORAGE_KEY = "users";
let tbody;
let users = [];
let sortOrder = { column: null, asc: true };

// Charger depuis localStorage ou JSON
async function loadUsers() {
    tbody = document.querySelector('#usersTable tbody');

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
        users = JSON.parse(stored);
    } else {
        try {
            const res = await fetch('./../data/users.json'); 
            users = await res.json();
            saveUsers();
        } catch (err) {
            console.error("Erreur lors du chargement du JSON :", err);
        }
    }
    renderUsers();
}

function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Affichage
function renderUsers(data = users) {
    tbody.innerHTML = data.map(u => `
        <tr>
            <td>${u.nom}</td>
            <td>${u.id}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>
                <button onclick="editUser(${u.id})"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteUser(${u.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Ajouter
function addUser() {
    const nom = prompt("User name:");
    const email = prompt("Email:");
    const role = prompt("Role (admin/client):");

    if (!nom || !email || !role) return;

    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push({ id, nom, email, role });
    saveUsers();
    renderUsers();
}

// Modifier
function editUser(id) {
    const u = users.find(u => u.id === id);
    if (!u) return;

    const nom = prompt("Name:", u.nom);
    const email = prompt("Email:", u.email);
    const role = prompt("Role:", u.role);

    if (nom && email && role) {
        u.nom = nom;
        u.email = email;
        u.role = role;
        saveUsers();
        renderUsers();
    }
}

// Supprimer
function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    users = users.filter(u => u.id !== id);
    saveUsers();
    renderUsers();
}

// Recherche et boutons
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchUsers').addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        renderUsers(users.filter(u =>
            u.nom.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        ));
    });

    document.getElementById('addUserBtn').addEventListener('click', addUser);

    document.getElementById('pdfUsersBtn').addEventListener('click', () => {
        if (!users.length) return alert("No users to export.");

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const tableColumn = ["Name", "ID", "Email", "Role"];
        const tableRows = users.map(u => [u.nom, u.id, u.email, u.role]);

        doc.autoTable({ head: [tableColumn], body: tableRows });
        doc.save("users.pdf");
    });

    // Tri
    document.querySelectorAll('#usersTable thead th').forEach((th, index) => {
        const columns = ["nom", "id", "email", "role"];
        if (index < columns.length) th.addEventListener('click', () => sortUsers(columns[index]));
    });

    // Init
    loadUsers();
});
// Affichage
function renderUsers(data = users) {
    tbody.innerHTML = data.map(u => `
        <tr>
            <td>${u.nom}</td>
            <td>${u.id}</td>
            <td>${u.email}</td>
            <td style="color: ${u.role === 'admin' ? 'red' : u.role === 'client' ? 'green' : 'black'}">
                ${u.role}
            </td>
            <td>
                <button onclick="editUser(${u.id})"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteUser(${u.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Tri
function sortUsers(column) {
    if (sortOrder.column === column) sortOrder.asc = !sortOrder.asc;
    else sortOrder = { column, asc: true };

    users.sort((a, b) => {
        if (a[column] < b[column]) return sortOrder.asc ? -1 : 1;
        if (a[column] > b[column]) return sortOrder.asc ? 1 : -1;
        return 0;
    });

    saveUsers();
    renderUsers();
}
