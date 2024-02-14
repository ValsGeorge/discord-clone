import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { Types } from 'mongoose';
import { CreateUserServerDto } from '@/dtos/userserver.dto';
import { UserServer } from '@/interfaces/userServer.interface';
import userServerModel from '@/models/userServer.model';

class UserService {
    public users = userModel;
    public userServer = userServerModel;

    public async findAllUser(): Promise<User[]> {
        const users: User[] = await this.users.find();
        return users;
    }

    public async findUserById(userId: string): Promise<User> {
        if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');
        const findUser: User = await this.users
            .findOne({
                _id: new Types.ObjectId(userId),
            })
            .select('-password');
        if (!findUser) throw new HttpException(409, "User doesn't exist");
        return findUser;
    }

    public async createUser(userData: CreateUserDto): Promise<User> {
        if (isEmpty(userData))
            throw new HttpException(400, 'userData is empty');

        const findUser: User = await this.users.findOne({
            email: userData.email,
        });
        if (findUser)
            throw new HttpException(
                409,
                `This email ${userData.email} already exists`
            );

        const hashedPassword = await hash(userData.password, 10);
        const createUserData: User = await this.users.create({
            ...userData,
            password: hashedPassword,
        });

        return createUserData;
    }

    public async createUserServer(
        userServerData: CreateUserServerDto
    ): Promise<UserServer> {
        if (isEmpty(userServerData))
            throw new HttpException(400, 'userServerData is empty');

        const createUserServerData: UserServer = await this.userServer.create({
            ...userServerData,
            createAt: new Date(),
            updateAt: new Date(),
        });
        return createUserServerData;
    }

    public async updateUser(
        userId: string,
        userData: CreateUserDto
    ): Promise<User> {
        if (isEmpty(userData))
            throw new HttpException(400, 'userData is empty');

        if (userData.email) {
            const findUser: User = await this.users.findOne({
                email: userData.email,
            });
            if (findUser && findUser.id != userId)
                throw new HttpException(
                    409,
                    `This email ${userData.email} already exists`
                );
        }

        if (userData.password) {
            const hashedPassword = await hash(userData.password, 10);
            userData = { ...userData, password: hashedPassword };
        }

        const updateUserById: User = await this.users.findOne({
            _id: userId,
        });
        if (!updateUserById) throw new HttpException(409, "User doesn't exist");

        await this.users.update(userData, { id: userId });

        return updateUserById;
    }

    public async deleteUser(userId: string): Promise<User> {
        const deleteUserById: User = await this.users.findOne({
            _id: userId,
        });
        if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

        await this.users.deleteOne({
            _id: userId,
        });
        return deleteUserById;
    }
}

export default UserService;
