import { CreateServerDto } from '../dtos/servers.dto';
import { Server } from '../interfaces/server.interface';

import serverModel from '../models/servers.model';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { User } from '@interfaces/users.interface';
import UserService from './users.service';

class Serverservice {
    public servers = serverModel;
    public userService = UserService;

    public async findAllServer(): Promise<Server[]> {
        const servers: Server[] = await this.servers.find();
        return servers;
    }

    public async findServerById(serverId: string): Promise<Server> {
        const findServer: Server = await this.servers.findOne({
            where: { id: serverId },
        });
        if (!findServer) throw new HttpException(409, "Server doesn't exist");

        return findServer;
    }

    public async createServer(serverData: CreateServerDto): Promise<Server> {
        if (isEmpty(serverData))
            throw new HttpException(400, "You're not serverData");

        serverData.inviteCode = this.generateInviteCode();
        serverData.image = null;
        console.log('serverData', serverData);

        const createServerData: Server = await this.servers.create({
            ...serverData,
        });

        return createServerData;
    }

    private generateInviteCode(): string {
        const length = 6;
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    public async updateServer(
        serverId: string,
        serverData: CreateServerDto
    ): Promise<Server> {
        if (isEmpty(serverData))
            throw new HttpException(400, "You're not serverData");

        if (serverData.name) {
            const findServer: Server = await this.servers.findOne({
                where: { name: serverData.name },
            });
            if (findServer && findServer.id != serverId)
                throw new HttpException(
                    409,
                    `This name ${serverData.name} already exists`
                );
        }

        await this.servers.update(serverData, { where: { id: serverId } });

        const updateServer: Server = await this.servers.findOne({
            where: { id: serverId },
        });

        return updateServer;
    }

    public async deleteServer(serverId: string): Promise<Server> {
        const findServer: Server = await this.servers.findOne({
            where: { id: serverId },
        });
        if (!findServer) throw new HttpException(409, "Server doesn't exist");

        await this.servers.deleteOne({ _id: serverId });

        return findServer;
    }
}

export default Serverservice;
