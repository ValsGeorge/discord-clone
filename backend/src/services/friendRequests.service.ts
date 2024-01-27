import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';

import { CreateFriendRequestDto } from '@/dtos/friendRequests.dto';
import { FriendRequest } from '@/interfaces/friendRequests.interface';
import friendRequestModel from '@/models/friendRequests.model';
import { Types } from 'mongoose';
import friendModel from '@/models/friends.model';
import FriendsService from './friends.service';

class FriendRequestsService {
    public friendRequests = friendRequestModel;
    public friends = friendModel;

    public friendsService = new FriendsService();

    public async getFriendRequestsByUserId(
        userId: string
    ): Promise<FriendRequest[]> {
        if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

        const findFriendRequests: FriendRequest[] =
            await this.friendRequests.find({
                to: userId,
            });
        if (!findFriendRequests)
            throw new HttpException(409, "FriendRequests don't exist");

        return findFriendRequests;
    }

    public async getFriendRequestsByMyId(
        userId: string
    ): Promise<FriendRequest[]> {
        if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

        const findFriendRequests: FriendRequest[] = await this.friendRequests
            .find({
                to: userId,
            })
            .populate('from');

        if (!findFriendRequests)
            throw new HttpException(409, "FriendRequests don't exist");

        return findFriendRequests;
    }

    public async createFriendRequest(
        friendRequestData: CreateFriendRequestDto
    ): Promise<FriendRequest> {
        console.log('sendFriendRequest');
        if (isEmpty(friendRequestData))
            throw new HttpException(400, "You're not friendRequestData");

        const createFriendRequestData: FriendRequest =
            await this.friendRequests.create({
                ...friendRequestData,
            });
        console.log('createFriendRequestData: ', createFriendRequestData);

        return createFriendRequestData;
    }

    public async acceptFriendRequest(
        friendRequestId: string,
        status: 'accept'
    ): Promise<FriendRequest> {
        if (isEmpty(friendRequestId))
            throw new HttpException(400, 'No friendRequestId provided');
        if (isEmpty(status)) throw new HttpException(400, 'No status provided');

        // find the friend request
        const findFriendRequest: FriendRequest =
            await this.friendRequests.findById(friendRequestId);
        if (!findFriendRequest)
            throw new HttpException(409, "FriendRequest don't exist");

        // add the friend to the friends collection
        const friendData = {
            user: findFriendRequest.from,
            friend: findFriendRequest.to,
        };
        const createFriendData = await this.friendsService.addFriend(
            friendData
        );

        console.log('createFriendData: ', createFriendData);

        // delete the friend request
        const deleteFriendRequestById: FriendRequest =
            await this.friendRequests.findByIdAndDelete(friendRequestId);
        if (!deleteFriendRequestById)
            throw new HttpException(409, 'FriendRequest not found');

        return;
    }

    public async removeFriendRequest(
        friendRequestId: string
    ): Promise<FriendRequest> {
        if (isEmpty(friendRequestId))
            throw new HttpException(400, "You're not friendRequestId");

        const deleteFriendRequestById: FriendRequest =
            await this.friendRequests.findByIdAndDelete(friendRequestId);
        if (!deleteFriendRequestById)
            throw new HttpException(
                409,
                "You're not friendRequest. FriendRequest not found"
            );

        return deleteFriendRequestById;
    }
}

export default FriendRequestsService;
