import { Link } from "@tanstack/react-router";
import Header from "./Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="hero min-h-screen bg-base-200 pb-32">
        <div className="hero-content text-left text-lg">
          <div className="max-w-md">
            <h1 className="text-center text-5xl font-bold">
              Fretboard{" "}
              <span className=" bg-gradient-to-r from-yellow-100 to-yellow-500 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                Fun
              </span>
              damentals
            </h1>
            <p className="py-6">
              <span className=" bg-gradient-to-r from-yellow-100 to-yellow-500 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                Fret It
              </span>{" "}
              is a collection of web-based tools for learning to play guitar.
            </p>
            <p className="pb-6">
              It uses interactive, playable, editable fretboard diagrams to
              leverage multimodal memory techniques for acquiring skills faster
              and retaining them longer.
            </p>
            <p className="pb-6">Also, it&apos;s pretty fun.</p>
            <div className="text-center">
              <Link className="btn btn-primary text-xl" to="/positions">
                Try it now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
