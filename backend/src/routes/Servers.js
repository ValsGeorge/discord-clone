const express = require("express");
const router = express.Router();
const { Servers } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const username = req.user.username;

    const servers = await Servers.findAll({
        where: {
            username,
        },
    });
    res.json(servers);
});

router.get("/get-servers", validateToken, async (req, res) => {
    const userId = req.user.id;

    const servers = await Servers.findAll({
        where: {
            userId,
        },
    });
    res.json(servers);
});

router.post("/create-server", validateToken, async (req, res) => {
    console.log("____________________________________________________");
    const data = req.body;
    console.log(data);

    const username = req.user.username;
    const userId = req.user.id;

    // for now, check the data
    // TODO: IMPLEMENT THE CORRECT FORM IN THE FRONTEND
    data["description"] = data["description"] || "No description provided";

    try {
        const server = await Servers.create({
            ...data,
            username,
            userId,
        });
        res.json(server);
    } catch (error) {
        console.error("Error during server creation:", error);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
