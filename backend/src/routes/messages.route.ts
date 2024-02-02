import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import MessageController from '@/controllers/messages.controller';
import { CreateMessageDto } from '@/dtos/messages.dto';
import { channel } from 'diagnostics_channel';

class MessageRoute implements Routes {
    public path = '/messages';
    public router = Router();
    public messageController = new MessageController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/:channelId`,
            authMiddleware,
            this.messageController.getMessages
        );
        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            this.messageController.getMessageById
        );
        this.router.post(
            `${this.path}/`,
            authMiddleware,
            this.messageController.createMessage
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            this.messageController.updateMessage
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.messageController.deleteMessage
        );
    }
}

export default MessageRoute;
