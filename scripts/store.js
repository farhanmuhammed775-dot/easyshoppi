/* Store Management (Mock Database) */

const MO_PRODUCTS = [
    {
        id: 1,
        name: "Neon Quantum Headset",
        price: 29999, // in paise (299.99 INR)
        displayPrice: "₹299",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
        category: "Audio",
        description: "Immersive sound with active noise cancellation and neon accents."
    },
    {
        id: 2,
        name: "Cyberpunk Mechanical Keyboard",
        price: 49999, // 499.99 INR
        displayPrice: "₹499",
        image: "https://images.unsplash.com/photo-1587829741301-379b40989480?q=80&w=1000",
        category: "Peripherals",
        description: "RGB mechanical switches with rapid trigger technology."
    },
    {
        id: 3,
        name: "Holographic Smart Watch",
        price: 89999, // 899.99 INR
        displayPrice: "₹899",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000",
        category: "Wearables",
        description: "Next-gen holographic display interface."
    },
    {
        id: 4,
        name: "Stealth Gaming Mouse",
        price: 14999, // 149.99 INR
        displayPrice: "₹149",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000",
        category: "Peripherals",
        description: "Ultra-lightweight design with 20k DPI sensor."
    }
];

class Store {
    constructor() {
        this.init();
    }

    init() {
        const storedProducts = localStorage.getItem('products');
        let shouldInit = !storedProducts;

        if (storedProducts) {
            try {
                const parsed = JSON.parse(storedProducts);
                if (!Array.isArray(parsed) || parsed.length === 0) {
                    shouldInit = true;
                }
            } catch (e) {
                shouldInit = true;
            }
        }

        if (shouldInit) {
            localStorage.setItem('products', JSON.stringify(MO_PRODUCTS));
        }
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
        if (!localStorage.getItem('orders')) {
            localStorage.setItem('orders', JSON.stringify([]));
        }
    }

    getProducts() {
        return JSON.parse(localStorage.getItem('products'));
    }

    getCart() {
        return JSON.parse(localStorage.getItem('cart'));
    }

    addToCart(product) {
        let cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.notify('item_added');
    }

    clearCart() {
        localStorage.setItem('cart', JSON.stringify([]));
        this.notify('cart_cleared');
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Simple event system
    listeners = {};
    subscribe(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    notify(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}

export const store = new Store();
