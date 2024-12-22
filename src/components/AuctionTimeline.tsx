"use client";

import useWsFetchBids from "@/hooks/useWsBiddings";
import { Auction, Bid } from "@/schema";
import { useEffect, useState } from "react";

interface AuctionTimelineProps {
  auction: Auction;
}

type BidHistory = {
  [auction_id: string]: Array<Bid>;
};

function AuctionTimeline({ auction }: AuctionTimelineProps) {
  const [bidHistory, setBidHistory] = useState<BidHistory>({});
  // const [highestBid, setHighestBid] = useState<number>(auction.starting_price);

  const auctionId = auction.auction_id;
  const wsEndpoint =
    process.env.NEXT_PUBLIC_WS_ENDPOINT || "ws://localhost:8080";
  const { bids, destinationId, sendMessage, isConnected } =
    useWsFetchBids(wsEndpoint);

  useEffect(() => {
    if (isConnected) {
      sendMessage(auctionId);
    }
  }, [isConnected]);

  useEffect(() => {
    setBidHistory({
      ...bidHistory,
      [destinationId]: bids,
    });
  }, [bids, destinationId]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-sm mx-auto">
      {/* Current Bid Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Auction: {auction.name}</h1>
        <p className="text-gray-500">Description: {auction.description}</p>
        <p className="text-gray-500">
          {bidHistory[auctionId] && bidHistory[auctionId].length > 0
            ? `Current bid $${300} (total of ${
                bidHistory[auctionId].length
              } bids)`
            : `No bids placed`}
        </p>
      </div>
      <ul className="timeline timeline-vertical flex">
        {/* Bid History */}
        {bidHistory[auctionId] &&
          bidHistory[auctionId].length > 0 &&
          bidHistory[auctionId].map((bid, index) => (
            <li
              key={bid.bid_id}
              className="grid grid-cols-[var(--timeline-col-start,_minmax(0,_1fr))_auto_var(--timeline-col-end,_minmax(0,_4fr))] "
            >
              {index !== 0 && <hr />}
              <div className="timeline-start font-bold">${bid.price}</div>
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="timeline-end timeline-box">
                User {bid.user_id} placed at{" "}
                {new Date(bid.placed_at).toDateString()}
              </div>
              <hr />
            </li>
          ))}

        <li
          key={auction.auction_id}
          className="grid grid-cols-[var(--timeline-col-start,_minmax(0,_1fr))_auto_var(--timeline-col-end,_minmax(0,_4fr))] "
        >
          <hr />
          <div className="timeline-start font-bold">
            ${auction.starting_price}
          </div>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end timeline-box font-bold">
            Auction opened at {new Date(auction.start_time).toDateString()}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default AuctionTimeline;
