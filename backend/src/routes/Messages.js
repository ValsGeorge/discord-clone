const { Messages } = require("../models");

const getMessages = async (req, res) => {
    try {
        const channelId = parseInt(req.query.channelId);
        const messages = await Messages.findAll({
            where: { channelId },
            order: [["createdAt", "ASC"]],
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const createMessage = async (message) => {
    try {
        message.channelId = parseInt(message.channelId);
        console.log("message: ", message);
        const savedMessage = await Messages.create({
            content: message.content,
            channelId: message.channelId,
            userId: message.userId,
        });
        console.log("savedMessage: ", savedMessage);
        return savedMessage;
    } catch (error) {
        throw new Error("Error saving message to the database");
    }
};

module.exports = { getMessages, createMessage };
