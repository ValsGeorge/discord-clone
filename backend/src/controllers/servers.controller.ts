import { NextFunction, Request, Response } from 'express';
import { CreateServerDto } from '@dtos/servers.dto';
import { Server } from '@/interfaces/servers.interface';
import ServerService from '@/services/servers.service';
import { CreateCategoryDto } from '@/dtos/categories.dto';
import CategoryService from '@/services/categories.service';
import { CreateChannelDto } from '@/dtos/channels.dto';
import ChannelService from '@/services/channels.service';

class ServerController {
    public serverService = new ServerService();
    public categoryService = new CategoryService();
    public channelService = new ChannelService();

    public getServers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const findAllServersData: Server[] =
                await this.serverService.findAllServer();

            res.status(200).json(findAllServersData);
        } catch (error) {
            next(error);
        }
    };

    public getServerById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const serverId: string = req.params.id;
            const findOneServerData: Server =
                await this.serverService.findServerById(serverId);

            res.status(200).json(findOneServerData);
        } catch (error) {
            next(error);
        }
    };

    public createServer = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const serverData: CreateServerDto = req.body;

            const userId = req.user.id;
            console.log('userId', userId);
            serverData.owner = userId;
            serverData.members = [userId];
            const createServerData: Server =
                await this.serverService.createServer(serverData);

            // into that server create two categories ( text and voice )
            // and one channel in each category

            const createTextCategory: CreateCategoryDto = {
                name: 'Text',
                description: 'Text channels',
                order: 0,
                server: createServerData.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const textCategory = await this.categoryService.createCategory(
                createTextCategory
            );

            // Create Voice category
            const createVoiceCategory: CreateCategoryDto = {
                name: 'Voice',
                description: 'Voice channels',
                order: 1,
                server: createServerData.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const voiceCategory = await this.categoryService.createCategory(
                createVoiceCategory
            );

            // Create Text channel in Text category
            const createTextChannelData: CreateChannelDto = {
                name: 'General',
                description: 'General text channel',
                type: 'text',
                order: 0,
                server: createServerData.id,
                category: textCategory.id, // Use the ID of the Text category
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await this.channelService.createChannel(createTextChannelData);

            // Create Voice channel in Voice category
            const createVoiceChannelData: CreateChannelDto = {
                name: 'General',
                description: 'General voice channel',
                type: 'voice',
                order: 0,
                server: createServerData.id,
                category: voiceCategory.id, // Use the ID of the Voice category
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await this.channelService.createChannel(createVoiceChannelData);

            res.status(201).json({
                data: createServerData,
                message: 'created',
            });
        } catch (error) {
            next(error);
        }
    };

    public updateServer = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const serverId: string = req.params.id;
            const serverData: CreateServerDto = req.body;
            const updateServerData: Server =
                await this.serverService.updateServer(serverId, serverData);

            res.status(200).json({
                data: updateServerData,
                message: 'updated',
            });
        } catch (error) {
            next(error);
        }
    };

    public deleteServer = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const serverId: string = req.params.id;
            const deleteServerData: Server =
                await this.serverService.deleteServer(serverId);

            res.status(200).json({
                data: deleteServerData,
                message: 'deleted',
            });
        } catch (error) {
            next(error);
        }
    };
}

export default ServerController;
