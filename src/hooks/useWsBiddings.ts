import { Bid } from '@/schema';
import { Action, PlaceBidRequest, ViewAuctionBidsRequest, WsAction, WsEventError, WsResponse } from '@/schema/ws';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';


/**
 * TODO (latest): 
 *      - current: WebSocket get all bid history
 *      - modify: REST GET bids history, WebSocket to update newest bids
 * 
 * TODO (2):
 *      - get highest bid price so far in cache
 * 
 * TODO: Fetch new bids after a timestamp
 */
const useWsFetchBids = (url: string) => {
    const [bids, setBids] = useState<Array<Bid>>([]);
    const [newestBid, setNewestBid] = useState<Bid>();
    const [wsError, setWsError] = useState<string>("");
    const [ws, setWs] = useState<Socket | null>(null);
    const wsRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);


    useEffect(() => {
        if (!wsRef.current || !wsRef.current.connected) {
            const socket: Socket = io(url);
            wsRef.current = socket;
            setWs(socket);

            socket.on('connect', () => {
                console.log('Connected to socket server');
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });


            /**
             * Event Listener
             */
            socket.on(Action.VIEW_AUCTION_BIDS, (event: WsResponse<Bid[]>) => {
                console.log("view_auction_bids", event);
                if (event.success === true) {
                    setBids(event.data);
                }
            })

            socket.on(Action.PLACE_BID, (event: WsResponse<Bid>) => {
                console.log("place_bid", event);
                if (event.success === true) {
                    setNewestBid(event.data)
                }
            })

            // Handle Websocket event error
            socket.on(Action.SERVER_COMMON, (event: WsResponse<WsEventError>) => {
                if (!event.success)
                    setWsError(event.data.message);
            });
        }

        return () => {
            if (wsRef.current && wsRef.current.connected && isConnected) {
                wsRef.current.disconnect();
                setIsConnected(false);
            }
        }
    }, [url]);


    /**
     * TODO: optimize code
     */
    const viewAuctionBids = (auction_id: number | string) => {
        if (ws && isConnected) {
            const payload: WsAction<ViewAuctionBidsRequest> = {
                "action": Action.VIEW_AUCTION_BIDS,
                "body": {
                    "auction_id": auction_id.toString()
                }
            };
            ws.emit('auction', payload);
        }
    };

    const placeBid = (auction_id: number | string, user_id: number | string, price: number) => {
        if (ws && isConnected) {
            const payload: WsAction<PlaceBidRequest> = {
                "action": Action.PLACE_BID,
                "body": {
                    "auction_id": auction_id.toString(),
                    "user_id": user_id.toString(),
                    "price": price
                }
            };
            ws.emit('auction', payload);
        }
    }

    return {
        ws, isConnected,
        bids, newestBid,
        wsError, setWsError,
        viewAuctionBids, placeBid
    };
};

export default useWsFetchBids;