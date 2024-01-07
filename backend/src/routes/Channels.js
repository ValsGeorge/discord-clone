const express = require("express");
const router = express.Router();
const { Categories } = require("../models");
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

router.get("/categories/:serverId", validateToken, async (req, res) => {
    const serverId = req.params.serverId;
    console.log("serverId: ", serverId);

    const categories = await Categories.findAll({
        where: {
            serverId: serverId,
        },
    });

    res.json(categories);
});

router.get("/info/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const channel = await Channels.findByPk(id);
    res.json(channel);
});

module.exports = router;
