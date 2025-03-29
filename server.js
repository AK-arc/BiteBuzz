const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://your-firebase-database.firebaseio.com"
});

const db = admin.firestore();
const app = express();
app.use(express.json());

app.post('/placeOrder', async (req, res) => {
    const { userId, restaurant, items } = req.body;
    const orderRef = await db.collection('orders').add({
        userId,
        restaurant,
        items,
        status: "Preparing",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, orderId: orderRef.id });
});

app.get('/trackOrder/:orderId', async (req, res) => {
    const order = await db.collection('orders').doc(req.params.orderId).get();
    if (!order.exists) return res.status(404).json({ error: "Order not found" });

    res.json(order.data());
});

app.listen(3000, () => console.log("Server running on port 3000"));
