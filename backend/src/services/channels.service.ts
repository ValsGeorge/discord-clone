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

        return findChannel;
    }

    public async createChannel(
        channelData: CreateChannelDto
    ): Promise<Channel> {
        if (isEmpty(channelData))
            throw new HttpException(400, "You're not channelData");

        // count the number of channels in the category and add 1 to the order
        const count = await this.channels.count({
            category: new Types.ObjectId(channelData.category),
        });

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
                category: new Types.ObjectId(channelData.category),
            });
            if (findChannel && findChannel.id !== channelId)
                throw new HttpException(
                    409,
                    `Channel ${channelData.name} already exists`
                );
        }

        await this.channels.updateOne(
            { _id: channelId },
            {
                $set: {
                    name: channelData.name,
                    description: channelData.description,
                    updated_at: Date.now(),
                },
            }
        );

        const updateChannel: Channel = await this.channels.findOne({
            _id: channelId,
        });

        return updateChannel;
    }

    public async updateChannelsOrder(
        channels: Channel[]
    ): Promise<Channel[] | void> {
        if (isEmpty(channels))
            throw new HttpException(400, "You're not channelsData");
        // update the order and category of each channel
        // but only if the order or category has changed
        channels.forEach(async (channel) => {
            const findChannel: Channel = await this.channels.findOne({
                _id: channel.id,
            });
            if (findChannel) {
                if (
                    findChannel.order !== channel.order ||
                    findChannel.category !== channel.category
                ) {
                    await this.channels.updateMany(
                        { _id: channel.id },
                        {
                            $set: {
                                order: channel.order,
                                category: channel.category,
                            },
                        }
                    );
                }
            }
        });

        return channels;
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
