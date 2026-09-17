require("dotenv").config({quiet:true});

const PORT = process.env.PORT;
const express = require("express");

const app = express();
const orderRouter = require("./route/orders");
const authRouter = require("./route/auth");
const productRouter = require("./route/products");

app.use(express.json());

app.use("/orders", orderRouter);
app.use("/products", productRouter);
app.use("/auth", authRouter);


app.use((err, req, res, next) => {
    console.log(err.message)
    res.status(500).json({ error: "Internal Server Error" });
})
app.listen(PORT, () =>{
    console.log(`Server is listen to ${PORT}`);
})