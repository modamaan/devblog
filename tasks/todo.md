## Task 1: Add Games Link to Navbar
**Description:** Add a link to `/games` in the header navigation before the Store link.
**Acceptance criteria:**
- [ ] "Games" appears in the header on all pages.
- [ ] Clicking it navigates to `/games`.

## Task 2: Build Games Listing Page
**Description:** Create `app/games/page.tsx` containing a grid of game cards.
**Acceptance criteria:**
- [ ] Page exists at `/games`.
- [ ] Contains a stylized `Card` for "Flexbox Froggy" linking to `/games/flexbox-froggy`.

## Task 3: Scaffold Flexbox Froggy Page
**Description:** Create the basic layout for the Flexbox Froggy clone.
**Acceptance criteria:**
- [ ] Route exists at `/games/flexbox-froggy`.
- [ ] Layout is split into two columns (Editor on left, Visualizer on right) on desktop.

## Task 4: Level Data Structure
**Description:** Create the level configuration array.
**Acceptance criteria:**
- [ ] Array contains at least 3 levels.
- [ ] Each level has: `id`, `instructions`, `boardMarkup` (or frog configs), and `expectedCss`.

## Task 5: Core Game State
**Description:** Implement the React state to track user input and level progression.
**Acceptance criteria:**
- [ ] State tracks `currentLevel` (persisted to localStorage).
- [ ] State tracks `userCss`.
- [ ] A function evaluates if `userCss` achieves the goal of the current level.

## Task 6: Editor UI
**Description:** Build the interactive CSS editor pane.
**Acceptance criteria:**
- [ ] Shows current level instructions.
- [ ] Contains a `textarea` for typing CSS.
- [ ] "Next Level" button appears when the answer is correct.

## Task 7: Visualizer UI
**Description:** Build the graphical pond, frogs, and lilypads.
**Acceptance criteria:**
- [ ] Renders a `.pond` container.
- [ ] Renders `.lilypad` elements in their target positions using the level's `expectedCss`.
- [ ] Renders `.frog` elements that apply the `userCss` dynamically.
