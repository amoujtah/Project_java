const STORAGE_KEY = "clients";
const tbody = document.querySelector('.recent-order tbody');
let clients = [];
let sortOrder = { column: null, asc: true };
let filteredClients = []; // pour la recherche et le PDF filtré

// --- Stockage local ---
function saveClients() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function loadClientsFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

// --- Initialisation ---
async function initClients() {
    const storedClients = loadClientsFromStorage();
    if (storedClients) {
        clients = storedClients;
    } else {
        try {
            const res = await fetch('./../data/clients');
            clients = await res.json();
            saveClients();
        } catch (err) {
            console.error("Erreur JSON :", err);
        }
    }
    filteredClients = [...clients];
    renderClients();
}
initClients();

// --- Rendu du tableau ---
function renderClients(data = filteredClients) {
    tbody.innerHTML = data.map(client => `
        <tr>
            <td>${client.nom}</td>
            <td>${client.id}</td>
            <td>${client.email}</td>
            <td>${client.adresse}</td>
            <td>
                <button onclick="editClient(${client.id})"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteClient(${client.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// --- Ajouter un client ---
function addClient() {
    const newNom = prompt("Nom du client :");
    if (!newNom) return;
    const newEmail = prompt("Email du client :");
    if (!newEmail) return;
    const newAdresse = prompt("Adresse du client :");
    if (!newAdresse) return;

    const newId = clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    clients.push({ id: newId, nom: newNom, email: newEmail, adresse: newAdresse });
    saveClients();
    searchClients(document.getElementById('searchInput').value);
}

// --- Modifier un client ---
function editClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    const newNom = prompt("Modifier le nom :", client.nom);
    const newEmail = prompt("Modifier l'email :", client.email);
    const newAdresse = prompt("Modifier l'adresse :", client.adresse);

    if (newNom && newEmail && newAdresse) {
        client.nom = newNom;
        client.email = newEmail;
        client.adresse = newAdresse;
        saveClients();
        searchClients(document.getElementById('searchInput').value);
    }
}

// --- Supprimer un client ---
function deleteClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    if (confirm(`Supprimer ${client.nom} ?`)) {
        clients = clients.filter(c => c.id !== id);
        saveClients();
        searchClients(document.getElementById('searchInput').value);
    }
}

// --- Recherche ---
function searchClients(query) {
    query = query.toLowerCase();
    filteredClients = clients.filter(c =>
        c.nom.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.adresse.toLowerCase().includes(query)
    );
    renderClients();
}

// --- Tri ---
function sortClients(column) {
    if (sortOrder.column === column) sortOrder.asc = !sortOrder.asc;
    else sortOrder = { column, asc: true };

    clients.sort((a, b) => {
        if (a[column] < b[column]) return sortOrder.asc ? -1 : 1;
        if (a[column] > b[column]) return sortOrder.asc ? 1 : -1;
        return 0;
    });
    saveClients();
    searchClients(document.getElementById('searchInput').value);
}

// --- Export PDF ---
// --- Export PDF ---
function exportClientsPDF() {
    if (!filteredClients.length) return alert("Aucun client à exporter.");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableColumn = ["Nom", "ID", "Email", "Adresse"];
    const tableRows = filteredClients.map(c => [c.nom, c.id, c.email, c.adresse]);

    doc.setFontSize(18);
    doc.text("Liste des clients", 14, 15);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        bodyStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("clients.pdf");
}

// --- Event listeners ---
document.getElementById('searchInput').addEventListener('input', e => searchClients(e.target.value));
document.getElementById('addBtn').addEventListener('click', addClient);
document.getElementById('pdfBtn').addEventListener('click', exportClientsPDF); // correspond à l'ID réel


// --- Event listeners ---
document.getElementById('searchInput').addEventListener('input', e => searchClients(e.target.value));
document.getElementById('addBtn').addEventListener('click', addClient);
document.getElementById('pdfClientsBtn').addEventListener('click', exportClientsPDF);

document.querySelectorAll('.recent-order thead th').forEach((th, index) => {
    if (index < 4) {
        const colMap = ["nom", "id", "email", "adresse"];
        th.addEventListener('click', () => sortClients(colMap[index]));
    }
});
