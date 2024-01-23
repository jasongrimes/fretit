import PositionPlayer from "@/components/PositionPlayer";
import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/positions").createRoute({
  component: PositionPlayer,
});
