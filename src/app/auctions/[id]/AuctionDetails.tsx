"use client";
import AuctionTimeline from "@/components/AuctionTimeline";
import Countdown from "@/components/Countdown";
import UserPlaceBid from "@/components/UserPlaceBid";
import { Auction } from "@/schema";
import { useAuthStore } from "@/store/useAuthStore";
import AxiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

interface AuctionDetailsProps {
  auctionId: string;
}

export default function AuctionDetails({ auctionId }: AuctionDetailsProps) {
  const [auction, setAuction] = useState<Auction>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    AxiosInstance.get(`/auctions/${auctionId}`)
      .then((res) => res.data)
      .then((res) => {
        if (!res.error && res.data) setAuction(res.data);
      });
  }, [auctionId]);

  useEffect(() => {
    if (user && auction) {
      AxiosInstance.get(`/bookmarks?user_id=${user.user_id}&auction_id=${auction.auction_id}`).then((res) => res.data)
        .then((res) => {
          if (!res.error) {
            if (res.data.length == 1)
              setIsBookmarked(true);
            else if (res.data.length > 1) {
              console.log("double bookmarks error", res);
            }
          }
        });
    }
  }, [user, auction])


  const handleBookmark = async () => {
    if (user && auction) {
      if (isBookmarked) {
        await AxiosInstance.delete(`/bookmarks?user_id=${user.user_id}&auction_id=${auction.auction_id}`)
      }
      else {
        await AxiosInstance.post(`/bookmarks`, {
          user_id: user.user_id,
          auction_id: auction.auction_id,
          bookmark_type: "LIVE"
        })
      }
      setIsBookmarked(!isBookmarked);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full p-10">
      {auction ? <AuctionTimeline auction={auction} /> : <div>No content</div>}
      <div>
        {auction && <Countdown endTime={new Date(auction.end_time)} />}
        <button className="btn mt-4" onClick={handleBookmark}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={isBookmarked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Keep me updated
        </button>
        <UserPlaceBid auction_id={auctionId} />
      </div>
    </div>
  );
}
