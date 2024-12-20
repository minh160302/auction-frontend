"use client";

import useWsFetchBids from "@/hooks/useWsBiddings";
import { Auction } from "@/schema";
import { useEffect } from "react";

interface AuctionTimelineProps {
  auction: Auction;
}

function AuctionTimeline({ auction }: AuctionTimelineProps) {
  const auctionId = auction.auction_id;
  const wsEndpoint =
    process.env.NEXT_PUBLIC_WS_ENDPOINT || "ws://localhost:8080";
  const { bids, sendMessage, isConnected } = useWsFetchBids(wsEndpoint);

  useEffect(() => {
    if (isConnected) {
      sendMessage(auctionId);
    }
  }, [isConnected]);

  return (
    <ul className="timeline timeline-vertical flex justify-between">
      {bids.length > 0 &&
        bids.map((bid) => (
          <li key={bid.bid_id}>
            <hr />
            <div className="timeline-start">${bid.price}</div>
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
      <li>
        <div className="timeline-start">
          Started at ${auction.starting_price}
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
        <div className="timeline-end timeline-box">
          Auction opened on {new Date(auction.start_time).toDateString()}
        </div>
        <hr />
      </li>
    </ul>
  );
}

export default AuctionTimeline;
