const express = require("express");
const router = express.Router();
const { Messages } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/get-messages", validateToken, async (req, res) => {
    const { channelId } = req.query;

    const messages = await Messages.findAll({
        where: {
            channelId: channelId,
        },
    });

    res.json(messages);
});

router.post("/create-message", validateToken, async (req, res) => {
    const userId = req.user.id;

    const data = {
        content: req.body.content,
        userId: userId,
        channelId: req.body.channelId,
    };

    await Messages.create(data);
    res.json(data);
});

module.exports = router;
