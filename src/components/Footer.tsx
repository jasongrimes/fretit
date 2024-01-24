import { IconBrandGithub, IconHeart } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="footer footer-center shrink-0  bg-base-300 p-4 text-base-content">
      <aside>
        <p className="leading-loose">
        Made with <IconHeart className="inline h-5 w-5 text-red-500" /> by{" "}
            <a
              className="link"
              href="https://grimesit.com"
              target="_blank"
              rel="noreferrer"
            >
              Grimes IT
            </a>
            .{" "}
          <span className="whitespace-nowrap">© 2024</span>.
          <a href="https://github.com/jasongrimes/fretit" className="ml-2" target="_blank" rel="noreferrer">
          <IconBrandGithub className="inline h-5 w-5" />
            </a>
        </p>
      </aside>
    </footer>
  );
}
