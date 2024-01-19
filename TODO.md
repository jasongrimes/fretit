# Soon

- [ ] Pull components into separate files?
  - PositionPlayerControls directory
  - Pull out a bunch of em
  - Fretboard directory
  - Pull out string stuff (not all of them)
  - index file to forward definitions

- [ ] Refactor chord calculator to be functional rather than OOP
  - No more constructor/new
  - Pass Key into each function
  

# Next

- [ ] Tweak Bdim open voicing https://github.com/jasongrimes/fretit/issues/1

- [ ] Make "maximize" hide the header too

- BUG: Scale numbering in (A,D,E,G) minor C position, (C,A,D,E) minor G position, should be adjusted down one fret

  - Maybe: Change the position numbers in each position to be the lowest fret for all chords in the position.
    Then have the scale span five frets up from there.
    That will make the position numbers more accurate too.

- [ ] When manually changing string stop, show original chord tone as transparent overlay

- [ ] SEO-friendly URLs/routing

  - /about (shows about dialog)
  - /{key}/{position}/{chord} ex. /c-major-key/II-position/I-chord-c-major
  - /position-player baseurl, redirect there from / for now.

  # Later

  - [ ] Save settings in localstorage
    - Include a "restore defaults" option in settings dialog

# Maybe?

- [-] Label minor CAGED positions as minor (ex. Cm shape instead of C shape)?
- [ ] Generate images for each key/position/chord, use in SEO-friendly structured data for google images, social sharing, etc.
- [ ] One-click way to switch to relative minor in keychange settings.
- [ ] Add setting to control scroll/strum behavior. Swipe/drag to: (\*) strum ( ) scroll
- [ ] Seventh chords
- [ ] Close button in upper right of position dropdowns? Or better yet, click outside to close.
- [ ] String styling (different widths, brass/wound bass strings)
- [ ] Automated product tour
  - Add "Product tour" to the "fretboard is playable" section in the about screen.
  - Add "play all" to position selector. Two options: scale, ascending fourths
  - Show how to practice chord melody?
    - Add scale degrees to the fretboard
    - Play through a simple "fly me to the moon" chord melody, or something similar
- [ ] Ukulele

- [ ] Reorganize business logic?
  - **Diatonic calculations (by key)**: For a given key, determine diatonic chords, scales, note names, midi numbers and degrees. Pretty much just wrap tonaljs.
  - **Instrument calculations (fretboard locations by instrument)**: For a given instrument and tuning, determine midi numbers of each fretboard location, and vice-versa.
  - **Fretboard calculations (grips and positions by key and instrument)**: Grips and positions for a given key and instrument. Subjective, hard-coded.
  - **Label calculations (by key and strategy)**: How to label each note shown on the fretboard, based on key (or sharp preference, if no key) and strategy (note name, chord interval, scale degree, etc.). Difference contexts (chord tone, stopped string, scale overlay, ...) will use different strategies and styles (ex. temporarily un-stopped chord tone will be transparent, etc.)
