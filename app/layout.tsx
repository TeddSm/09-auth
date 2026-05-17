import type { Metadata } from "next";
import "./globals.css";
import { TanStackProvider } from "../components/TanStackProvider/TanStackProvider";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Roboto } from "next/font/google"; 

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Personal notes management application",
  openGraph: {
    title: "NoteHub",
    description: "Personal notes management application",
    url: "/", 
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

const roboto = Roboto({
  weight: ["400", "500", "700"], 
  subsets: ["latin", "cyrillic"], 
  variable: "--font-roboto",      
  display: "swap",                
});

export default function RootLayout({
  children,
  modal, 
}: {
  children: React.ReactNode;
  modal: React.ReactNode; 
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <TanStackProvider>
          <div className="wrapper">
            <Header />
            <main>{children}</main>
            {modal} 
            <Footer />
          </div>
        </TanStackProvider>
      </body>
    </html>
  );
}