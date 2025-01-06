import useWsFetchBids from "@/hooks/useWsBiddings";
import { useAuthStore } from "@/store/useAuthStore";
import {
    ChangeEventHandler,
    FormEventHandler,
    useEffect,
    useState,
} from "react";
import { toast } from "react-toastify";

interface UserPlaceBidProps {
    auction_id: string | number;
}

function UserPlaceBid({ auction_id }: UserPlaceBidProps) {
    const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT || "ws://localhost:8080";
    const { placeBid, isConnected, wsError, setWsError } = useWsFetchBids(wsEndpoint);
    const { user } = useAuthStore();
    const [price, setPrice] = useState<number>(0.0);

    const handleUserPlaceBid: FormEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (isConnected) {
            placeBid(auction_id, event.currentTarget.id, price);
            setPrice(0.0);
        }
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        setPrice(parseFloat(event.target.value));
    };

    useEffect(() => {
        if (wsError !== "" && user) {
            toast.error(wsError);
            setWsError("");
        }
    }, [wsError]);

    return (
        user ?
            <div className="mt-4">
                <div>Submit bid as user: {user.username}</div>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Type your bidding price"
                        className="input input-bordered w-full max-w-xs"
                        value={price}
                        onChange={handleChange}
                    />
                    <button
                        className="btn btn-active btn-accent"
                        onClick={handleUserPlaceBid}
                        id={user.user_id.toString()}
                    >
                        Place bid
                    </button>
                </div>
            </div>
            : <div>No user</div>
    );
}

export default UserPlaceBid;
