import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
class UsersRoute implements Routes {
    public path = '/user';
    public router = Router();
    public usersController = new UsersController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.usersController.getUsers);
        this.router.get(
            `${this.path}/details`,
            authMiddleware,
            this.usersController.getMe
        );
        this.router.get(
            `${this.path}/uploads/:id`,
            this.usersController.getUserProfilePicture
        );
        this.router.get(
            `${this.path}/friend-requests`,
            this.usersController.getFriendRequests
        );

        this.router.get(
            `${this.path}/friends`,
            this.usersController.getFriends
        );

        this.router.get(`${this.path}/:id`, this.usersController.getUserById);
        this.router.post(
            `${this.path}`,
            validationMiddleware(CreateUserDto, 'body'),
            this.usersController.createUser
        );

        this.router.put(
            `${this.path}/:id`,
            validationMiddleware(CreateUserDto, 'body', true),
            this.usersController.updateUser
        );

        this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
    }
}

export default UsersRoute;
