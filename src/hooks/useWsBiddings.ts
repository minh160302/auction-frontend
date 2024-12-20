import { Bid } from '@/schema';
import { useEffect, useRef, useState } from 'react';


/**
 * TODO: Fetch new bids after a timestamp
 */
const useWsFetchBids = (url: string) => {
    const [bids, setBids] = useState<Array<Bid>>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [ws, setWs] = useState<WebSocket | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);


    useEffect(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            const socket = new WebSocket(url);
            wsRef.current = socket;
            setWs(socket);

            socket.onopen = (e) => {
                console.log("WS connected", e);
                setIsConnected(true);
            }

            socket.onmessage = (event) => {
                // setBids((prevMessages) => [...prevMessages, event.data]);
                const { error, message, data } = JSON.parse(event.data);
                if (!error) {
                    setBids(data);
                    setErrorMessage("");
                }
                else {
                    setErrorMessage(message);
                }
            };
        }

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isConnected) {
                wsRef.current.close();
                setIsConnected(false);
            }
        }
    }, [url]);


    /**
     * TODO: optimize code
     */
    const sendMessage = (auction_id: number | string) => {
        if (ws && isConnected) {
            const response = { "action": "sendmessage", "data": { "type": "view_action_bids", "body": { auction_id } } }
            ws.send(JSON.stringify(response));
        }
    };

    const placeBid = (auction_id: number | string, user_id: number | string, price: number) => {
        if (ws && isConnected) {
            const response = { "action": "sendmessage", "data": { "type": "place_bid", "body": { auction_id, user_id, price } } }
            ws.send(JSON.stringify(response));
        }
    }

    return {
        bids, isConnected, errorMessage,
        sendMessage, placeBid
    };
};

export default useWsFetchBids;