const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const config = require("./config/config");
const { createMessage, getMessages } = require("./routes/Messages");
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

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });

    socket.on("sendMessage", (message) => {
        message.userId = userId;
        console.log(message);
        createMessage(message);
        io.emit("receiveMessage", message);
    });
});

sequelize.sync({ force: false }).then(() => {
    app.listen(config.port);
    console.log(`Server started on port ${config.port}`);
});
