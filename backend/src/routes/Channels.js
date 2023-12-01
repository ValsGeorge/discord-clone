const express = require("express");
const router = express.Router();
const { Channels } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const channels = await Channels.findAll();
    res.json(channels);
});

router.get("/get-channels/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const channels = await Channels.findAll({ where: { serverId: id } });
    res.json(channels);
});

router.post("/create", validateToken, async (req, res) => {
    const channel = req.body;
    console.log("channel", channel);
    await Channels.create(channel);
    res.json(channel);
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    await Channels.destroy({
        where: {
            id: id,
        },
    });
    res.json("Deleted Successfully");
});

module.exports = router;
