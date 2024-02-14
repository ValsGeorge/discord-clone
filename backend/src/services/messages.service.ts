import { CreateMessageDto } from '@/dtos/messages.dto';
import { Message } from '@/interfaces/messages.interface';

import messageModel from '@/models/messages.model';
import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';
import { User } from '@/interfaces/users.interface';
import UserService from './users.service';
import ChannelService from './channels.service';
import { Types } from 'mongoose';

class MessageService {
    public messages = messageModel;
    public userService = UserService;
    public channelService = ChannelService;

    public async findAllMessage(channelId: string): Promise<Message[]> {
        const messages: Message[] = await this.messages.find({
            channel: new Types.ObjectId(channelId),
        });
        return messages;
    }

    public async findMessageById(messageId: string): Promise<Message> {
        const findMessage: Message = await this.messages.findOne({
            _id: messageId,
        });
        if (!findMessage) throw new HttpException(409, "Message doesn't exist");

        return findMessage;
    }

    public async createMessage(
        messageData: CreateMessageDto
    ): Promise<Message> {
        if (isEmpty(messageData))
            throw new HttpException(400, "You're not messageData");

        const user = await new this.userService().findUserById(
            messageData.user
        );
        const channel = await new this.channelService().findChannelById(
            messageData.channel
        );
        const createMessageData: Message = await this.messages.create({
            ...messageData,
            user,
            channel,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return createMessageData;
    }

    public async updateMessage(
        messageId: string,
        messageData: CreateMessageDto
    ): Promise<Message> {
        if (isEmpty(messageData))
            throw new HttpException(400, "You're not messageData");

        const updateMessageById: Message =
            await this.messages.findByIdAndUpdate(
                { _id: messageId },
                { content: messageData.content, updatedAt: new Date() }
            );
        if (!updateMessageById)
            throw new HttpException(409, "You're not message");

        const returnEditedMessage: Message = await this.messages.findOne({
            _id: messageId,
        });

        return returnEditedMessage;
    }

    public async deleteMessage(messageId: string): Promise<Message> {
        const deleteMessageById: Message =
            await this.messages.findByIdAndDelete(messageId);
        if (!deleteMessageById)
            throw new HttpException(409, "You're not message");

        return deleteMessageById;
    }
}

export default MessageService;
