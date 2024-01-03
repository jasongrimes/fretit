import Footer from "./components/Footer";
import FretboardEditor from "./components/FretboardEditor";
import Header from "./components/Header";

function App() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className=" max-w-[100vw] pb-24">
        <FretboardEditor />
      </main>
      <Footer />
    </div>
  );
}

export default App;
