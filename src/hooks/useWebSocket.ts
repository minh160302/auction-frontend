import { useEffect, useState } from 'react';

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<Array<string>>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        setWs(socket);

        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (ws) {
            const tmp = { "action": "sendmessage", "data": { "type": "view_action_bids", "body": { "auction_id": 1 } } }
            console.log(message)
            ws.send(JSON.stringify(tmp));
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;