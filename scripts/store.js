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
    },
    {
        id: 5,
        name: "Quantum VR Headset",
        price: 59999,
        displayPrice: "₹599",
        image: "https://images.unsplash.com/photo-1622979135225-d2ba269fb1ac?q=80&w=1000",
        category: "Gaming",
        description: "Experience virtual worlds with 8K resolution and haptic feedback."
    },
    {
        id: 6,
        name: "Aero Drone 4K",
        price: 129999,
        displayPrice: "₹1299",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000",
        category: "Tech",
        description: "Professional camera drone with obstacle avoidance and 30min flight time."
    },
    {
        id: 7,
        name: "Handheld Gaming Console",
        price: 39999,
        displayPrice: "₹399",
        image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=1000",
        category: "Gaming",
        description: "Play your favorite AAA titles on the go with this powerful handheld."
    },
    {
        id: 8,
        name: "Smart AR Glasses",
        price: 69999,
        displayPrice: "₹699",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000",
        category: "Wearables",
        description: "Overlay digital information onto the real world with style."
    }
];

class Store {
    constructor() {
        this.init();
    }

    init() {
        let storedProducts = localStorage.getItem('products');
        let currentProducts = [];

        if (storedProducts) {
            try {
                currentProducts = JSON.parse(storedProducts);
            } catch (e) {
                currentProducts = [];
            }
        }

        // Merge logic: Add MO_PRODUCTS if they don't exist in currentProducts
        let hasChanges = false;
        MO_PRODUCTS.forEach(mp => {
            if (!currentProducts.find(cp => cp.id === mp.id)) {
                currentProducts.push(mp);
                hasChanges = true;
            }
        });

        if (hasChanges || currentProducts.length === 0) {
            localStorage.setItem('products', JSON.stringify(currentProducts));
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

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.notify('item_removed');
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
