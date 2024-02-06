import { Router } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ServerController from '@controllers/servers.controller';
import { CreateServerDto } from '@/dtos/servers.dto';
class ServerRoute implements Routes {
    public path = '/servers';
    public router = Router();
    public serverController = new ServerController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/`,
            authMiddleware,
            this.serverController.getServers
        );
        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            this.serverController.getServerById
        );

        this.router.get(
            `${this.path}/generate-invite-code/:id`,
            authMiddleware,
            this.serverController.generateInviteCode
        );

        this.router.get(
            `${this.path}/members/:id`,
            authMiddleware,
            this.serverController.getServerMembers
        );

        this.router.post(
            `${this.path}/`,
            authMiddleware,
            validationMiddleware(CreateServerDto, 'body'),
            this.serverController.createServer
        );

        this.router.post(
            `${this.path}/join-server`,
            authMiddleware,
            this.serverController.joinServer
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            validationMiddleware(CreateServerDto, 'body', true),
            this.serverController.updateServer
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.serverController.deleteServer
        );
    }
}

export default ServerRoute;
