const { writeData, readData } = require("../utils/fileDB");
const { authenticate, authorize } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const {category, sort} = req.query;

    let products = await readData("products.json")

    if (category) products = products.filter(product => product.category === category);
    if (sort === "price") products = products.sort((a, b) => a.price - b.price);

    return res.status(200).json(products);
})

router.get("/:id", async (req, res) => {
    const {id} = req.params;

    const products = await readData("products.json");

    const product = products.find(product => product.id === Number(id));

    if (!product) return res.status(404).json({error: "Not found"});

    return res.status(200).json(product)
})
router.post("/", authenticate, authorize("admin"), async (req, res) => {

    const product = req.body;

    const products = await readData("products.json");

    const newProduct = {
        id: products.length === 0
            ? 1
            : products[products.length - 1].id + 1,
        ...product
    };

    products.push(newProduct);

    await writeData("products.json", products);

    return res.status(201).json(newProduct);
});
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
    const {id} = req.params;
    const data = req.body;

    const products = await readData("products.json");

    const productIndex = products.findIndex(product => product.id === Number(id));

    if (productIndex === -1) return res.status(404).json({error: "Product not found"});

  products[productIndex] = {
    id: Number(id),
    ...data
    };
    await writeData("products.json", products);
    return res.status(200).json( products[productIndex]);
})

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
    const {id} = req.params;

    let products = await readData("products.json");

    const index = products.findIndex(product => product.id === Number(id));

    if (index === -1) return res.status(404).json({error: "Product not found"});

    products = products.filter(product => product.id !== Number(id));

    await writeData("products.json", products);
    return res.sendStatus(204);

})

module.exports = router;