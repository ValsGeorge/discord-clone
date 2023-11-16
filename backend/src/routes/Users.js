const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.post("/register", async (req, res) => {
    const data = req.body;

    try {
        const hash = await bcrypt.hash(data.password, 10);

        data.password = hash;

        await Users.create(data);

        res.json(data);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/login", async (req, res) => {
    const data = req.body;

    try {
        const user = await Users.findOne({
            where: {
                username: data.username,
            },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const match = await bcrypt.compare(data.password, user.password);

        if (!match) {
            return res.status(401).send("Wrong password");
        }

        const accessToken = sign(
            { username: user.username, id: user.id },
            "secret"
        );
        res.json({ token: accessToken });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/details", validateToken, async (req, res) => {
    const id = req.user.id;

    const user = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        return res.status(404).send("User not found");
    }

    res.json(user);
});

module.exports = router;
