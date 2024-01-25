import { NextFunction, Request, Response } from 'express';
import { CreateChannelDto } from '@/dtos/channels.dto';
import { Channel } from '@/interfaces/channels.interface';
import ChannelService from '@/services/channels.service';

class ChannelController {
    public channelService = new ChannelService();

    public getChannels = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const serverId: string = req.params.serverId;
            const findAllChannelsData: Channel[] =
                await this.channelService.findAllChannels(serverId);

            res.status(200).json(findAllChannelsData);
        } catch (error) {
            next(error);
        }
    };

    public getChannelById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const channelId: string = req.params.id;
            const findOneChannelData: Channel =
                await this.channelService.findChannelById(channelId);

            res.status(200).json(findOneChannelData);
        } catch (error) {
            next(error);
        }
    };

    public createChannel = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const channelData: CreateChannelDto = req.body;

            console.log('channelData:', channelData);

            const createChannelData: Channel =
                await this.channelService.createChannel(channelData);

            res.status(201).json(createChannelData);
        } catch (error) {
            next(error);
        }
    };

    public updateChannel = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const channelId: string = req.params.id;
            const channelData: CreateChannelDto = req.body;

            const updateChannelData: Channel =
                await this.channelService.updateChannel(channelId, channelData);

            res.status(200).json(updateChannelData);
        } catch (error) {
            next(error);
        }
    };

    public deleteChannel = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const channelId: string = req.params.id;
            const deleteChannelData: Channel =
                await this.channelService.deleteChannel(channelId);

            res.status(200).json(deleteChannelData);
        } catch (error) {
            next(error);
        }
    };
}

export default ChannelController;
