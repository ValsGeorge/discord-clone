const express = require("express");
const router = express.Router();
const { Servers, ServerMembers, Channels } = require("../models");
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

    console.log("data['inviteCode']: ", data["inviteCode"]);

    console.log("username: ", username);
    console.log("userId: ", userId);
    console.log("data: ", data);

    try {
        // Create the server
        const server = await Servers.create({
            ...data,
            username,
            userId: userId,
        });
        // Add the creator as a member of the server
        const serverMember = await ServerMembers.create({
            userId: userId,
            serverId: server.id,
        });

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
                    creatorId: userId,
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
                creatorId: userId,
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

module.exports = router;
