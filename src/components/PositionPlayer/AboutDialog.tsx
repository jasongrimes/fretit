import { IconHeart } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

export default function AboutDialog() {
  const navigate = useNavigate({ from: "/positions/about" });

  function handleClose() {
    void navigate({ to: "/positions" });
  }

  return (
    <dialog
      id="about-modal"
      className="modal modal-open modal-bottom sm:modal-middle"
      open={true}
      autoFocus={true}
    >
      <div className="modal-box">
        <h2 className="text-2xl font-bold">About the Position Player</h2>

        <p className="py-4">
          This is a tool for exploring chord positions on guitar. It shows how
          all chords in a key can be found right next to each other, in five
          different positions on the neck.
        </p>

        <p className="my-2 bg-base-300 p-2">
          {/* <div className="divider text-sm mt-0 mb-1">Usage:</div> */}
          <span className="mb-1 block font-bold text-primary">
            Play the fretboard
          </span>
          Tap to pluck. Swipe to strum. Long-press to mute.{" "}
          <span className="whitespace-nowrap text-sm text-gray-500">
            (Turn off &quot;silent&quot; mode on mobile.)
          </span>
        </p>

        <p className="mb-2 mt-5 bg-base-300 p-2">
          <span className="mb-1 block font-bold text-secondary">
            Learn more
          </span>
          Learn{" "}
          <a
            // Hack alert:
            // I hate to add this focus:outline-none here,
            // but the HTML <dialog> behavior makes it autofocus on showModal() and the outline looks terrible,
            // and React has a bug that prevents setting autofocus somewhere else.
            // See https://github.com/facebook/react/issues/23301
            className="link link-accent focus:outline-none"
            href="https://fretboardfoundation.com/caged.html"
            target="_blank"
            rel="noreferrer"
          >
            practical CAGED chord grips
          </a>{" "}
          and basic{" "}
          <a
            className="link link-accent"
            href="https://fretboardfoundation.com/major-harmony.html"
            target="_blank"
            rel="noreferrer"
          >
            major key
          </a>{" "}
          and{" "}
          <a
            className="link link-accent"
            href="https://fretboardfoundation.com/minor-harmony.html"
            target="_blank"
            rel="noreferrer"
          >
            minor key
          </a>{" "}
          harmony in the free book <i>Fretboard Foundation</i>.
        </p>

        <p className="py-2">
          Questions or comments? I&apos;d love to hear from you. Email{" "}
          <a className="link link-accent" href="mailto:hello@fretit.com">
            jason@fretit.io
          </a>
          .
        </p>

        <div className="modal-action">
          <div className="grow pt-4 text-sm text-gray-500">
            Made with <IconHeart className="inline h-5 w-5 text-red-500" /> by{" "}
            <a
              className="link"
              href="https://grimesit.com"
              target="_blank"
              rel="noreferrer"
            >
              Grimes IT
            </a>
            .
          </div>
          <form method="dialog" onSubmit={handleClose}>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      {/* there a second form with 'modal-backdrop' class and it covers the screen so we can close the modal when clicked outside */}
      <form method="dialog" className="modal-backdrop" onSubmit={handleClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
