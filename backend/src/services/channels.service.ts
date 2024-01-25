import { CreateChannelDto } from '@/dtos/channels.dto';
import { Channel } from '@/interfaces/channels.interface';

import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';
import channelModel from '@/models/channels.model';
import { Types } from 'mongoose';

class ChanelService {
    public channels = channelModel;

    public async findAllChannels(serverId: string): Promise<Channel[]> {
        const channels: Channel[] = await this.channels.find({
            server: new Types.ObjectId(serverId),
        });
        return channels;
    }

    public async findChannelById(channelId: string): Promise<Channel> {
        const findChannel: Channel = await this.channels.findOne({
            _id: channelId,
        });
        if (!findChannel) throw new HttpException(409, "Channel doesn't exist");
        console.log('channelId', channelId);
        console.log('findChannel', findChannel);
        return findChannel;
    }

    public async createChannel(
        channelData: CreateChannelDto
    ): Promise<Channel> {
        if (isEmpty(channelData))
            throw new HttpException(400, "You're not channelData");

        console.log('channelData:', channelData);

        // count the number of channels in the category and add 1 to the order
        const count = await this.channels.count({
            category: new Types.ObjectId(channelData.category),
        });
        console.log('count:', count);

        const createChannelData: Channel = await this.channels.create({
            ...channelData,
            order: count,
        });

        return createChannelData;
    }

    public async updateChannel(
        channelId: string,
        channelData: CreateChannelDto
    ): Promise<Channel> {
        if (isEmpty(channelData))
            throw new HttpException(400, "You're not channelData");

        if (channelData.name) {
            const findChannel: Channel = await this.channels.findOne({
                name: channelData.name,
            });
            if (findChannel && findChannel.id !== channelId)
                throw new HttpException(
                    409,
                    `Channel ${channelData.name} already exists`
                );
        }

        await this.channels.update(channelData, { where: { id: channelId } });

        const updateChannel: Channel = await this.channels.findOne({
            _id: channelId,
        });

        return updateChannel;
    }

    public async deleteChannel(channelId: string): Promise<Channel> {
        const findChannel: Channel = await this.channels.findOne({
            _id: channelId,
        });
        if (!findChannel) throw new HttpException(409, "Channel doesn't exist");

        await this.channels.deleteOne({ where: { id: channelId } });
        return findChannel;
    }
}

export default ChanelService;
