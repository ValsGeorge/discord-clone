import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class SocketioService {
    socket: Socket | undefined;

    constructor() {}

    setupSocketConnection() {
        console.log('Setting up socket connection');
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('Connected to socket.io server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket.io server');
        });

        this.socket.on('receiveMessage', (message: any) => {
            console.log('Received message:', message);
        });
    }

    sendMessage(message: any) {
        this.socket?.emit('sendMessage', message);
    }
}
