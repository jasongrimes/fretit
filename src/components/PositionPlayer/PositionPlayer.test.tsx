import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { createTestRouter } from "@/test/test-utils";
import { RouterProvider } from "@tanstack/react-router";
import PositionPlayer from "./PositionPlayer";

vi.mock("@/utils/sound-player", () => {
  const SoundPlayer =
    vi.fn() as unknown as typeof import("@/utils/sound-player").default;
  SoundPlayer.prototype.cleanup = vi.fn();
  SoundPlayer.prototype.play = vi.fn();
  return {
    default: SoundPlayer,
  };
});

const router = createTestRouter(PositionPlayer);

describe("When selecting chords", () => {
  test.each([
    // Format: [chordName, [stringNum, fretNum, label]]
    [
      "C",
      [
        [5, 3, "1"],
        [4, 2, "3"],
        [3, 0, "5"],
        [2, 1, "1"],
        [1, 0, "3"],
      ],
    ],
    [
      "Dm",
      [
        [4, 0, "2"],
        [3, 2, "6"],
        [2, 3, "2"],
        [1, 1, "4"],
      ],
    ],
  ])("%s has overlays %o", async (chordName, overlays) => {
    const user = userEvent.setup() as unknown as typeof userEvent;
    render(<RouterProvider router={router} />);
    await waitFor(() =>
      expect(screen.queryByText("Position Player")).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText(`Select ${chordName} chord`));
    overlays.forEach(([stringNum, fretNum, label]) => {
      expect(
        screen.getByLabelText(`String ${stringNum}, fret ${fretNum}`),
      ).toHaveTextContent(`${label}`);
    });
  });
});

describe("When setting chord labels for C chord", () => {
  test.each([
    ["Scale degrees (1..7)", "1 3 5 1 3"],
    ["Chord intervals (R..7)", "R 3 5 R 3"],
    ["Note names", "C E G C E"],
    ["Note names + octave", "C3 E3 G3 C4 E4"],
  ])("Selecting '%s' shows %s", async (labelStrategy, expected) => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    await waitFor(() =>
      expect(screen.queryByText("Position Player")).toBeInTheDocument(),
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Chord note labels",
        hidden: true,
      }),
      labelStrategy,
    );
    //await user.click(screen.getByLabelText(`Select C chord`));

    const labels = expected.split(" ");
    const locations = [
      [5, 3],
      [4, 2],
      [3, 0],
      [2, 1],
      [1, 0],
    ];
    locations.forEach(([stringNum, fretNum], index) => {
      expect(
        screen.getByLabelText(`String ${stringNum}, fret ${fretNum}`),
      ).toHaveTextContent(RegExp(`^${labels[index]}$`));
    });
  });
});
