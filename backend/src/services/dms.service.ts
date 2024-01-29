import { CreateDmDto } from '@/dtos/dms.dto';
import { Dm } from '@/interfaces/dms.interface';

import dmModel from '@/models/dms.model';
import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';

import UserService from './users.service';
import { Types } from 'mongoose';

class DmService {
    public dms = dmModel;
    public userService = UserService;

    public async findAllDm(userId: string): Promise<Dm[]> {
        const dms: Dm[] = await this.dms.find({
            $or: [
                { sender: new Types.ObjectId(userId) },
                { receiver: new Types.ObjectId(userId) },
            ],
        });
        return dms;
    }

    public async findDmById(dmId: string): Promise<Dm> {
        const findDm: Dm = await this.dms.findOne({
            _id: dmId,
        });
        if (!findDm) throw new HttpException(409, "Dm doesn't exist");

        return findDm;
    }

    public async findDmBySenderAndReceiver(
        senderId: string,
        receiverId: string
    ): Promise<Dm[]> {
        const findDm: Dm[] = await this.dms.find({
            $or: [
                {
                    $and: [
                        { sender: new Types.ObjectId(senderId) },
                        { receiver: new Types.ObjectId(receiverId) },
                    ],
                },
                {
                    $and: [
                        { sender: new Types.ObjectId(receiverId) },
                        { receiver: new Types.ObjectId(senderId) },
                    ],
                },
            ],
        });
        // if (!findDm) throw new HttpException(409, "Dm doesn't exist");

        return findDm;
    }

    public async createDm(dmData: CreateDmDto): Promise<Dm> {
        if (isEmpty(dmData)) throw new HttpException(400, "You're not dmData");

        const receiver = await new this.userService().findUserById(
            dmData.receiver
        );
        const sender = await new this.userService().findUserById(dmData.sender);

        const createDmData: Dm = await this.dms.create({
            ...dmData,
            receiver,
            sender,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return createDmData;
    }

    public async updateDm(dmId: string, dmData: CreateDmDto): Promise<Dm> {
        if (isEmpty(dmData)) throw new HttpException(400, "You're not dmData");

        const findDm: Dm = await this.dms.findOne({ _id: dmId });
        if (!findDm) throw new HttpException(409, "Dm doesn't exist");

        const updateDmById: Dm = await this.dms.findByIdAndUpdate(
            dmId,
            { dmData },
            { new: true }
        );
        return updateDmById;
    }

    public async deleteDm(dmId: string): Promise<Dm> {
        const deleteDmById: Dm = await this.dms.findByIdAndDelete(dmId);
        if (!deleteDmById) throw new HttpException(409, "Dm doesn't exist");

        return deleteDmById;
    }
}

export default DmService;
