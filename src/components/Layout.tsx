import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MaximizedContext } from "@/providers/maximized";
import { Outlet } from "@tanstack/react-router";
import { useState } from "react";

export default function Layout() {
  const [maximized, setMaximized] = useState(false);

  return (
    <div className="relative min-h-screen">
      {!maximized && <Header />}
      <main className=" max-w-[100vw] pb-24">
        <MaximizedContext.Provider value={{ maximized, setMaximized }}>
          <Outlet />
        </MaximizedContext.Provider>
      </main>
      <Footer />
    </div>
  );
}
