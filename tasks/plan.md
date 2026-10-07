# Implementation Plan: Games Section & Flexbox Froggy Clone

## Overview
We are adding an Arcade/Games section to the DevBlog to increase user engagement. The first feature is a Games listing page (`/games`) containing game cards. The first game integrated will be a clone of the popular educational game "Flexbox Froggy", where users learn CSS flexbox by positioning frogs on lilypads.

## Architecture Decisions
- **Games Listing (`/games`)**: A simple, visually appealing card grid using `shadcn/ui` components (Card, etc.).
- **Game Engine**: Pure React (Client Components). No backend required for MVP.
- **State Management**: React `useState` and `useEffect` with `localStorage` to save the user's current level in the Flexbox Froggy game.
- **Level Data**: A static array of level objects containing instructions, the expected CSS, and the initial HTML/CSS setup.

## Task List

### Phase 1: Foundation
- [ ] Task 1: Add "Games" link to the `navbar.tsx` header (before the Store link).
- [ ] Task 2: Build the Games listing page (`app/games/page.tsx`) with a beautiful card linking to the Flexbox Froggy clone.

### Checkpoint: Foundation
- [ ] Games page is accessible from the header and renders correctly.

### Phase 2: Core Game Logic (Flexbox Froggy)
- [ ] Task 3: Create the Flexbox Froggy page structure (`app/games/flexbox-froggy/page.tsx`).
- [ ] Task 4: Define the data structure for the levels (Instructions, target CSS, etc.) for the first 3-5 levels.
- [ ] Task 5: Implement the core state logic (current level, user CSS input, evaluation function to check if user CSS matches the expected outcome).

### Checkpoint: Core Features
- [ ] Game successfully validates correct CSS and allows progression to the next level.

### Phase 3: Polish & UI
- [ ] Task 6: Build the left-pane editor UI (Line numbers, textarea for CSS input, instructions).
- [ ] Task 7: Build the right-pane visualizer UI (Pond background, Lilypads showing target positions, Frogs applying the user's CSS).

### Checkpoint: Complete
- [ ] All acceptance criteria met.
- [ ] Responsive design works across mobile and desktop.
- [ ] Accessible keyboard navigation for the editor.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| CSS injection vulnerabilities | Low (Frontend only) | Since it's client-side only and doesn't save to the DB, risk is low. We will apply the CSS via React inline styles or sanitized style blocks constrained to the game area. |
| Complex visual alignment | Medium | We will use CSS variables or inline React styles to map the user's input directly to the `.pond` container. |
