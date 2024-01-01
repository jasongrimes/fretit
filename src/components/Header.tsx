import { IconMusicHeart } from "@tabler/icons-react";

export default function Header() {
  return (
    <div className="sticky top-0 h-16 w-full shadow-md text-base-content backdrop-blur">
      <nav className="navbar w-full">
          <a
            href="/"
            aria-label="Fret It"
            className="flex-0 btn btn-ghost gap-2 px-2 md:gap-3"
          >
            <IconMusicHeart className="text-yellow-400 h-5 md:h-6" />
            <span className="font-title [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] text-lg bg-gradient-to-r from-yellow-100 to-yellow-500  md:text-2xl">
              Fret It
            </span>
          </a>
      </nav>
    </div>
  );
}
