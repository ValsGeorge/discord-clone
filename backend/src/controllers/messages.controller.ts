import { NextFunction, Response } from 'express';
import { Request } from '@/interfaces/req.interface';
import { CreateMessageDto } from '@/dtos/messages.dto';
import { Message } from '@/interfaces/messages.interface';
import MessageService from '@/services/messages.service';
import ChannelService from '@/services/channels.service';
import UserService from '@/services/users.service';

class MessageController {
    public messageService = new MessageService();
    public userService = new UserService();
    public channelService = new ChannelService();

    public getMessages = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const channelId: string = req.params.channelId;
            const findAllMessagesData: Message[] =
                await this.messageService.findAllMessage(channelId);
            res.status(200).json(findAllMessagesData);
        } catch (error) {
            next(error);
        }
    };

    public getMessageById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const messageId: string = req.params.id;
            const findOneMessageData: Message =
                await this.messageService.findMessageById(messageId);

            res.status(200).json(findOneMessageData);
        } catch (error) {
            next(error);
        }
    };

    public createMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const messageData: CreateMessageDto = req.body;

            const userId = req.user.id;
            messageData.user = userId;
            const createMessageData: Message =
                await this.messageService.createMessage(messageData);

            res.status(201).json(createMessageData);
        } catch (error) {
            next(error);
        }
    };

    public updateMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const messageId: string = req.params.id;
            const messageData: CreateMessageDto = req.body;
            const updateMessageData: Message =
                await this.messageService.updateMessage(messageId, messageData);

            res.status(200).json(updateMessageData);
        } catch (error) {
            next(error);
        }
    };

    public deleteMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const messageId: string = req.params.id;
            const deleteMessageData: Message =
                await this.messageService.deleteMessage(messageId);

            res.status(200).json(deleteMessageData);
        } catch (error) {
            next(error);
        }
    };
}

export default MessageController;
