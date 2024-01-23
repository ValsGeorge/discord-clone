import MessageService from '@/services/messages.service';
// import createDM from './controllers/dms.controller';
// import sendFriendRequest from './controllers/friends.controller';
import { Socket, Server } from 'socket.io';
import authMiddlewareSocket from './middlewares/socket.middleware';

interface ISocket extends Socket {
    decoded?: any;
}

const onlineUsers: { [key: string]: any } = {};
const connectedUsers: { [key: string]: string } = {};

const initSocketIO = () => {
    console.log('Setting up socket.io server');
    const io = new Server(3000, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.use((socket: ISocket, next) => {
        // console.log('socket.handshake.query: ', socket.handshake.query);
        // console.log('socket.handshake.headers: ', socket.handshake.headers);
        // console.log('socket: ', socket);
        if (socket.handshake.query && socket.handshake.query.token) {
            const token: string = socket.handshake.query.token as string;
            console.log('token: ', token);
            authMiddlewareSocket(token, socket, next);
        } else {
            next(new Error('Authentication error'));
        }
    }).on('connection', (socket: ISocket) => {
        console.log('user connected', socket.id);
        const userId = (socket.decoded as any).id;
        console.log('userId: ', userId);

        onlineUsers[userId] = userId;
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

            // Broadcast the updated online user list to all clients
            io.emit('updateOnlineUsers', Object.values(onlineUsers));
        });

        socket.on('sendMessage', (message) => {
            message.userId = userId;
            console.log(message);
        });
        socket.on('editMessage', (message) => {
            console.log(message);
        });

        socket.on('sendDM', ({ dm, to }) => {
            console.log('dddm', dm);
            console.log('to', to);
            // createDM(dm)
            //     .then((fullDM) => {
            //         console.log('fullDM: ', fullDM);

            //         try {
            //             // Emit the DM to the sender
            //             io.to(socket.id).emit('privateMessage', fullDM);
            //             // Emit the DM to the receiver
            //             const receiverSocketId = connectedUsers[dm.receiverId];
            //             io.to(receiverSocketId).emit('privateMessage', fullDM);
            //         } catch (error) {
            //             console.error('Error sending DM:', error);
            //         }
            //     })
            //     .catch((error) => {
            //         console.log('Error creating DM:', error);
            //     });
        });

        socket.on('sendFriendRequest', (friendRequest) => {
            console.log(friendRequest);
            // sendFriendRequest(friendRequest)
            //     .then((sender) => {
            //         console.log('sender: ', sender);
            //         socket.broadcast.emit('receiveFriendRequest', sender);
            //     })
            //     .catch((error) => {
            //         console.error('Error sending friend request:', error);
            //     });
        });
    });
};

export default initSocketIO;
