import { Router } from 'express';
import { CreateChannelDto } from '@/dtos/channels.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ChannelController from '@controllers/channels.controller';

class ChannelRoute implements Routes {
    public path = '/channels';
    public router = Router();
    public channelController = new ChannelController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/:serverId`,
            authMiddleware,
            this.channelController.getChannels
        );
        this.router.get(
            `${this.path}/info/:id`,
            authMiddleware,
            this.channelController.getChannelById
        );
        this.router.post(
            `${this.path}/`,
            authMiddleware,
            validationMiddleware(CreateChannelDto, 'body'),
            this.channelController.createChannel
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            validationMiddleware(CreateChannelDto, 'body', true),
            this.channelController.updateChannel
        );
        this.router.post(
            `${this.path}/update-order`,
            authMiddleware,
            this.channelController.updateChannelsOrder
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.channelController.deleteChannel
        );
    }
}

export default ChannelRoute;
