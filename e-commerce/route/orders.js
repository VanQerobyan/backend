const { authenticate, authorize } = require("../middleware/auth");
const { readData, writeData } = require("../utils/fileDB");

const express = require("express");
const router = express.Router();


router.post("/", authenticate, async (req, res) => {
    let total = 0;
    const { items } = req.body;

    const products = await readData("products.json");

    for (const item of items) {
        const product = products.find(product => product.id === item.productId
        );


        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({ error: "Invalid quantity" });
        }

        total += product.price * item.quantity;
    }

  for (const item of items) {
    const product = products.find(product => product.id === item.productId);

    product.stock -= item.quantity;

}

    await writeData("products.json", products);

    const orders = await readData("orders.json");

    const newOrder = {
        id: orders.length === 0 ? 1 : orders[orders.length - 1].id + 1,
        userId: req.user.id,
        items: items,
        total: total,
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    await writeData("orders.json", orders);

    return res.status(201).json(newOrder);
});


router.get("/", authenticate, async (req, res) => {
    const userId = req.user.id;

    const orders = await readData("orders.json");

    if (req.user.role === "admin") return res.status(200).json(orders);

    const order = orders.filter(order => order.userId === userId);

    if (order.length === 0) return res.status(200).json([]);

    return res.status(200).json(order);
})

router.get("/:id", authenticate, async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    const orders = await readData("orders.json");

    const order = orders.find(order => order.id === Number(id));

    if (!order) return res.status(404).json({error: "Not found"})
    if (userId !== order.userId && req.user.role !== "admin") return res.status(403).json({error: "Forbidden"})
        return res.status(200).json(order)
})

module.exports = router;