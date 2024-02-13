import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
    public authService = new AuthService();

    public checkLogin = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userData: User = req.user;
            const checkLoginUserData: User = await this.authService.checkLogin(
                userData
            );
            res.status(200).json(checkLoginUserData);
        } catch (error) {
            next(error);
        }
    };

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body;
            const signUpUserData: User = await this.authService.signup(
                userData
            );

            res.status(201).json({ data: signUpUserData, message: 'signup' });
        } catch (error) {
            next(error);
        }
    };

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body;
            console.log('userData: ', userData);
            const { cookie, findUser } = await this.authService.login(userData);
            console.log('cookie: ', cookie);
            console.log('findUser: ', findUser);
            res.setHeader('Set-Cookie', [cookie]);
            res.status(200).json(findUser);
        } catch (error) {
            next(error);
        }
    };

    public logOut = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userData: User = req.user;
            const logOutUserData: User = await this.authService.logout(
                userData
            );

            res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
            res.status(200).json({ data: logOutUserData, message: 'logout' });
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
