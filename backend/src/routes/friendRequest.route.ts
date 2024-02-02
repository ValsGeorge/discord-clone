import { Router } from 'express';
import FriendRequestController from '@controllers/friendRequests.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class FriendRequestRoute implements Routes {
    public path = '/friend-requests';
    public router = Router();
    public friendRequestController = new FriendRequestController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            this.friendRequestController.getFriendRequests
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            this.friendRequestController.respondFriendRequest
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.friendRequestController.removeFriendRequest
        );
    }
}

export default FriendRequestRoute;
