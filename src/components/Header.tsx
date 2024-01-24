import { IconMusicHeart } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  children?: React.ReactNode;
}
export default function Header({ children = null }: HeaderProps) {
  return (
    <div className="sticky top-0 z-20 h-14 w-full bg-base-100/90 text-base-content shadow-md backdrop-blur">
      <nav className="navbar w-full">
        <div className="navbar-start"></div>
        <div className="navbar-center flex gap-1">
          <Link to="/"
            aria-label="Fret It"
            className="flex-0 btn btn-ghost gap-2 px-2 md:gap-3"
          >
            <IconMusicHeart size="30" className="h-6 text-yellow-400 md:h-10" />
            <span className=" bg-gradient-to-r from-yellow-100 to-yellow-500 text-2xl [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]  md:text-3xl">
              Fret It
            </span>
          </Link>
          {children}
          
        </div>
        <div className="navbar-end"></div>
      </nav>
    </div>
  );
}
