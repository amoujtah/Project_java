// --- Sélecteurs ---
const ordersTbody = document.querySelector('.recent-order tbody');
const ordersSearch = document.getElementById('searchOrders');
const addOrderBtn = document.getElementById('addOrderBtn');
const pdfOrdersBtn = document.getElementById('pdfOrdersBtn');

// --- Stockage local ---
const ORDERS_KEY = "orders";
const PRODUCTS_KEY = "products";
let orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
let sortOrder = { column: null, asc: true };

// --- Fonctions de stockage ---
function saveOrders() { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }
function saveProducts() { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }

// --- Rendu du tableau ---
function renderOrders(data = orders) {
    ordersTbody.innerHTML = data.map(order => `
        <tr>
            <td>${order.productName}</td>
            <td>${order.productNumber}</td>
            <td>${order.customerName}</td>
            <td>${order.price} DH</td>
            <td>${order.quantity}</td>
            <td>${order.total} DH</td>
            <td class="status ${order.status.toLowerCase()}">${order.status}</td>
            <td>
                <button onclick="editOrder('${order.productNumber}')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button onclick="deleteOrder('${order.productNumber}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// --- Ajouter une commande ---
function addOrder() {
    const productNumber = prompt("ID Produit :");
    const product = products.find(p => p.productNumber === productNumber);
    if (!product) return alert("Produit introuvable !");

    const quantity = Number(prompt(`Quantité (stock dispo : ${product.quantity})`));
    if (quantity > product.quantity) return alert("Stock insuffisant !");

    const customerName = prompt("Client :");
    const payment = prompt("Paiement (Paid / Due / Refund) :");
    const status = prompt("Status (Delivered / Pending / Declined) :");

    const total = product.price * quantity;

    orders.push({
        productName: product.productName,
        productNumber: product.productNumber,
        customerName,
        payment,
        status,
        price: product.price,
        quantity,
        total
    });

    // Mettre à jour le stock produit
    product.quantity -= quantity;
    if (product.quantity === 0) product.status = "OutOfStock";

    saveOrders();
    saveProducts();
    renderOrders();
}

// --- Modifier une commande ---
function editOrder(productNumber) {
    const order = orders.find(o => o.productNumber === productNumber);
    if (!order) return;

    const newCustomer = prompt("Client :", order.customerName);
    const newPayment = prompt("Paiement :", order.payment);
    const newStatus = prompt("Status :", order.status);

    if (newCustomer && newPayment && newStatus) {
        order.customerName = newCustomer;
        order.payment = newPayment;
        order.status = newStatus;
        saveOrders();
        renderOrders();
    }
}

// --- Supprimer une commande ---
function deleteOrder(productNumber) {
    const order = orders.find(o => o.productNumber === productNumber);
    if (!order) return;

    if (confirm(`Supprimer la commande de ${order.productName} ?`)) {
        // Restaurer le stock du produit
        const product = products.find(p => p.productNumber === productNumber);
        if (product) {
            product.quantity += order.quantity;
            if (product.quantity > 0) product.status = "Available";
            saveProducts();
        }

        orders = orders.filter(o => o.productNumber !== productNumber);
        saveOrders();
        renderOrders();
    }
}

// --- Recherche ---
function searchOrders(query) {
    query = query.toLowerCase();
    const filtered = orders.filter(o =>
        o.productName.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.productNumber.toLowerCase().includes(query)
    );
    renderOrders(filtered);
}

// --- Tri ---
function sortOrders(column) {
    if (sortOrder.column === column) sortOrder.asc = !sortOrder.asc;
    else sortOrder = { column, asc: true };

    orders.sort((a, b) => {
        if (a[column] < b[column]) return sortOrder.asc ? -1 : 1;
        if (a[column] > b[column]) return sortOrder.asc ? 1 : -1;
        return 0;
    });

    saveOrders();
    renderOrders();
}

// --- Export PDF ---
function exportOrdersPDF() {
    if (orders.length === 0) return alert("Aucune commande à exporter.");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableColumn = ["Produit", "ID Produit", "Client", "Prix", "Quantité", "Total", "Status"];
    const tableRows = orders.map(o => [
        o.productName,
        o.productNumber,
        o.customerName,
        o.price,
        o.quantity,
        o.total,
        o.status
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("orders.pdf");
}

// --- Événements ---
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    if (ordersSearch) ordersSearch.addEventListener('input', e => searchOrders(e.target.value));
    if (addOrderBtn) addOrderBtn.addEventListener('click', addOrder);
    if (pdfOrdersBtn) pdfOrdersBtn.addEventListener('click', exportOrdersPDF);
});
