export type User = {
    user_id: string;
    username: string,
    firstname: string,
    lastname: string,
    email: string
};

export type Product = {
    product_id: number,
    name: string,
    description: string,
    image_url: string
};


export type Auction = {
    auction_id: number,
    name: string,
    description: string,
    status: string,
    created_at: string,
    start_time: string,
    end_time: string,
    product_id: number,
    starting_price: number
};


export type Bid = {
    bid_id: number,
    auction_id: number,
    user_id: number,
    placed_at: Date,
    price: number
};

export type ActiveAuction = Auction & {
    Product: Product
};