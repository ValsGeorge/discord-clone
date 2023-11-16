const express = require("express");
const router = express.Router();
const { Channels } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const username = req.user.username;

    const channels = await Channels.findAll({
        where: {
            username,
        },
    });
    res.json(channels);
});

router.get("/get-channels", validateToken, async (req, res) => {
    const userId = req.user.id;

    const channels = await Channels.findAll({
        where: {
            userId,
        },
    });
    res.json(channels);
});

router.post("/create-channel", validateToken, async (req, res) => {
    console.log("____________________________________________________");
    const data = req.body;
    console.log(data);

    const username = req.user.username;
    const userId = req.user.id;

    // for now, check the data
    // TODO: IMPLEMENT THE CORRECT FORM IN THE FRONTEND
    data["description"] = data["description"] || "No description provided";

    try {
        const channel = await Channels.create({
            ...data,
            username,
            userId,
        });
        res.json(channel);
    } catch (error) {
        console.error("Error during channel creation:", error);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
