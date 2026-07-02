import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivalay Travels — Instant Ticket Bookings & Sacred Temple Yatras",
  description: "Book flights, trains, intercity buses, and cruises instantly with Shivalay Travels. We specialize in custom pilgrimage tours to Kedarnath, Chardham, Varanasi, Kashmir, and Goa.",
  keywords: "Shivalay Travels, flight ticket booking, train ticket booking, intercity bus booking, Kedarnath yatra package, Chardham pilgrimage, Varanasi tour, travel agency Indore",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
