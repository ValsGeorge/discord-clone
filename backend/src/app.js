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
} = require("./routes/Messages");
const { validateSocketToken } = require("./middlewares/AuthMiddleware");

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

// Routers
const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);

const serversRouter = require("./routes/Servers");
app.use("/servers", serversRouter);

const channelsRouter = require("./routes/Channels");
app.use("/channels", channelsRouter);

app.use("/messages/get-messages", getMessages);

const { Server } = require("socket.io");

const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const onlineUsers = {};

const { Users } = require("./models");

// Function to fetch user details from the database
async function fetchUserDetails(userId) {
    try {
        const user = await Users.findOne({
            where: {
                id: userId,
            },
        });
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
        io.emit("updateOnlineUsers", Object.keys(onlineUsers));
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
});

sequelize.sync({ force: false }).then(() => {
    app.listen(config.port);
    console.log(`Server started on port ${config.port}`);
});
