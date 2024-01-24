import PositionPlayer from "@/components/PositionPlayer";
import { FileRoute } from "@tanstack/react-router";

// interface PositionRouteParams {
//   scaleLabeling: LabelingStrategy;
// }

export const Route = new FileRoute("/positions").createRoute({
  component: PositionPlayer,
  // validateSearch: (search: Record<string, unknown>): PositionRouteParams => {
  //   return { scaleLabeling: (search.scaleLabeling as LabelingStrategy) || "none" };
  // },
});
