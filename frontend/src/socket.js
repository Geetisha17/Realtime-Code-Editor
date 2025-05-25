import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    return io(`wss://hqm1d9ki95.execute-api.us-east-1.amazonaws.com/production/`, options); 
};
