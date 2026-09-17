const { readData } = require("../utils/fileDB");
const { writeData } = require("../utils/fileDB");
const bct = require("bcryptjs")
const jwt = require("jsonwebtoken");


const express = require("express");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const users = await readData("users.json");

    let user = users.find(user => user.username === username);

    if (user) return res.status(400).json({ error: "User already in use" });

    let passwordHash = await bct.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        username,
        passwordHash,
        role: "customer"
    };

    users.push(newUser);

    await writeData("users.json", users);

    return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
    });
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    const users = await readData("users.json");

    const user = users.find(user => user.username === username);

    if (!user) return res.status(401).json({error: "Invalid username or password"});

    const compareHash = await bct.compare(password, user.passwordHash);

    if (!compareHash) return res.status(401).json({error: "Invalid username or password"});

    const token = jwt.sign({
        id: user.id,
        username: username,
        role: user.role
    },
    SECRET_KEY, 
    {expiresIn: "1h"}
    )

    return res.status(200).json({token})
})

module.exports = router;