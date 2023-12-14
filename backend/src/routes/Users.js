const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { Friends } = require("../models");
const { FriendRequest } = require("../models");
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
    console.log("data: ", data);

    try {
        const hash = await bcrypt.hash(data.password, 10);

        data.password = hash;

        await Users.create({
            nickname: data.nickname,
            username: data.username,
            password: data.password,
            email: data.email,
            profilePicture:
                data.profilePicture || "default-profile-picture.png",
        });

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
    // Old system
    // user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${
    //     user.profilePicture
    // }`;

    // Now get the profile image using the user id because that's how it's uploaded fsr
    user.profilePicture = `${req.protocol}://${req.get("host")}/users/uploads/${
        user.id
    }`;
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

// router.post("/friends", validateToken, async (req, res) => {
//     const data = req.body;

//     try {
//         const user = await Users.findByPk(data.userId);
//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         const friend = await Users.findByPk(data.friendId);
//         if (!friend) {
//             return res.status(404).send("Friend not found");
//         }

//         const info = await Friends.create({
//             userId: data.userId,
//             friendId: data.friendId,
//         });

//         res.json(info);
//     } catch (error) {
//         console.error("Error during adding friend:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

router.get("/friends", validateToken, async (req, res) => {
    const id = req.user.id;
    console.log("friends");
    console.log("id: ", id);
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const friends = await Friends.findAll({
            where: {
                userId: id,
            },
        });

        const friendIds = friends.map((friend) => friend.friendId);

        const friendUsers = await Users.findAll({
            where: {
                id: friendIds,
            },
            attributes: { exclude: ["password"] },
        });
        console.log("friendUsers: ", friendUsers);
        res.json(friendUsers);
    } catch (error) {
        console.error("Error during getting friends:", error);
        res.status(500).send("Internal Server Error");
    }
});

const sendFriendRequest = async (data) => {
    try {
        console.log("data: ", data);
        const senderId = parseInt(data.senderId);
        const receiverId = parseInt(data.receiverId);

        const user = await Users.findByPk(senderId);
        if (!user) {
            throw new Error("User not found");
        }

        const friend = await Users.findByPk(receiverId);
        if (!friend) {
            throw new Error("Friend not found");
        }

        await FriendRequest.create({
            userId: senderId,
            friendRequestId: receiverId,
        });

        let sender = await Users.findByPk(senderId, {
            attributes: { exclude: ["password"] },
        });

        console.log("sender: ", sender);
        return sender;
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw error;
    }
};

router.get("/friend-requests", validateToken, async (req, res) => {
    const id = req.user.id;
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const friendRequests = await FriendRequest.findAll({
            where: {
                friendRequestId: id,
            },
        });

        const friendRequestIds = friendRequests.map(
            (friendRequest) => friendRequest.userId
        );

        const friendRequestUsers = await Users.findAll({
            where: {
                id: friendRequestIds,
            },
            attributes: { exclude: ["password"] },
        });
        friendRequestUsers.forEach((friendRequestUser) => {
            friendRequestUser.profilePicture = `${req.protocol}://${req.get(
                "host"
            )}/users/uploads/${friendRequestUser.id}`;
        });
        res.json(friendRequestUsers);
    } catch (error) {
        console.error("Error during getting friend requests:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put("/friend-request", validateToken, async (req, res) => {
    const userId = req.body.userId;
    const friendRequestId = req.body.friendRequestId;
    const status = req.body.status;

    try {
        const friendRequest = await FriendRequest.findOne({
            where: {
                userId: userId,
                friendRequestId: friendRequestId,
            },
        });

        if (!friendRequest) {
            return res.status(404).send("Friend request not found");
        }

        if (status === "accept") {
            await Friends.create({
                userId: userId,
                friendId: friendRequestId,
            });

            await Friends.create({
                userId: friendRequestId,
                friendId: userId,
            });
            await friendRequest.destroy();
            res.json({ message: "Friend request accepted" });
        } else if (status === "decline") {
            await friendRequest.destroy();
            res.json({ message: "Friend request deleted" });
        }
    } catch (error) {
        console.error("Error during deleting friend request:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = {
    router,
    sendFriendRequest,
};
