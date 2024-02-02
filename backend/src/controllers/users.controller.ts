import { NextFunction, Response } from 'express';
import { Request } from '@/interfaces/req.interface';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import multer from 'multer';
import path from 'path';

class UsersController {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Destination folder for uploaded images
        },
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
                null,
                file.fieldname +
                    '-' +
                    uniqueSuffix +
                    '.' +
                    file.originalname.split('.').pop()
            );
        },
    });

    upload = multer({ storage: this.storage });

    public userService = new userService();

    public getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const findAllUsersData: User[] =
                await this.userService.findAllUser();

            res.status(200).json({
                data: findAllUsersData,
                message: 'findAll',
            });
        } catch (error) {
            next(error);
        }
    };

    public getUserById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId: string = req.params.id;
            const findOneUserData: User = await this.userService.findUserById(
                userId
            );

            res.status(200).json(findOneUserData);
        } catch (error) {
            next(error);
        }
    };

    public getMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user.id;
            const findOneUserData: User = await this.userService.findUserById(
                userId
            );

            res.status(200).json(findOneUserData);
        } catch (error) {
            next(error);
        }
    };

    public getUserProfilePicture = async (req: Request, res: Response) => {
        try {
            console.log('getUserProfilePicture', req.params);
            const userId: string = req.params.id;

            const findUser = await this.userService.findUserById(userId);
            console.log('findUser', findUser);
            let profilePicturePath = '';
            if (!findUser.profilePicture || findUser.profilePicture === '') {
                profilePicturePath = path.join(
                    __dirname,
                    `../../uploads/default-profile-picture.jpg`
                );
            } else {
                profilePicturePath = path.join(
                    __dirname,
                    '../../uploads/',
                    findUser.profilePicture
                );
            }

            console.log('profilePicturePath', profilePicturePath);
            res.sendFile(profilePicturePath);
        } catch (error) {
            console.log(error);
        }
    };

    getFriendRequests = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        console.log('getFriendRequests');
    };

    getFriends = async (req: Request, res: Response, next: NextFunction) => {
        console.log('getFriends');
    };

    public createUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log('createUser', req.body);
            const userData: CreateUserDto = req.body;
            const createUserData: User = await this.userService.createUser(
                userData
            );

            res.status(201).json(createUserData);
        } catch (error) {
            next(error);
        }
    };

    public updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId: string = req.params.id;
            const userData: CreateUserDto = req.body;
            const updateUserData: User = await this.userService.updateUser(
                userId,
                userData
            );

            res.status(200).json({ data: updateUserData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId: string = req.params.id;
            const deleteUserData: User = await this.userService.deleteUser(
                userId
            );

            res.status(200).json({ data: deleteUserData, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}

export default UsersController;
