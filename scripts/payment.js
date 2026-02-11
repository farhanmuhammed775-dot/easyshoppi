import { store } from './store.js';
import { Auth } from './auth.js';

export function initPayment() {
    const user = Auth.checkAuth();
    if (!user) {
        alert("Please login to checkout");
        window.location.href = 'login.html';
        return;
    }

    const cart = store.getCart();
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const options = {
        "key": "rzp_test_1DP5mmOlF5G5ag", // Demo Test Key
        "amount": totalAmount,
        "currency": "INR",
        "name": "EasyShoppi",
        "description": "Premium Tech Gear",
        "image": "https://example.com/logo.png",
        "handler": function (response) {
            // Payment Success
            alert(`Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);

            // Create Order
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const address = JSON.parse(localStorage.getItem('deliveryAddress') || '{}');
            orders.push({
                id: response.razorpay_payment_id,
                userId: user.email, // using email as id for simplicity
                items: cart,
                total: totalAmount,
                address: address,
                date: new Date().toISOString()
            });
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear Cart
            store.clearCart();
            window.location.href = 'index.html';
        },
        "prefill": {
            "name": user.name,
            "email": user.email,
            "contact": "9999999999"
        },
        "theme": {
            "color": "#64ffda"
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
    });

    rzp1.open();
}
