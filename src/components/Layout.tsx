import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PositionPlayer from "@/components/PositionPlayer";
import { useState } from "react";

export default function Layout() {
  const [maximized, setMaximized] = useState(false);

  function handleToggleMaximized() {
    setMaximized(!maximized);
  }

  return (
    <div className="relative min-h-screen">
      {!maximized && <Header />}
      <main className=" max-w-[100vw] pb-24">
        <PositionPlayer maximized={maximized} onToggleMaximized={handleToggleMaximized} />
      </main>
      <Footer />
    </div>
  );
}
