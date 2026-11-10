import { Geist } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "RumaMap — Temukan Hunian Impian Anda",
  description:
    "Temukan rumah yang tepat dengan pencarian properti dan informasi lokasi yang lebih mudah bersama RumaMap.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
