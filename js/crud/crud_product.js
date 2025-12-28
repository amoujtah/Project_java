// --- Sélecteurs ---
const productsTbody = document.querySelector('#productsTable tbody');
const searchProducts = document.getElementById('searchProducts');
const addProductBtn = document.getElementById('addProductBtn');
const pdfProductsBtn = document.getElementById('pdfProductsBtn');

// --- Stockage local ---
const PRODUCTS_KEY = "products";
let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
let sortOrder = { column: null, asc: true };

// --- Fonctions de stockage ---
function saveProducts() { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }

// --- Rendu du tableau ---
function renderProducts(data = products) {
    productsTbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.productName}</td>
            <td>${p.productNumber}</td>
            <td>${p.price} DH</td>
            <td>${p.quantity}</td>
            <td class="status ${p.status.toLowerCase()}">${p.status}</td>
            <td>
                <button onclick="editProduct('${p.productNumber}')"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteProduct('${p.productNumber}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// --- Ajouter un produit ---
function addProduct() {
    const productName = prompt("Nom du produit :");
    if (!productName) return;
    const productNumber = prompt("Numéro produit :");
    if (!productNumber) return;
    const price = Number(prompt("Prix :"));
    if (isNaN(price) || price <= 0) return alert("Prix invalide !");
    const quantity = Number(prompt("Quantité :"));
    if (isNaN(quantity) || quantity < 0) return alert("Quantité invalide !");
    
    const status = quantity > 0 ? "Available" : "OutOfStock";
    products.push({ productName, productNumber, price, quantity, status });
    
    saveProducts();
    renderProducts();
}

// --- Modifier un produit ---
function editProduct(productNumber) {
    const p = products.find(p => p.productNumber === productNumber);
    if (!p) return;
    
    const newName = prompt("Nom du produit :", p.productName);
    const newPrice = Number(prompt("Prix :", p.price));
    const newQuantity = Number(prompt("Quantité :", p.quantity));
    
    if (newName && !isNaN(newPrice) && !isNaN(newQuantity)) {
        p.productName = newName;
        p.price = newPrice;
        p.quantity = newQuantity;
        p.status = newQuantity > 0 ? "Available" : "OutOfStock";
        saveProducts();
        renderProducts();
    }
}

// --- Supprimer un produit ---
function deleteProduct(productNumber) {
    const p = products.find(p => p.productNumber === productNumber);
    if (!p) return;
    
    if (confirm(`Supprimer le produit ${p.productName} ?`)) {
        products = products.filter(p => p.productNumber !== productNumber);
        saveProducts();
        renderProducts();
    }
}

// --- Recherche ---
function searchProduct(query) {
    query = query.toLowerCase();
    const filtered = products.filter(p =>
        p.productName.toLowerCase().includes(query) ||
        p.productNumber.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

// --- Tri ---
function sortProducts(column) {
    if (sortOrder.column === column) sortOrder.asc = !sortOrder.asc;
    else sortOrder = { column, asc: true };
    
    products.sort((a, b) => {
        if (a[column] < b[column]) return sortOrder.asc ? -1 : 1;
        if (a[column] > b[column]) return sortOrder.asc ? 1 : -1;
        return 0;
    });
    
    saveProducts();
    renderProducts();
}

// --- Export PDF ---
function exportProductsPDF() {
    if (!products.length) return alert("Aucun produit à exporter.");
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const tableColumn = ["Produit", "ID Produit", "Prix", "Quantité", "Status"];
    const tableRows = products.map(p => [
        p.productName,
        p.productNumber,
        p.price,
        p.quantity,
        p.status
    ]);
    
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("products.pdf");
}

// --- Événements ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    searchProducts?.addEventListener('input', e => searchProduct(e.target.value));
    addProductBtn?.addEventListener('click', addProduct);
    pdfProductsBtn?.addEventListener('click', exportProductsPDF);
});

