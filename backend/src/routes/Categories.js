const express = require("express");
const router = express.Router();
const { Categories } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:serverId", validateToken, async (req, res) => {
    const serverId = req.params.serverId;
    console.log("serverId: ", serverId);

    const categories = await Categories.findAll({
        where: {
            serverId: serverId,
        },
    });

    res.json(categories);
});

router.put("/update-order", validateToken, async (req, res) => {
    const { categories } = req.body;
    console.log("categories: ", categories);

    categories.forEach(async (category) => {
        await Categories.update(
            { order: category.order },
            { where: { id: category.id } }
        );
    });

    res.json(categories);
});

module.exports = router;
