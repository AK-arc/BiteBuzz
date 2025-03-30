const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors'); 
const bodyParser = require('body-parser');

// Load Firebase credentials
const serviceAccount = require("./path-to-your-service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-firebase-database.firebaseio.com"
});

const db = admin.firestore();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Place Order with Validation
app.post('/placeOrder', async (req, res) => {
    try {
        const { userId, restaurant, items } = req.body;

        // Validate input
        if (!userId || !restaurant || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Invalid order details" });
        }

        // Store order in Firestore
        const orderRef = await db.collection('orders').add({
            userId,
            restaurant,
            items,
            status: "Preparing",
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, orderId: orderRef.id });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Track Order
app.get('/trackOrder/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await db.collection('orders').doc(orderId).get();

        if (!order.exists) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order.data());
    } catch (error) {
        console.error("Error tracking order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Health Check Endpoint
app.get('/', (req, res) => {
    res.send("API is running!");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
