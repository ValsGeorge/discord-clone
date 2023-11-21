const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage: storage });

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

router.get("/details/:id", validateToken, async (req, res) => {
    const id = req.params.id;

    const user = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        return res.status(404).send("User not found");
    }
    user.profilePicture = `/uploads/${user.profilePicture}`;

    res.json(user);
});

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send("No file uploaded");
        }

        res.json({ path: file.path });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/uploads/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const profilePicture = user.profilePicture;

        const filePath = path.join(__dirname, "../../uploads", profilePicture);
        res.sendFile(filePath);
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
