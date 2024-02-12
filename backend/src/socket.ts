import { Socket, Server } from 'socket.io';
import authMiddlewareSocket from './middlewares/socket.middleware';
import MessageService from './services/messages.service';
import { User } from './interfaces/users.interface';
import UserService from './services/users.service';
import UserServerService from './services/userServer.service';
import friendRequestService from './services/friendRequests.service';
import DmService from './services/dms.service';
import { FriendRequest } from './interfaces/friendRequests.interface';
import ChanelService from './services/channels.service';

interface ISocket extends Socket {
    decoded?: any;
}

const onlineUsers: { [key: string]: User } = {};
const connectedUsers: { [key: string]: string } = {};

// Each serverId will have a mapping to channelIds, and each channelId will have a set of user ids
// that are connected to that server and channel.
const serverChannelUsers: {
    [serverId: string]: { [channelId: string]: Set<string> };
} = {};

const initSocketIO = () => {
    console.log('Setting up socket.io server');
    const io = new Server(3000, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.use((socket: ISocket, next) => {
        if (socket.handshake.headers.cookie) {
            const token: string = socket.handshake.headers.cookie.split('=')[1];
            authMiddlewareSocket(token, socket, next);
        } else {
            next(new Error('Authentication error'));
        }
    }).on('connection', async (socket: ISocket) => {
        console.log('user connected', socket.id);
        const userId = (socket.decoded as any).id;
        const user = await new UserService().findUserById(userId);
        const servers = await new UserServerService().findUserServerByUser(
            userId
        );

        const serverIds = servers.map((server) => server.server.toString());

        const userWithServerIds: any = {
            id: user.id,
            nickname: user.nickname,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            serverIds,
        };

        for (const serverId of serverIds) {
            if (!serverChannelUsers[serverId]) {
                serverChannelUsers[serverId] = {};
            }
            // for each serverId search in the channels and get all the channelsIds
            const channels = await new ChanelService().findAllChannels(
                serverId
            );
            const channelIds = channels.map((channel) => channel.id);

            for (const channelId of channelIds) {
                if (!serverChannelUsers[serverId][channelId]) {
                    serverChannelUsers[serverId][channelId] = new Set();
                }
                serverChannelUsers[serverId][channelId].add(socket.id);
            }
        }

        onlineUsers[userId] = userWithServerIds;
        connectedUsers[userId] = socket.id;

        // Broadcast the updated online user list to all clients
        io.emit('updateOnlineUsers', Object.values(onlineUsers));

        try {
        } catch (error) {
            console.error('Error fetching user details:', error);
        }

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
            delete onlineUsers[userId];

            for (const serverId of serverIds) {
                delete serverChannelUsers[serverId][socket.id];
            }

            // Broadcast the updated online user list to all clients
            io.emit('updateOnlineUsers', Object.values(onlineUsers));
        });

        socket.on('sendMessage', async (message) => {
            message.userId = userId;
            try {
                message.user = userId as string;
                message.channel = message.channelId as string;
                const createMessageData =
                    await new MessageService().createMessage(message);
                const messageBack = {
                    id: createMessageData.id,
                    content: createMessageData.content,
                    user: message.userId,
                    channel: createMessageData.channel.id,
                    createdAt: createMessageData.createdAt,
                    updatedAt: createMessageData.updatedAt,
                };

                const usersToSend = new Set<string>();
                for (const serverId of serverIds) {
                    const channelUsers =
                        serverChannelUsers[serverId][message.channel];
                    if (channelUsers) {
                        channelUsers.forEach((userId) =>
                            usersToSend.add(userId)
                        );
                    }
                }

                // Emit the message only to the relevant users
                Array.from(usersToSend).forEach((userId) => {
                    if (userId) {
                        io.to(userId).emit('receiveMessage', messageBack);
                    }
                });
            } catch (error) {
                console.error('Error creating message:', error);
            }
        });
        socket.on('sendDM', async ({ dm, to }) => {
            const data = await new DmService().createDm({
                content: dm.content,
                sender: dm.senderId,
                receiver: dm.receiverId,
            });
            data.sender = onlineUsers[dm.senderId];
            data.receiver = onlineUsers[dm.receiverId];

            try {
                // Emit the DM to the sender
                io.to(socket.id).emit('privateMessage', data);
                // Emit the DM to the receiver
                const receiverSocketId = connectedUsers[dm.receiverId];
                io.to(receiverSocketId).emit('privateMessage', data);
            } catch (error) {
                console.error('Error sending DM:', error);
            }
        });

        socket.on('sendFriendRequest', async (friendRequest) => {
            const data = {
                from: userId,
                to: friendRequest.receiverId,
                status: 'pending',
            };
            const createFriendData =
                await new friendRequestService().createFriendRequest(data);

            // ? check if this res is returning the correct thing
            if (!createFriendData) {
                io.to(socket.id).emit(
                    'exception',
                    'Error creating friend request'
                );
                return;
            }
            const res: FriendRequest[] =
                await new friendRequestService().getFriendRequestsByMyId(
                    friendRequest.receiverId
                );
            try {
                // Emit the friend request to the receiver
                const receiverSocketId =
                    connectedUsers[friendRequest.receiverId];
                io.to(receiverSocketId).emit('receiveFriendRequest', res);
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        });
        socket.on('editDM', async (dm) => {
            const updatedDm = {
                id: dm.id,
                content: dm.content,
                sender: dm.sender,
                receiver: dm.receiver,
            };
            const updatedDmData = await new DmService().updateDm(
                dm.id,
                updatedDm
            );
            if (!updatedDmData) {
                io.to(socket.id).emit('exception', 'Error updating DM');
                return;
            }
            io.to(socket.id).emit('receiveMessage', updatedDmData);
            io.to(connectedUsers[dm.receiver]).emit(
                'receiveMessage',
                updatedDmData
            );
        });
        socket.on('editMessage', async (message) => {
            const updatedMessage = {
                id: message.id,
                content: message.content,
                user: message.user,
                channel: message.channel,
            };
            const updatedMessageData = await new MessageService().updateMessage(
                message.id,
                updatedMessage
            );
            if (!updatedMessageData) {
                io.to(socket.id).emit('exception', 'Error updating DM');
                return;
            }
            const usersToSend = new Set<string>();
            for (const serverId of serverIds) {
                const channelUsers =
                    serverChannelUsers[serverId][message.channel];
                if (channelUsers) {
                    channelUsers.forEach((userId) => usersToSend.add(userId));
                }
            }

            // Emit the message only to the relevant users
            Array.from(usersToSend).forEach((userId) => {
                if (userId) {
                    io.to(userId).emit('receiveMessage', updatedMessageData);
                }
            });
        });
        socket.on('deleteMessage', async (message) => {
            const deletedMessageData = await new MessageService().deleteMessage(
                message.id
            );
            if (!deletedMessageData) {
                io.to(socket.id).emit('exception', 'Error deleting message');
                return;
            }
            const usersToSend = new Set<string>();
            for (const serverId of serverIds) {
                const channelUsers =
                    serverChannelUsers[serverId][message.channel];
                if (channelUsers) {
                    channelUsers.forEach((userId) => usersToSend.add(userId));
                }
            }
            const data = {
                id: message.id,
                delete: 'message',
            };

            // Emit the message only to the relevant users
            Array.from(usersToSend).forEach((userId) => {
                if (userId) {
                    io.to(userId).emit('receiveMessage', data);
                }
            });
        });

        socket.on('deleteDm', async (message) => {
            const deletedMessageData = await new DmService().deleteDm(
                message.id
            );
            if (!deletedMessageData) {
                io.to(socket.id).emit('exception', 'Error deleting message');
                return;
            }
            const usersToSend = new Set<string>();
            for (const serverId of serverIds) {
                const channelUsers =
                    serverChannelUsers[serverId][message.channel];
                if (channelUsers) {
                    channelUsers.forEach((userId) => usersToSend.add(userId));
                }
            }
            const data = {
                id: message.id,
                delete: 'dm',
            };

            io.to(socket.id).emit('privateMessage', data);
            io.to(connectedUsers[message.receiver]).emit(
                'privateMessage',
                data
            );
        });
    });
};

export default initSocketIO;
