import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
    public path = '/auth';
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/check-login`,
            authMiddleware,
            this.authController.checkLogin
        );
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(CreateUserDto, 'body'),
            this.authController.signUp
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(LoginUserDto, 'body'),
            this.authController.logIn
        );
        this.router.post(
            `${this.path}/logout`,
            authMiddleware,
            this.authController.logOut
        );
    }
}

export default AuthRoute;
