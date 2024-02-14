import { NextFunction, Response } from 'express';
import { Request } from '@/interfaces/req.interface';

import { Server } from '@/interfaces/servers.interface';
import { UserServer } from '@/interfaces/userServer.interface';
import ServerService from '@/services/servers.service';
import { User } from '@/interfaces/users.interface';

import { CreateCategoryDto } from '@/dtos/categories.dto';
import { CreateServerDto } from '@dtos/servers.dto';
import { CreateChannelDto } from '@/dtos/channels.dto';
import { CreateUserServerDto } from '@/dtos/userserver.dto';

import CategoryService from '@/services/categories.service';
import ChannelService from '@/services/channels.service';
import UserService from '@/services/users.service';

class ServerController {
    public serverService = new ServerService();
    public categoryService = new CategoryService();
    public channelService = new ChannelService();
    public userService = new UserService();

    public getServers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user.id;
            const findAllServersData: Server[] =
                await this.serverService.findAllServerByUserId(userId);
            // await this.serverService.findAllServer();

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

    public getServerMembers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const serverId: string = req.params.id;
            const findServerMembersData: User[] =
                await this.serverService.findServerMembers(serverId);

            res.status(200).json(findServerMembersData);
        } catch (error) {
            next(error);
        }
    };

    public generateInviteCode = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const serverId: string = req.params.id;
            // const generateInviteCodeData: string =
            //     await this.serverService.generateServerInviteCode(serverId);
            const server: Server = await this.serverService.findServerById(
                serverId
            );
            const generateInviteCodeData: string = server.inviteCode;
            res.status(200).json(generateInviteCodeData);
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

            // Create Server
            const user: User = await this.userService.findUserById(userId);

            const createServerData: Server =
                await this.serverService.createServer(serverData);

            // Create UserServer
            const createUserServerData: CreateUserServerDto = {
                user: user,
                server: createServerData,
                role: 'owner',
            };

            const createUserServer = await this.userService.createUserServer(
                createUserServerData
            );

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

    public joinServer = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const inviteCode: string = req.body.inviteCode;
            const userId = req.user.id;
            const joinServerData: UserServer =
                await this.serverService.joinServer(inviteCode, userId);
            res.status(200).json(joinServerData);
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

            res.status(200).json(updateServerData);
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
