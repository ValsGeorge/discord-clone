import { NextFunction, Request, Response } from 'express';
import { FriendRequest } from '@/interfaces/friendRequests.interface';
import friendRequestsService from '@/services/friendRequests.service';

class FriendRequestController {
    public friendRequestsService = new friendRequestsService();

    public getFriendRequests = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId: string = req.user.id;
            const findAllFriendRequestsData: FriendRequest[] =
                await this.friendRequestsService.getFriendRequestsByMyId(
                    userId
                );

            console.log(
                'findAllFriendRequestsData: ',
                findAllFriendRequestsData
            );

            res.status(200).json(findAllFriendRequestsData);
        } catch (error) {
            next(error);
        }
    };

    public respondFriendRequest = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const friendRequestId: string = req.body.friendRequestId;
            const status: 'accept' = req.body.status;
            let respondFriendRequestData: FriendRequest;
            if (status === 'accept') {
                respondFriendRequestData =
                    await this.friendRequestsService.acceptFriendRequest(
                        friendRequestId,
                        status
                    );

                console.log(
                    'respondFriendRequestData: ',
                    respondFriendRequestData
                );

                res.status(200).json({
                    message: 'Friend request accepted',
                });
            } else if (status === 'decline') {
                respondFriendRequestData =
                    await this.friendRequestsService.removeFriendRequest(
                        friendRequestId
                    );
                res.status(200).json({ message: 'Friend request declined' });
            } else {
                throw new Error('Invalid status');
            }
        } catch (error) {
            next(error);
        }
    };

    public removeFriendRequest = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const friendRequestId: string = req.params.id;
            const deleteFriendRequestData: FriendRequest =
                await this.friendRequestsService.removeFriendRequest(
                    friendRequestId
                );

            res.status(200).json({
                data: deleteFriendRequestData,
                message: 'deleted',
            });
        } catch (error) {
            next(error);
        }
    };
}

export default FriendRequestController;
