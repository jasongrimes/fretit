import { IconMusicHeart } from "@tabler/icons-react";

export default function Header() {
  return (
    <div className="sticky top-0 z-20 h-16 w-full bg-base-100/90 text-base-content shadow-md backdrop-blur">
      <nav className="navbar w-full">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <a
            href="/"
            aria-label="Fret It"
            className="flex-0 btn btn-ghost gap-2 px-2 md:gap-3"
          >
            <IconMusicHeart size="30" className="h-6 text-yellow-400 md:h-10" />
            <span className="font-title bg-gradient-to-r from-yellow-100 to-yellow-500 text-2xl [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]  md:text-3xl">
              Fret It
            </span>
          </a>
        </div>
        <div className="navbar-end"></div>
      </nav>
    </div>
  );
}
