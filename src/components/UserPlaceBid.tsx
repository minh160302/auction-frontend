import useWsFetchBids from "@/hooks/useWsBiddings";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

interface UserPlaceBidProps {
  auction_id: string | number;
}

function UserPlaceBid({ auction_id }: UserPlaceBidProps) {
  const wsEndpoint =
    process.env.NEXT_PUBLIC_WS_ENDPOINT || "ws://localhost:8080";
  const { placeBid, isConnected, errorMessage } = useWsFetchBids(wsEndpoint);
  const userIds = [1, 2, 3];
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

  return (
    <div>
      <div>UserPlaceBid</div>

      {errorMessage === "" || (
        <div className="toast">
          <div className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {userIds.map((userId) => (
          <button
            className="btn btn-active btn-accent"
            key={userId}
            onClick={handleUserPlaceBid}
            id={userId.toString()}
          >
            User {userId} bid
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="Type your bidding price"
        className="input input-bordered w-full max-w-xs"
        value={price}
        onChange={handleChange}
      />
    </div>
  );
}

export default UserPlaceBid;
