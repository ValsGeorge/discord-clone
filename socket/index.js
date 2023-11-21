const { Server } = require("socket.io");

const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });

    socket.on("sendMessage", (message) => {
        console.log(message);
        io.emit("receiveMessage", message);
    });
});
