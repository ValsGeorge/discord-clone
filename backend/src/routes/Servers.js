const express = require("express");
const router = express.Router();
const { Servers, ServerMembers, Channels, Categories } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const servers = await Servers.findAll({
        where: {
            userId: req.user.id,
        },
    });
    res.json(servers);
});

router.get("/get-servers", validateToken, async (req, res) => {
    const userId = req.user.id;
    console.log(userId);

    try {
        const serverMembers = await ServerMembers.findAll({
            where: {
                userId,
            },
        });
        const serverIds = serverMembers.map((member) => member.serverId);

        // Step 2: Retrieve servers based on the obtained serverIds
        const userServers = await Servers.findAll({
            where: {
                id: serverIds,
            },
            include: [{ model: Channels, as: "Channels" }],
        });

        res.json(userServers);
    } catch (error) {
        console.error("Error during getting servers:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/create-server", validateToken, async (req, res) => {
    const data = req.body;
    console.log(data);

    const username = req.user.username;
    const userId = req.user.id;

    // for now, check the data
    // TODO: IMPLEMENT THE CORRECT FORM IN THE FRONTEND
    data["description"] = data["description"] || "No description provided";
    data["inviteCode"] = data["inviteCode"] || generateInviteCode();

    try {
        // Create the server
        const server = await Servers.create({
            ...data,
            username,
            userId: userId,
        });

        console.log("server: ", server);
        // Add the creator as a member of the server
        const serverMember = await ServerMembers.create({
            userId: userId,
            serverId: server.id,
        });
        console.log("serverMember: ", serverMember);

        // create a text Categories and a voice Categories
        const textCategory = await Categories.create({
            name: "Text Channels",
            serverId: server.id,
            order: 0,
        });

        console.log("textCategory: ", textCategory);
        const voiceCategory = await Categories.create({
            name: "Voice Channels",
            serverId: server.id,
            order: 1,
        });

        console.log("voiceCategory: ", voiceCategory);

        // create a general text channel and a general voice channel
        const generalTextChannel = await Channels.create({
            name: "general",
            type: "text",
            serverId: server.id,
            categoryId: textCategory.id,
        });
        console.log("generalTextChannel: ", generalTextChannel);
        const generaVoiceChannel = await Channels.create({
            name: "general",
            type: "voice",
            serverId: server.id,
            categoryId: voiceCategory.id,
        });

        console.log("generaVoiceChannel: ", generaVoiceChannel);
        console.log("serverMember: ", serverMember);

        res.json(server);
    } catch (error) {
        console.error("Error during server creation:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get(
    "/generate-invite-code/:serverId",
    validateToken,
    async (req, res) => {
        let serverId = req.params.serverId,
            userId = req.user.id;
        console.log("req", req.params);

        console.log("serverId: ", serverId);
        console.log("userId: ", userId);
        try {
            serverId = parseInt(serverId);
            userId = parseInt(userId);
        } catch (error) {
            console.error("Error during invite code generation:", error);
            res.status(500).send("Internal Server Error");
        }

        try {
            const test = await Servers.findAll({
                where: {
                    id: serverId,
                },
            });
            console.log("test: ", test);
            const server = await Servers.findOne({
                where: {
                    id: serverId,
                    userId: userId,
                },
            });
            console.log("serverId: ", serverId);
            console.log("userId: ", userId);
            console.log("server: ", server);

            if (!server) {
                return res
                    .status(401)
                    .send("You are not the owner of this server");
            }

            const inviteCode = generateInviteCode();

            await Servers.update(
                {
                    inviteCode,
                },
                {
                    where: {
                        id: serverId,
                    },
                }
            );
            res.json(inviteCode);
        } catch (error) {
            console.error("Error during invite code generation:", error);
            res.status(500).send("Internal Server Error");
        }
    }
);

const generateInviteCode = () => {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
};

router.post("/join-server", validateToken, async (req, res) => {
    console.log("join server");
    const { inviteCode } = req.body;
    const userId = req.user.id;

    try {
        const server = await Servers.findOne({
            where: {
                inviteCode,
            },
        });

        if (!server) {
            return res.status(404).send("Server not found");
        }

        console.log("server: ", server);

        await ServerMembers.create({
            serverId: server.id,
            userId: userId,
        });

        res.json(server);
    } catch (error) {
        console.error("Error during server joining:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/delete-server/:serverId", validateToken, async (req, res) => {
    const serverId = parseInt(req.params.serverId);
    const userId = parseInt(req.user.id);

    try {
        const server = await Servers.findOne({
            where: {
                id: serverId,
                userId: userId,
            },
        });
        if (!server) {
            return res.status(401).send("You are not the owner of this server");
        }

        await Servers.destroy({
            where: {
                id: serverId,
            },
        });

        res.json("Server deleted");
    } catch (error) {
        console.error("Error during server deletion:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/server-info/:serverId", validateToken, async (req, res) => {
    const serverId = parseInt(req.params.serverId);
    const userId = parseInt(req.user.id);

    try {
        const server = await Servers.findOne({
            where: {
                id: serverId,
                userId: userId,
            },
        });

        if (!server) {
            return res.status(401).send("Not authorized to view this server");
        }

        res.json(server);
    } catch (error) {
        console.error("Error during server info retrieval:", error);
        res.status(500).send("Internal Server Error");
    }
});

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "server/images/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage: storage });

router.post(
    "/upload-server-image",
    validateToken,
    upload.single("file"),
    async (req, res) => {
        console.log("req.file: ", req.file);
        console.log("req.body: ", req.body);
        try {
            const file = req.file;

            if (!file) {
                res.status(400).send("No file uploaded");
            }

            const server = await Servers.findOne({
                where: {
                    id: req.body.serverId,
                    userId: req.user.id,
                },
            });

            if (!server) {
                return res.status(401).send("Not authorized to upload image");
            }

            await Servers.update(
                {
                    image: file.filename,
                },
                {
                    where: {
                        id: req.body.serverId,
                    },
                }
            );

            res.status(200).send("File uploaded");
        } catch (error) {
            console.error("Error during server image upload:", error);
            res.status(500).send("Internal Server Error");
        }
    }
);

router.get("/server-image/:serverId", async (req, res) => {
    const serverId = req.params.serverId;
    console.log("sserverId: ", serverId);

    const server = await Servers.findOne({
        where: {
            id: serverId,
        },
    });
    console.log("server: ", server);

    if (!server) {
        return res.status(404).send("Server not found");
    }
    console.log("server.image: ", server.image);
    if (!server.image) {
        res.json({
            image: null,
        });
    } else {
        const filePath = path.join(
            __dirname,
            "../../server/images",
            server.image
        );
        console.log("filePath: ", filePath);
        res.sendFile(filePath);
    }
});

module.exports = router;
