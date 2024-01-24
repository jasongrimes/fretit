import Footer from "@/components/Footer";
import { Outlet } from "@tanstack/react-router";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
