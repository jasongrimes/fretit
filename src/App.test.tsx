import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import App from "./App";


vi.mock("@/utils/sound-player", () => {
  const SoundPlayer = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  SoundPlayer.prototype.cleanup = vi.fn();
  return {
    default: SoundPlayer
  };
});

describe("App", () => {
  it("Renders App component", () => {
    render(<App />);
    // screen.debug();
  });
});
