import { Router } from 'express';
import FriendsController from '@controllers/friends.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class FriendsRoute implements Routes {
    public path = '/friends';
    public router = Router();
    public friendsController = new FriendsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/`,
            authMiddleware,
            this.friendsController.getFriends
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.friendsController.removeFriend
        );
    }
}

export default FriendsRoute;
