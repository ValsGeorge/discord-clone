const { Messages } = require("../models");
const { DMs } = require("../models");

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

// This function edits a message in the database and returns the full message
const editMessage = async (message) => {
    try {
        console.log("message: ", message);

        // Update the message in the database
        await Messages.update(
            {
                content: message.content,
                updatedAt: new Date(),
            },
            {
                where: {
                    id: message.id,
                },
            }
        );

        // Fetch the updated message from the database
        const updatedMessage = await Messages.findOne({
            where: {
                id: message.id,
            },
        });

        console.log("updatedMessage: ", updatedMessage);

        if (!updatedMessage) {
            throw new Error("Message not found");
        }

        return updatedMessage;
    } catch (error) {
        console.error("Error editing message:", error);
        throw new Error("Error saving message to the database");
    }
};

const getDMs = async (req, res) => {
    try {
        const senderId = parseInt(req.query.senderId);
        const receiverId = parseInt(req.query.receiverId);
        const dms = await DMs.findAll({
            where: { senderId, receiverId },
            order: [["createdAt", "ASC"]],
        });

        res.json(dms);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createDM = async (message) => {
    try {
        message.senderId = parseInt(message.senderId);
        message.receiverId = parseInt(message.receiverId);
        console.log("message: ", message);
        const savedMessage = await DMs.create({
            content: message.content,
            senderId: message.senderId,
            receiverId: message.receiverId,
        });
        console.log("savedMessage: ", savedMessage);
        return savedMessage;
    } catch (error) {
        throw new Error("Error saving message to the database");
    }
};

module.exports = { getMessages, createMessage, editMessage, getDMs, createDM };
