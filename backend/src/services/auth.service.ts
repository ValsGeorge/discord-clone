import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { v4 as uuidv4 } from 'uuid';
import { COOKIE_DOMAIN } from '@config';

class AuthService {
    public users = userModel;

    public async checkLogin(userData: User): Promise<User> {
        if (isEmpty(userData))
            throw new HttpException(400, 'userData is empty');
        const findUser: User = await this.users
            .findOne({
                username: userData.username,
                password: userData.password,
            })
            .select('-password');
        if (!findUser)
            throw new HttpException(
                409,
                `This username ${userData.username} was not found`
            );

        return findUser;
    }

    public async signup(userData: CreateUserDto): Promise<User> {
        if (isEmpty(userData))
            throw new HttpException(400, 'userData is empty');
        const findUser: User = await this.users.findOne({
            username: userData.username,
        });
        if (findUser)
            throw new HttpException(
                409,
                `This username ${userData.username} already exists`
            );

        const hashedPassword = await hash(userData.password, 10);

        const generatedUUID = uuidv4();

        const createUserData: User = await this.users.create({
            ...userData,
            id: generatedUUID,
            password: hashedPassword,
        });

        return createUserData;
    }

    public async login(
        userData: LoginUserDto
    ): Promise<{ cookie: string; findUser: User }> {
        if (isEmpty(userData))
            throw new HttpException(400, 'userData is empty');
        const findUser: User = await this.users.findOne({
            username: userData.username,
        });
        if (!findUser)
            throw new HttpException(
                409,
                `This username ${userData.username} was not found`
            );

        const isPasswordMatching: boolean = await compare(
            userData.password,
            findUser.password
        );

        if (!isPasswordMatching)
            throw new HttpException(409, 'Password is not matching');

        const tokenData = this.createToken(findUser);
        const cookie = this.createCookie(tokenData);

        return { cookie, findUser };
    }

    public async logout(userData: User): Promise<User> {
        if (isEmpty(userData))
            throw new HttpException(400, 'userData is empty');

        const findUser: User = await this.users.findOne({
            username: userData.username,
            password: userData.password,
        });
        if (!findUser)
            throw new HttpException(
                409,
                `This username ${userData.username} was not found`
            );

        return findUser;
    }

    public createToken(user: User): TokenData {
        const dataStoredInToken: DataStoredInToken = { _id: user.id };
        const secretKey: string = SECRET_KEY;
        const expiresIn: number = 60 * 60 * 24 * 7; // 7 days

        return {
            expiresIn,
            token: sign(dataStoredInToken, secretKey, { expiresIn }),
        };
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn}; Domain=${COOKIE_DOMAIN}; Secure; SameSite=None;`;
    }
}

export default AuthService;
