import { Router } from 'express';
import { CreateDmDto } from '@/dtos/dms.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import DmController from '@controllers/dms.controller';

class DmRoute implements Routes {
    public path = '/dms';
    public router = Router();
    public dmController = new DmController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/:userId`,
            authMiddleware,
            this.dmController.getDms
        );
        this.router.post(
            `${this.path}/`,
            authMiddleware,
            validationMiddleware(CreateDmDto, 'body'),
            this.dmController.createDm
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.dmController.deleteDm
        );
    }
}

export default DmRoute;
