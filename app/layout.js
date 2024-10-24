import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionWrapper from "./components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Get me a chai-A website for fund your projects with chai",
  description: "This website is a crowdfunding platform for creators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white'>
        <SessionWrapper>
      <Navbar/>
      <div className="min-h-screen w-full bg-slate-950 before:content-[''] before:absolute before:bottom-0 before:left-[-20%] before:right-0 before:top-[-10%] before:h-[500px] before:w-[500px] before:rounded-full before:bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))] before:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:right-[-20%] after:top-[-10%] after:h-[500px] after:w-[500px] after:rounded-full after:bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))] after:pointer-events-none text-white">
    
      {children}
      </div>
      <Footer/>
      </SessionWrapper>
      </body>
    </html>
  );
}
