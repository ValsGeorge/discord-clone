import { CreateMessageDto } from '@/dtos/messages.dto';
import { Message } from '@/interfaces/messages.interface';

import messageModel from '@/models/messages.model';
import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';
import { User } from '@/interfaces/users.interface';
import UserService from './users.service';
import ChannelService from './channels.service';

class MessageService {
    public messages = messageModel;
    public userService = UserService;
    public channelService = ChannelService;

    public async findAllMessage(channelId: string): Promise<Message[]> {
        const messages: Message[] = await this.messages.find({
            channel: channelId,
        });
        return messages;
    }

    public async findMessageById(messageId: string): Promise<Message> {
        const findMessage: Message = await this.messages.findOne({
            where: { id: messageId },
        });
        if (!findMessage) throw new HttpException(409, "Message doesn't exist");

        return findMessage;
    }

    public async createMessage(
        messageData: CreateMessageDto
    ): Promise<Message> {
        if (isEmpty(messageData))
            throw new HttpException(400, "You're not messageData");

        const createMessageData: Message = await this.messages.create({
            ...messageData,
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
            await this.messages.findByIdAndUpdate(messageId, { messageData });
        if (!updateMessageById)
            throw new HttpException(409, "You're not message");

        return updateMessageById;
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
