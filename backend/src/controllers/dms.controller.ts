import { NextFunction, Request, Response } from 'express';
import { CreateDmDto } from '../dtos/dms.dto';
import { Dm } from '../interfaces/dms.interface';
import DmService from '../services/dms.service';
import UserService from '../services/users.service';

class DmController {
    public dmService = new DmService();
    public userService = new UserService();

    public getDms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.userId;
            const findAllDmsData: Dm[] = await this.dmService.findAllDm(userId);
            res.status(200).json(findAllDmsData);
        } catch (error) {
            next(error);
        }
    };

    public getDmById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmId: string = req.params.id;
            const findOneDmData: Dm = await this.dmService.findDmById(dmId);

            res.status(200).json(findOneDmData);
        } catch (error) {
            next(error);
        }
    };

    public createDm = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmData: CreateDmDto = req.body;

            const userId = req.user.id;
            console.log('userId', userId);
            dmData.user = userId;
            const createDmData: Dm = await this.dmService.createDm(dmData);

            res.status(201).json(createDmData);
        } catch (error) {
            next(error);
        }
    };

    public updateDm = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmId: string = req.params.id;
            const dmData: CreateDmDto = req.body;
            const updateDmData: Dm = await this.dmService.updateDm(
                dmId,
                dmData
            );
            res.status(200).json(updateDmData);
        } catch (error) {
            next(error);
        }
    };

    public deleteDm = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmId: string = req.params.id;
            const deleteDmData: Dm = await this.dmService.deleteDm(dmId);
            res.status(200).json(deleteDmData);
        } catch (error) {
            next(error);
        }
    };
}

export default DmController;
