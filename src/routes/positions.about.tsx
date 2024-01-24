import AboutDialog from "@/components/PositionPlayer/AboutDialog";
import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/positions/about").createRoute({
  component: AboutDialog,
});
