import "@/app/_styles/globals.css";
import { Nunito_Sans } from "next/font/google";
import Header from "./_components/Header";
import { ReservationProvider } from "@/app/_components/ReservationContext";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s The Motel Elfa",
    default: "The Motel Elfa",
  },
  description: "Nice Hotel & Good Hospitality",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`${nunito.className} bg-primary-950 text-gray-50 min-h-screen  flex flex-col`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full ">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
