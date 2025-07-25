# Lift Cash Trivia

## Overview

A trivia application with scheduled rounds that start automatically every 3 hours. Players must authenticate using Internet Identity before they can join a lobby, select their language, indicate readiness, and are automatically transitioned into the game when the round begins. After each round ends, all players return to the lobby with cleared readiness status and must explicitly re-join for the next round by selecting their language and clicking **Ready** again.

---

## Design System

The application uses a dark theme with the following design specifications:

* **Dark backgrounds:** `#121212` (main areas), `#1e1e1e` (cards and components)
* **Text colors:** white and gray variations for readability
* **Primary accent color:** orange `#EB5528` replacing all blue accents
* **Typography:** Inter (body), Montserrat (headings h1–h6)
* **Card layouts:** 16px rounded corners, subtle shadows, hover lift effects
* **Buttons:** depth styling, orange accent, hover animations
* **Form inputs:** dark backgrounds with orange focus states
* **Gradient text effects** for main titles
* **Responsive design:** mobile breakpoint at `768px`
* **CSS variables** defined in `:root` for consistent theming

---

## Branding

* Display the Lift Cash Trivia logo: `https://wlnir-2iaaa-aaaal-ascwa-cai.icp0.io/assets/your-logo-07b5f3fa.png` in the header.
* Use the logo consistently across all pages and relevant UI components.
* Ensure logo styling matches the dark theme design system.

---

## Core Features

### Authentication System

* Require users to sign in with Internet Identity before accessing the application.
* Display login screen for unauthenticated users with dark theme styling and logo.
* Show user’s authenticated status and provide logout option.
* Redirect authenticated users to the lobby system.

### Lobby System

* Display a **live countdown timer** showing time remaining until the next scheduled round (every 3 hours on the dot).
* For **all players entering the lobby:** show language selection control and **Ready** button, regardless of previous round participation.
* Players must explicitly select their language and click **Ready** to join each new round.
* Display user’s principal ID with a copy icon button directly next to it that uses reliable clipboard functionality (including hidden textarea fallback for cross-browser compatibility).

  * Provide immediate visual feedback when the copy action is successful (checkmark icon, tooltip, or brief confirmation message).
* Show an expandable “**X players ready for next round**” box that displays the count of ready players.

  * When clicked, expand to reveal a list of principal IDs for all ready players.
* All UI elements styled with dark theme, orange accents, and card-based layouts.
* Display logo in header area.

### Trivia Game Flow

When a round starts, present each player with a series of **10 timed multiple-choice questions**:

* Each question has four answer options (A, B, C, D) with one correct answer.
* Questions are pulled from the Lift Cash trivia content library and localized to the player's chosen language.
* For each question, display:

  * Question text
  * Four answer buttons (A, B, C, D)
  * Countdown timer (15 seconds per question)
  * Current question number (e.g., “Question 3 of 10”)
  * Hint button or Rocket icon that reveals the hint text when clicked
* Automatically advance to the next question when an answer is selected or time runs out.
* Lock in the player’s answer (no changing or going back).
* Track each player's answers and compute their total correct answers throughout the round.
* **Do not display the score** until the end of the round.
* Ensure all players answer the same set of questions in their respective languages.
* UI updates automatically as questions progress.
* All game elements styled with dark theme design system and logo branding.
* If a round does not have questions available, display a message informing players and prompt them to come back later.
* After the last question (including bonus questions, if any), automatically return the player to the lobby screen.

### Round End and Reset

* When a round ends (after the last question including bonus questions), automatically return all players to the lobby screen.
* **Clear all player readiness status onchain** for all players, ensuring no one is automatically joined for the next round.
* Require all players to explicitly select their language and click **Ready** again for each new round.
* No automatic carry-over of readiness status between rounds.
* Ensure the frontend reflects the cleared readiness status when players return to the lobby.
* After readiness status is cleared, players can immediately select their language and click **Ready** to join the next round without any blocking or restrictions.

### Scheduled Round Management

* Rounds start automatically every 3 hours at fixed times (e.g., 12:00, 3:00, 6:00, 9:00).
* At the scheduled start time, automatically begin the round for all authenticated players who are marked as ready.
* Transition players from lobby screen directly into the game when countdown reaches zero.

### Easter Egg Feature

* Include a footer with: `© 2025. Started with ❤️ using [caffeine.ai](https://caffeine.ai) Extended with Humans + Claude Code`
* When any user **double-clicks the heart icon (❤️)** in the footer:

  * The heart changes to a black heart emoji (🖤).
  * The current round starts immediately, **bypassing the countdown timer**.
  * Future rounds continue on their original 3-hour schedule.
  * Works for any user, regardless of authentication status.

### Test Mode Configuration

* Include a backend configuration setting (boolean flag or environment variable) that enables test mode when set to `true`.
* When test mode is enabled during deployment:

  * Automatically reset and reinitialize all trivia data and round state.
  * Clear all historical data, player records, round states (fresh state).
* The setting is checked **only during backend initialization and deployment**, not during runtime.

---

## Backend Data Storage

Store the following:

* Authenticated user identities and session information
* Round schedules and timing information
* Player readiness status (current round only)
* Player language preferences (current round only)
* Trivia questions organized by round number:

  * **Round 1** contains the complete Lift Cash question set (10 main questions + 5 bonus questions) with localized versions for all supported languages
* List of all ready players with their principal IDs for each round
* Question sets for each round (ensuring consistency across players)
* Player answers and scores for each round, including the specific language each player used
* Completed round states including final scores and player languages
* Historical round data for each completed round
* Test mode configuration setting

---

## Backend Operations

The backend must:

* Handle Internet Identity authentication and user session management
* Calculate next round start times based on 3-hour intervals
* Save/retrieve player readiness status (current round only)
* Save/retrieve player language preferences (current round only)
* Retrieve lists of ready authenticated players when rounds begin
* Provide list of all ready players' principal IDs for lobby display
* Serve trivia questions by selected language from organized structure
* Generate consistent question sets per round
* Handle round state transitions at scheduled times
* Track player answers and calculate scores during gameplay
* Save round completion data (player scores + language used)
* Clear all player readiness status onchain when rounds end
* After clearing, allow immediate readiness setting for next round (no restrictions)
* Check if questions exist for upcoming rounds and handle missing content
* Support immediate round start trigger for easter egg functionality
* Check test mode configuration during initialization and reset all data if enabled
* Reinitialize all trivia data, round states, player records, and historical data when test mode is active

---

## User Flow

1. Player visits application and is prompted to sign in with Internet Identity on a dark-themed login screen with logo.
2. After successful authentication, player enters lobby and sees countdown to next round in card-based layout with logo in header.
3. Player sees language selection control and **Ready** button (regardless of previous participation).
4. Player can view their principal ID with a copy icon button (reliable clipboard functionality + hidden textarea fallback + confirmation feedback).
5. Player selects preferred language and clicks orange-styled **Ready** button to join upcoming round.
6. Readiness status and language preference saved for **current round only**.
7. Player can click the “X players ready for next round” box to expand and view principal IDs of all ready players.
8. When countdown reaches zero, player transitions automatically to the trivia game.

   * **If questions available:** Game begins with 10 timed multiple-choice questions (localized) showing question text, four answer options, countdown timer, progress, and hint button.
   * **If no questions:** Display message that no trivia questions exist for this round; prompt to come back later.
9. Player selects answers or lets time expire; progression through all questions (including bonus) is automatic.
10. Answers tracked; score hidden until end.
11. After last question (including bonus), player returns automatically to lobby.
12. All players' readiness status cleared onchain; they can immediately select language and click **Ready** again.
13. All game elements styled with dark theme design system and logo branding.
14. Any user can double-click the footer heart icon to activate the easter egg: start current round immediately and change heart to black.

