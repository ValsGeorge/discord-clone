import { CreateDmListDto } from '@/dtos/dmList.dto';
import { DmList } from '@/interfaces/dmList.interface';

import dmListModel from '@/models/dmList.model';
import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';
import UserService from './users.service';
import { Types } from 'mongoose';

class DMListService {
    public dmLists = dmListModel;
    public userService = UserService;

    public async findAllDMListByMe(me: string): Promise<DmList[]> {
        console.log('findAllDMListByMe:', me);
        const findDMList: DmList[] = await this.dmLists
            .find({
                me: new Types.ObjectId(me),
            })
            .populate('user');
        console.log('findDMList:', findDMList);

        if (!findDMList) throw new HttpException(409, "DMList doesn't exist");

        return findDMList;
    }

    public async createDMList(dmListData: CreateDmListDto): Promise<DmList> {
        if (isEmpty(dmListData))
            throw new HttpException(400, "You're not dmListData");
        console.log('dmListData:', dmListData);

        const me = await new this.userService().findUserById(dmListData.me);
        console.log('me:', me);
        const user = await new this.userService().findUserById(dmListData.user);
        console.log('user:', user);
        const createDMListData: DmList = await this.dmLists.create({
            me: me,
            user: user,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('createDMListData:', createDMListData);

        return createDMListData;
    }

    public async updateDMList(
        dmListId: string,
        dmListData: CreateDmListDto
    ): Promise<DmList> {
        if (isEmpty(dmListData))
            throw new HttpException(400, "You're not dmListData");

        const findDMList: DmList = await this.dmLists.findOne({
            _id: dmListId,
        });
        if (!findDMList) throw new HttpException(409, "DMList doesn't exist");

        const updateDMListData: DmList = await this.dmLists.findByIdAndUpdate(
            dmListId,
            { dmListData }
        );
        return updateDMListData;
    }

    public async deleteDMList(dmListId: string): Promise<DmList> {
        const deleteDMListData: DmList = await this.dmLists.findByIdAndDelete(
            dmListId
        );
        if (!deleteDMListData)
            throw new HttpException(409, "DMList doesn't exist");

        return deleteDMListData;
    }
}

export default DMListService;
