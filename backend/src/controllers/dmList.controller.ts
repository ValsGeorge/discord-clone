import { NextFunction, Request, Response } from 'express';
import { User } from '@/interfaces/users.interface';
import { DmList } from '@/interfaces/dmList.interface';

import DMListService from '@/services/dmList.service';
import UserService from '@/services/users.service';

class DMListController {
    public dmListService = new DMListService();
    public userService = new UserService();

    public getAllDMListByMe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmListId: string = req.user.id;
            console.log('dmListId:', dmListId);
            const findDMListData: DmList[] =
                await this.dmListService.findAllDMListByMe(dmListId);

            console.log('findDMListData:', findDMListData);

            res.status(200).json(findDMListData);
        } catch (error) {
            next(error);
        }
    };

    public createDMList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmListData: DmList = req.body;
            const createDMListData: DmList =
                await this.dmListService.createDMList(dmListData);

            res.status(201).json(createDMListData);
        } catch (error) {
            next(error);
        }
    };

    public updateDMList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmListId: string = req.params.id;
            const dmListData: DmList = req.body;
            const updateDMListData: DmList =
                await this.dmListService.updateDMList(dmListId, dmListData);

            res.status(200).json(updateDMListData);
        } catch (error) {
            next(error);
        }
    };

    public deleteDMList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dmListId: string = req.params.id;
            const deleteDMListData: DmList =
                await this.dmListService.deleteDMList(dmListId);

            res.status(200).json(deleteDMListData);
        } catch (error) {
            next(error);
        }
    };
}

export default DMListController;
