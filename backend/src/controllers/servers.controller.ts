import { NextFunction, Request, Response } from 'express';
import { CreateServerDto } from '@dtos/servers.dto';
import { Server } from '@interfaces/server.interface';
import ServerService from 'services/server.service';

class ServerController {
    public serverService = new ServerService();

    public getServers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const findAllServersData: Server[] =
                await this.serverService.findAllServer();

            res.status(200).json({
                data: findAllServersData,
                message: 'findAll',
            });
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

            res.status(200).json({
                data: findOneServerData,
                message: 'findOne',
            });
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
