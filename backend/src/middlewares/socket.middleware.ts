import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken } from '@interfaces/auth.interface';
import userModel from '@models/users.model';

const authMiddlewareSocket = async (token: string, socket: any, next: any) => {
    try {
        if (token) {
            const secretKey: string = SECRET_KEY;
            const verificationResponse = (await verify(
                token,
                secretKey
            )) as DataStoredInToken;
            const userId = verificationResponse._id;
            const findUser = await userModel.findById(userId);

            if (findUser) {
                socket.decoded = findUser;
                next();
            } else {
                next(new HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication token'));
    }
};

export default authMiddlewareSocket;
