import AuctionDetails from "./AuctionDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <AuctionDetails auctionId={id} />;
}
