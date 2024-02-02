import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

import { CreateFriendDto } from '@dtos/friends.dto';
import friendModel from '@/models/friends.model';
import { Types } from 'mongoose';

class FriendsService {
    public friends = friendModel;

    public async getFriendsByUserId(userId: string): Promise<any> {
        if (isEmpty(userId)) throw new HttpException(400, 'No userId provided');

        const findFriends = await this.friends
            .find({ user: new Types.ObjectId(userId) })
            .populate('friend');

        return findFriends;
    }

    public async addFriend(friendData: CreateFriendDto): Promise<any> {
        if (isEmpty(friendData))
            throw new HttpException(400, 'No friendData provided');

        const createFriendData = await this.friends.create({ ...friendData });
        // create friendData for the other user
        await this.friends.create({
            user: friendData.friend,
            friend: friendData.user,
        });

        return createFriendData;
    }

    public async removeFriend(friendId: string): Promise<any> {
        console.log('removeFriend');
        if (isEmpty(friendId))
            throw new HttpException(400, "You're not friendId");

        const deleteFriendData = await this.friends.findByIdAndDelete(friendId);

        return deleteFriendData;
    }
}

export default FriendsService;
