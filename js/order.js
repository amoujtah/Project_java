const tbody = document.querySelector('table tbody');
const totalSalesEl = document.getElementById("totalSales");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalProductsEl = document.getElementById("totalProducts");
const salesRevenueEl = document.getElementById("salesRevenue");

const ORDERS_KEY = "orders";
const CLIENTS_KEY = "clients";
const PRODUCTS_KEY = "products";

let orders = [];
let customers = [];
let products = [];

function saveOrders() { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }
function loadOrders() { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
function saveCustomers() { localStorage.setItem(CLIENTS_KEY, JSON.stringify(customers)); }
function loadCustomers() { return JSON.parse(localStorage.getItem(CLIENTS_KEY)) || []; }
function saveProducts() { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }
function loadProducts() { return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || []; }

initData();

async function initData() {
    products = loadProducts();
    if (!products.length) {
        const resProducts = await fetch('./data/products.json');
        products = await resProducts.json();
        saveProducts();
    }

    orders = loadOrders();
    if (!orders.length) {
        const resOrders = await fetch('./data/orders.json');
        orders = await resOrders.json();
        saveOrders();
    }

    customers = loadCustomers();
    if (!customers.length) {
        const resCustomers = await fetch('./data/clients.json');
        customers = await resCustomers.json();
        saveCustomers();
    }

    afficher(orders);
    afficherCustomers(customers);
    updateStockFromPaidOrders();
}

function updateStockFromPaidOrders() {
    orders.filter(o => o.payment === "Paid").forEach(order => {
        const product = products.find(p => p.productNumber === order.productNumber);
        if (product) {
            product.quantity -= order.quantity;
            if (product.quantity <= 0) product.status = "OutOfStock";
        }
    });
    saveProducts();
}

function afficher(data) {
    tbody.innerHTML = '';

    totalProductsEl.textContent = products.reduce((sum, p) => sum + p.quantity, 0);

    const paidOrders = data.filter(o => o.payment === "Paid");
    totalSalesEl.textContent = paidOrders.length;

    const revenue = paidOrders.reduce((acc, order) => acc + order.total, 0);
    salesRevenueEl.textContent = revenue + " DH";

    data.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.productName}</td>
            <td>${order.productNumber}</td>
            <td>${order.customerName}</td>
            <td>${order.payment}</td>
            <td class="status ${order.status.toLowerCase()}">${order.status}</td>
            <td class="primary">Details</td>
        `;

        tr.querySelector('.primary').addEventListener('click', () => {
            alert(
`Produit : ${order.productName}
Numéro : ${order.productNumber}
Client : ${order.customerName}
Prix : ${order.price} DH
Quantité : ${order.quantity}
Total : ${order.total} DH
Paiement : ${order.payment}
Status : ${order.status}`
            );
        });

        tbody.appendChild(tr);
    });
}

function afficherCustomers(data) {
    totalCustomersEl.textContent = data.length;
}
