import Footer from "./components/Footer";
import FretboardPlayer from "./components/FretboardPlayer";
import Header from "./components/Header";

function App() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className=" max-w-[100vw] pb-24">
        <FretboardPlayer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
