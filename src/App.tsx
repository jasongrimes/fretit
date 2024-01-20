import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PositionPlayer from "@/components/PositionPlayer/PositionPlayer";

function App() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className=" max-w-[100vw] pb-24">
        <PositionPlayer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
