import { NextFunction, Request, Response } from 'express';
import { Friend } from '@/interfaces/friends.interface';
import friendService from '@/services/friends.service';
import userService from '@/services/users.service';

class FriendsController {
    public friendService = new friendService();
    public userService = new userService();

    public getFriends = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId: string = req.user.id;
            const findAllFriendsData: Friend[] =
                await this.friendService.getFriendsByUserId(userId);
            console.log('findAllFriendsData: ', findAllFriendsData);
            res.status(200).json(findAllFriendsData);
        } catch (error) {
            next(error);
        }
    };

    public removeFriend = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const friendId: string = req.params.id;
            const deleteFriendData: Friend =
                await this.friendService.removeFriend(friendId);

            res.status(200).json({
                data: deleteFriendData,
                message: 'deleted',
            });
        } catch (error) {
            next(error);
        }
    };
}

export default FriendsController;
