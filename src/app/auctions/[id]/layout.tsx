import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuctionDetailsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section data-theme="cupcake">
            <ToastContainer />
            {children}
        </section>
    );
}
