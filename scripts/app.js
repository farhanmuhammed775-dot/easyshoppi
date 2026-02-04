import { store } from './store.js';
import { Auth } from './auth.js';

// DOM Elements
const app = document.getElementById('app');

/* Component: Navbar */
function renderNavbar() {
    const user = store.getUser();
    const cart = store.getCart();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const nav = document.createElement('nav');
    nav.className = 'navbar glass-panel';
    nav.innerHTML = `
        <div class="container nav-content">
            <a href="index.html" class="logo">
                <img src="logo.jpg" alt="Logo" class="nav-logo" onerror="this.style.display='none'; document.querySelector('.logo').innerText='EasyShoppi.';">
                EasyShoppi<span class="dot">.</span>
            </a>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="shop.html">Shop</a></li>
                ${user && user.role === 'admin' ? '<li><a href="admin.html">Admin</a></li>' : ''}
            </ul>
            <div class="nav-actions">
                ${user
            ? `<div class="user-menu">
                         <span>Hi, ${user.name.split(' ')[0]}</span>
                         <button id="logoutBtn" class="btn-text">Logout</button>
                       </div>`
            : `<a href="login.html" class="btn btn-primary">Login</a>`
        }
                <a href="cart.html" class="cart-icon">
                    🛒 <span class="badge" id="cartBadge">${cartCount}</span>
                </a>
            </div>
        </div>
    `;

    // Insert at top of body
    document.body.prepend(nav);

    // Event Listeners
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Auth.logout();
        });
    }

    // Subscribe to cart updates
    store.subscribe('item_added', () => {
        const newCount = store.getCart().reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cartBadge').textContent = newCount;
    });
}

/* Logic: Load Page Specifc Scipts */
const page = document.body.getAttribute('data-page');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();

    // Page specific init
    if (page === 'home') initHome();
    if (page === 'shop') initShop();
    if (page === 'cart') initCart();
    if (page === 'admin') initAdmin();
});

/* Helper Functions for pages (can be moved to modules) */
function initHome() {
    const products = store.getProducts().slice(0, 3); // Featured
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <div class="product-card glass-panel">
            <img src="${p.image}" alt="${p.name}">
            <div class="p-info">
                <h3>${p.name}</h3>
                <p class="price">${p.displayPrice}</p>
                <button class="btn btn-primary" onclick="window.addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Global exposure for inline onclicks (simplified for this demo)
// Global exposure for inline onclicks (simplified for this demo)
window.addToCart = (id) => {
    const product = store.getProducts().find(p => p.id === id);
    if (product) {
        store.addToCart(product);
        alert('Added to cart!');
    }
};

/* Page Initializers */
function initShop() {
    const products = store.getProducts();
    const container = document.getElementById('shop-products');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <div class="product-card glass-panel">
            <img src="${p.image}" alt="${p.name}">
            <div class="p-info">
                <h3>${p.name}</h3>
                <p class="price">${p.displayPrice}</p>
                <button class="btn btn-primary" onclick="window.addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function initCart() {
    const cart = store.getCart();
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        if (totalEl) totalEl.textContent = '₹0';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item glass-panel" style="display: flex; gap: 20px; margin-bottom: 20px; padding: 15px; align-items: center;">
            <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover;" alt="${item.name}">
            <div style="flex-grow: 1;">
                <h4>${item.name}</h4>
                <p>${item.displayPrice} x ${item.quantity}</p>
            </div>
            <div>
                 <p style="font-weight: bold;">₹${(item.price * item.quantity / 100).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (totalEl) totalEl.textContent = '₹' + (total / 100).toFixed(2);
}

function initAdmin() {
    // Basic protection
    const user = Auth.checkAuth();
    if (user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('addProductForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const price = parseFloat(document.getElementById('p-price').value) * 100; // to paise
            const img = document.getElementById('p-image').value;

            const newProduct = {
                id: Date.now(),
                name,
                price,
                displayPrice: '₹' + (price / 100),
                image: img,
                category: 'New',
                description: 'New product'
            };

            const products = store.getProducts();
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            alert('Product added!');
            form.reset();
        });
    }
}

