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
    console.log("channels: ", channels);
    res.json(channels);
});

router.post("/create", validateToken, async (req, res) => {
    const channel = req.body;
    const channels = await Channels.findAll({
        where: { categoryId: channel.categoryId },
    });
    channel.order = channels.length;
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

router.get("/info/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const channel = await Channels.findByPk(id);
    res.json(channel);
});

module.exports = router;
