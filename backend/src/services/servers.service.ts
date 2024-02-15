import { CreateServerDto } from '../dtos/servers.dto';
import { Server } from '../interfaces/servers.interface';

import serverModel from '../models/servers.model';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { User } from '@interfaces/users.interface';
import UserService from './users.service';
import userServerModel from '@/models/userServer.model';
import { CreateUserServerDto } from '@/dtos/userserver.dto';
import { UserServer } from '@/interfaces/userServer.interface';
import { Types } from 'mongoose';

class Serverservice {
    public servers = serverModel;
    public userService = UserService;
    public userServer = userServerModel;

    public async findAllServer(): Promise<Server[]> {
        const servers: Server[] = await this.servers.find();
        return servers;
    }

    public async findAllServerByUserId(userId: string): Promise<Server[]> {
        try {
            const findUserServer: UserServer[] = await this.userServer
                .find({
                    user: new Types.ObjectId(userId),
                })
                .populate('server');

            const servers: Server[] = findUserServer.map((userServer) => {
                return userServer.server;
            });

            return servers;
        } catch (error) {
            console.error('Error finding servers:', error);
            throw error;
        }
    }

    public async findServerById(serverId: string): Promise<Server> {
        const findServer: Server = await this.servers.findOne({
            _id: serverId,
        });
        if (!findServer) throw new HttpException(409, "Server doesn't exist");

        return findServer;
    }

    public async findServerMembers(serverId: string): Promise<User[]> {
        const findServer: Server = await this.servers.findOne({
            _id: serverId,
        });
        if (!findServer) throw new HttpException(409, "Server doesn't exist");

        const findUserServer: UserServer[] = await this.userServer
            .find({
                server: findServer,
            })
            .populate('user');

        const members: User[] = findUserServer.map((userServer) => {
            return userServer.user;
        });

        return members;
    }

    public async createServer(serverData: CreateServerDto): Promise<Server> {
        if (isEmpty(serverData))
            throw new HttpException(400, "You're not serverData");

        serverData.inviteCode = this.generateInviteCode();
        serverData.image = null;

        const createServerData: Server = await this.servers.create({
            ...serverData,
        });

        return createServerData;
    }

    public async generateServerInviteCode(serverId: string): Promise<string> {
        const findServer: Server = await this.servers.findOne({
            _id: serverId,
        });
        if (!findServer) throw new HttpException(409, "Server doesn't exist");

        const inviteCode = this.generateInviteCode();
        await this.servers.update({ inviteCode }, { where: { id: serverId } });

        return inviteCode;
    }

    public generateInviteCode(): string {
        const length = 10;
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    public async joinServer(
        inviteCode: string,
        userId: string
    ): Promise<UserServer> {
        const findServer: Server = await this.servers.findOne({
            inviteCode,
        });
        if (!findServer) throw new HttpException(409, "Server doesn't exist");

        const findUser = await new this.userService().findUserById(userId);
        if (!findUser) throw new HttpException(409, "User doesn't exist");

        const findUserServer = await this.userServer.findOne({
            server: findServer,
            user: findUser,
        });
        if (findUserServer)
            throw new HttpException(409, 'User is already in server');

        const createUserServerData: CreateUserServerDto = {
            user: findUser,
            server: findServer,
            role: 'member',
        };

        const createUserServer = await this.userServer.create({
            ...createUserServerData,
            createAt: new Date(),
            updateAt: new Date(),
        });

        return createUserServer;
    }

    public async updateServer(
        serverId: string,
        serverData: CreateServerDto
    ): Promise<Server> {
        if (isEmpty(serverData))
            throw new HttpException(400, "You're not serverData");

        if (serverData.name) {
            const findServer: Server = await this.servers.findOne({
                name: serverData.name,
            });
            if (findServer && findServer.id != serverId)
                throw new HttpException(
                    409,
                    `This name ${serverData.name} already exists`
                );
        }

        await this.servers.update(serverData, { where: { id: serverId } });

        const updateServer: Server = await this.servers.findOne({
            id: serverId,
        });

        return updateServer;
    }

    public async deleteServer(serverId: string): Promise<Server> {
        const findServer: Server = await this.servers.findOne({
            _id: serverId,
        });
        if (!findServer) throw new HttpException(409, "Server doesn't exist");

        await (findServer as any).remove();

        return findServer;
    }
}

export default Serverservice;
