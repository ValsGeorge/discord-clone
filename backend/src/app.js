const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const config = require("./config/config");
const {
    createMessage,
    getMessages,
    editMessage,
    getDMs,
    createDM,
} = require("./routes/Messages");
const { validateSocketToken } = require("./middlewares/AuthMiddleware");

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

// Routers
// const usersRouter = require("./routes/Users");
const { router: usersRouter, sendFriendRequest } = require("./routes/Users");
app.use("/users", usersRouter);

const serversRouter = require("./routes/Servers");
app.use("/servers", serversRouter);

const channelsRouter = require("./routes/Channels");
app.use("/channels", channelsRouter);

app.use("/messages/get-messages", getMessages);

app.get("/messages/get-dms", getDMs);

const dmListRouter = require("./routes/DMList");
app.use("/dm-list", dmListRouter);

const { Server } = require("socket.io");

const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const onlineUsers = {};
const connectedUsers = {};
const { Users, ServerMembers } = require("./models");

// Function to fetch user details from the database
async function fetchUserDetails(userId) {
    try {
        const user = await Users.findOne({
            where: {
                id: userId,
            },
        });

        const serversIn = await ServerMembers.findAll({
            where: {
                userId: userId,
            },
        });
        const serverIds = serversIn.map(
            (serverMember) => serverMember.serverId
        );

        // Add serverIds to the user object
        user.dataValues.serverIds = serverIds;

        return user;
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
    return { userId, username: "JohnDoe" };
}

io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        validateSocketToken(socket, next);
    } else {
        next(new Error("Authentication error"));
    }
}).on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.decoded.id;
    console.log("userId: ", userId);

    try {
        fetchUserDetails(userId).then((user) => {
            console.log("user: ", user);
            onlineUsers[userId] = user;
            connectedUsers[user.id] = socket.id;
            console.log("onlineUsers: ", onlineUsers);
            // Broadcast the updated online user list to all clients
            io.emit("updateOnlineUsers", Object.values(onlineUsers));
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
    }

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete onlineUsers[userId];

        // Broadcast the updated online user list to all clients
        io.emit("updateOnlineUsers", Object.values(onlineUsers));
    });

    socket.on("sendMessage", (message) => {
        message.userId = userId;
        console.log(message);
        createMessage(message)
            .then((fullMessage) => {
                console.log("fullMessage: ", fullMessage);
                io.emit("receiveMessage", fullMessage);
            })
            .catch((error) => {
                console.log("Error creating message:", error);
            });
    });
    socket.on("editMessage", (message) => {
        console.log(message);
        editMessage(message)
            .then((fullMessage) => {
                console.log("fullMessage: ", fullMessage);
                io.emit("receiveMessage", fullMessage);
            })
            .catch((error) => {
                console.error("Error editing message:", error);
                // Handle the error appropriately
            });
    });

    socket.on("sendDM", ({ dm, to }) => {
        // dm.userId = userId;
        console.log("dddm", dm);
        console.log("to", to);
        createDM(dm)
            .then((fullDM) => {
                console.log("fullDM: ", fullDM);

                try {
                    // Emit the DM to the sender
                    io.to(socket.id).emit("privateMessage", fullDM);
                    // Emit the DM to the receiver
                    const receiverSocketId = connectedUsers[dm.receiverId];
                    io.to(receiverSocketId).emit("privateMessage", fullDM);
                } catch (error) {
                    console.error("Error sending DM:", error);
                }
            })
            .catch((error) => {
                console.log("Error creating DM:", error);
            });
    });

    socket.on("sendFriendRequest", (friendRequest) => {
        console.log(friendRequest);
        sendFriendRequest(friendRequest)
            .then((sender) => {
                console.log("sender: ", sender);
                socket.broadcast.emit("receiveFriendRequest", sender);
            })
            .catch((error) => {
                console.error("Error sending friend request:", error);
            });
    });
});

sequelize.sync({ force: false, logging: console.log }).then(() => {
    app.listen(config.port);
    console.log(`Server started on port ${config.port}`);
});
