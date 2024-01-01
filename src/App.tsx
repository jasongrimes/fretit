import Footer from "./components/Footer";
import FretboardEditor from "./components/FretboardEditor";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main className=" max-w-[100vw] pl-3 pb-16 ">
        <FretboardEditor />
      </main>
      <Footer />
    </div>
  );
}

export default App;
