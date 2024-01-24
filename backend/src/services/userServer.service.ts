import { CreateUserServerDto } from '@/dtos/userserver.dto';
import { HttpException } from '@/exceptions/HttpException';
import { UserServer } from '@/interfaces/userServer.interface';
import { User } from '@/interfaces/users.interface';
import userServerModel from '@/models/userServer.model';
import { isEmpty } from '@/utils/util';
import { Types } from 'mongoose';
import userModel from './users.service';
import UserService from './users.service';

class UserServerService {
    public userServer = userServerModel;
    public user = userModel;
    public userService = new UserService();

    public async findAllUserServer(): Promise<UserServer[]> {
        const userServers: UserServer[] = await this.userServer.find();
        return userServers;
    }

    public async findUserServerByUser(userId: string): Promise<UserServer[]> {
        if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');
        const findUser: User = await this.userService.findUserById(userId);
        console.log('findUser: ', findUser);

        if (!findUser) throw new HttpException(409, "User doesn't exist");

        // find all the servers that the user is a member of
        const findUserServer: UserServer[] = await this.userServer.find({
            user: new Types.ObjectId(userId),
        });

        console.log('findUserServer: ', findUserServer);
        return findUserServer;
    }
}

export default UserServerService;
