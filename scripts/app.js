import { store } from './store.js';
import { Auth } from './auth.js';

// DOM Elements
const app = document.getElementById('app');

/* Component: Navbar */
function renderNavbar() {
    const user = store.getUser();
    const cart = store.getCart();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Remove existing navbar if any (to prevent duplicates during SPA navigation if we had it)
    const existingNav = document.querySelector('nav.navbar');
    if (existingNav) existingNav.remove();

    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="nav-content">
            <a href="index.html" class="logo-container">
                <img src="images/logo.jpg" alt="Logo" class="logo-img" onerror="this.style.display='none'">
                <span class="logo-text">EasyShoppi<span class="dot">.</span></span>
            </a>

            <div class="nav-actions">
                 <a href="cart.html" class="cart-icon">
                    🛒 <span class="badge" id="cartBadge">${cartCount}</span>
                </a>
                
                <button class="hamburger" aria-label="Toggle Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="shop.html">Shop</a></li>
                ${user && user.role === 'admin' ? '<li><a href="admin.html">Admin</a></li>' : ''}
                ${user
            ? `<li><a href="#" id="logoutBtn">Logout (${user.name.split(' ')[0]})</a></li>`
            : `<li><a href="login.html" class="btn btn-outline" style="padding: 5px 15px; font-size: 0.9rem;">Login</a></li>`
        }
            </ul>
        </div>
    `;

    // Insert at top of body
    document.body.prepend(nav);

    // Hamburger Logic
    const hamburger = nav.querySelector('.hamburger');
    const navLinks = nav.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Optional: Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Event Listeners (Logout)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }

    // Subscribe to cart updates
    store.subscribe('item_added', () => {
        const newCount = store.getCart().reduce((acc, item) => acc + item.quantity, 0);
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = newCount;
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
    if (page === 'product') initProduct();
});

/* Helper Functions for pages (can be moved to modules) */
function initHome() {
    const products = store.getProducts().slice(0, 3); // Featured
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <div class="product-card glass-panel">
            <a href="product.html?id=${p.id}" style="text-decoration: none; color: inherit; display: block;">
                <img src="${p.image}" alt="${p.name}">
                <div class="p-info">
                    <h3>${p.name}</h3>
                    <p class="price">${p.displayPrice}</p>
                </div>
            </a>
            <div style="padding: 15px; padding-top: 0;">
                <button class="btn btn-primary" onclick="window.buyNow(${p.id})">Buy Now</button>
            </div>
        </div>
    `).join('');
}

// Global exposure for inline onclicks (simplified for this demo)
// Global exposure for inline onclicks (simplified for this demo)
// Global exposure for inline onclicks
window.addToCart = (id) => {
    const product = store.getProducts().find(p => p.id === id);
    if (product) {
        store.addToCart(product);
        alert('Added to cart!');
    }
};

window.buyNow = (id) => {
    const product = store.getProducts().find(p => p.id === id);
    if (product) {
        store.addToCart(product);
        window.location.href = 'cart.html';
    }
};

/* Page Initializers */
function initShop() {
    const products = store.getProducts();
    const container = document.getElementById('shop-products');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <div class="product-card glass-panel">
            <a href="product.html?id=${p.id}" style="text-decoration: none; color: inherit; display: block;">
                <img src="${p.image}" alt="${p.name}">
                <div class="p-info">
                    <h3>${p.name}</h3>
                    <p class="price">${p.displayPrice}</p>
                </div>
            </a>
            <div style="padding: 15px; padding-top: 0;">
                <button class="btn btn-primary" onclick="window.buyNow(${p.id})">Buy Now</button>
            </div>
        </div>
    `).join('');
}

function initProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const container = document.getElementById('product-content');

    if (!id || !container) return;

    const product = store.getProducts().find(p => p.id === id);

    if (!product) {
        container.innerHTML = '<h2>Product not found</h2>';
        return;
    }

    // Prepare images array (if only one image, make it an array)
    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    container.innerHTML = `
        <div class="gallery-container">
            <img id="main-image" src="${images[0]}" alt="${product.name}" class="glass-panel">
            <div class="thumbnail-list">
                ${images.map((img, index) => `
                    <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                         onclick="changeMainImage(this.src, this)">
                `).join('')}
            </div>
        </div>
        <div class="product-info glass-panel" style="padding: 40px;">
            <h1>${product.name}</h1>
            <p class="product-price">${product.displayPrice}</p>
            
            <p class="product-desc">
                ${product.description ? product.description.replace(/\n/g, '<br>') : 'No description available for this product.'}
            </p>

            <button class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 1.1rem; margin-top: 20px;" 
                    onclick="window.buyNow(${product.id})">
                Buy Now
            </button>
        </div>
    `;
}

// Global helper for gallery
window.changeMainImage = (src, thumb) => {
    document.getElementById('main-image').src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
};

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
    const imageInput = document.getElementById('p-images');
    const previewContainer = document.getElementById('image-preview');
    let processedImages = [];

    // Image Preview & Processing Logic
    if (imageInput) {
        imageInput.addEventListener('change', async (e) => {
            previewContainer.innerHTML = '';
            processedImages = [];
            const files = Array.from(e.target.files);

            for (const file of files) {
                // Resize and convert to Base64
                try {
                    const base64 = await resizeImage(file);
                    processedImages.push(base64);

                    // Show Preview
                    const img = document.createElement('img');
                    img.src = base64;
                    img.style.width = '80px';
                    img.style.height = '80px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '4px';
                    img.style.border = '1px solid var(--glass-border)';
                    previewContainer.appendChild(img);
                } catch (err) {
                    console.error("Error processing image", err);
                }
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const price = parseFloat(document.getElementById('p-price').value) * 100; // to paise
            const description = document.getElementById('p-desc').value;

            if (processedImages.length === 0) {
                alert('Please select at least one image.');
                return;
            }

            const newProduct = {
                id: Date.now(),
                name,
                price,
                displayPrice: '₹' + (price / 100),
                image: processedImages[0], // Main thumbnail
                images: processedImages, // All images
                category: 'New',
                description: description
            };

            try {
                const products = store.getProducts();
                products.push(newProduct);
                localStorage.setItem('products', JSON.stringify(products));
                alert('Product added successfully!');
                form.reset();
                previewContainer.innerHTML = '';
                processedImages = [];
            } catch (err) {
                alert('Storage full! Try using smaller images or fewer products.');
                console.error(err);
            }
        });
    }
}

// Helper: Resize Image to reduce storage usage
function resizeImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Compress to JPEG with 0.7 quality
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

