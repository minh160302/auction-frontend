import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section data-theme="lofi">
      <ToastContainer />
      {children}
    </section>
  );
}
