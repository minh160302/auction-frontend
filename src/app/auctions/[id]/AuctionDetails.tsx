"use client";
import AuctionTimeline from "@/components/AuctionTimeline";
import UserPlaceBid from "@/components/UserPlaceBid";
import { Auction } from "@/schema";
import AxiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

interface AuctionDetailsProps {
  auctionId: string;
}

export default function AuctionDetails({ auctionId }: AuctionDetailsProps) {
  const [auction, setAuction] = useState<Auction>();

  useEffect(() => {
    AxiosInstance.get(`/auctions/search/${auctionId}`)
      .then((res) => res.data)
      .then((res) => {
        if (!res.error && res.data.length > 0) setAuction(res.data[0]);
      });
  }, [auctionId]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {auction ? <AuctionTimeline auction={auction} /> : <div>No content</div>}

      <UserPlaceBid auction_id={auctionId} />
    </div>
  );
}
