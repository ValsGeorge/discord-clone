const { DMList } = require("../models");
const { Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", validateToken, async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const dmList = await DMList.findAll({
            where: { userId },
        });

        const dmListUsers = await Users.findAll({
            where: {
                id: dmList.map((dm) => dm.dmUserId),
            },
            exclude: ["password"],
        });

        dmListUsers.forEach((user) => {
            user.profilePicture = `${req.protocol}://${req.get(
                "host"
            )}/users/uploads/${user.id}`;
        });
        res.json(dmListUsers);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add-user", validateToken, async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const dmUserId = parseInt(req.body.dmUserId);

        if (userId === dmUserId) {
            return res.status(403).json({ error: "Cannot add yourself" });
        }

        const alreadyExists = await DMList.findOne({
            where: {
                userId,
                dmUserId,
            },
        });

        if (alreadyExists) {
            return res
                .status(403)
                .json({ error: "User already exists in DM list" });
        }

        const dmList = await DMList.create({
            userId,
            dmUserId,
        });
        res.json(dmList);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/remove-user/:dmUserId", validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const dmUserId = parseInt(req.params.dmUserId);
        console.log(userId, dmUserId);

        const dmList = await DMList.destroy({
            where: {
                userId,
                dmUserId,
            },
        });
        res.json(dmList);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;
