import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import DMListController from '@/controllers/dmList.controller';

class DMListRoute implements Routes {
    public path = '/dm-list';
    public router = Router();
    public dmListController = new DMListController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/`,
            authMiddleware,
            this.dmListController.getAllDMListByMe
        );
        this.router.post(
            `${this.path}/`,
            authMiddleware,
            this.dmListController.createDMList
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            this.dmListController.updateDMList
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.dmListController.deleteDMList
        );
    }
}

export default DMListRoute;
