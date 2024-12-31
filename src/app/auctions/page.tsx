"use client";
import { ActiveAuction } from "@/schema";
import AxiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

export default function ActiveAuctions() {
    const [auctions, setAuctions] = useState<Array<ActiveAuction>>([]);

    useEffect(() => {
        AxiosInstance.get("/auctions?status=ACTIVE&eager=true")
            .then((res) => res.data)
            .then((res) => {
                if (!res.error) setAuctions(res.data);
            });
    }, []);

    return (
        <div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 p-10">
                    {auctions.length > 0 &&
                        auctions.map((auction) => (
                            <a
                                key={auction.auction_id}
                                href={`/auctions/${auction.auction_id.toString()}`}
                                className="group"
                            >
                                <img
                                    alt={"image-default-alt"}
                                    src={auction.Product.image_url}
                                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                                />
                                <h3 className="mt-4 text-sm text-white-700">{auction.name}</h3>
                                <p className="mt-1 text-lg font-medium text-white-900">
                                    Bid started at: ${auction.starting_price}
                                </p>
                            </a>
                        ))}
                </div>
            </div>
        </div>
    );
}
