# Wyr-Chaos

Wyr-Chaos is a browser-based "Would You Rather" party game with a chaotic two-player format, animated UI, bonus cards, punishments, and an optional 18+ content gate.

## Features

- Two-player local play
- Configurable round counts
- Multiple prompt categories, including adult-only sets
- Chaos Wheel event overlay
- Bonus cards and punishment rounds
- Local leaderboard/history stored in browser `localStorage`
- Zero-build setup: open the site directly in a browser

## Project Structure

- `index.html` - app structure and overlays
- `style.css` - all styling and visual effects
- `game.js` - game flow, scoring, overlays, leaderboard logic
- `wheel.js` - animated wheel rendering and spin resolution
- `data.js` - questions, punishments, bonus cards, wheel segments

## Run Locally

Because this is a static frontend project, you can run it in either of these ways:

1. Open `index.html` directly in a browser.
2. Serve the folder with a simple static server.

Example with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Gameplay

1. Confirm age to unlock the full game.
2. Enter both player names.
3. Select categories and round count.
4. Start the game and choose between the two prompt options each round.
5. Discuss the result and manually award the point.
6. Use the Chaos Wheel, punishments, and bonus cards to escalate the match.

## Notes

- Game history is saved locally in the browser and is not synced anywhere.
- Adult categories are included in the default content set.
- No package manager, build step, or backend is required.

## License

No license file is currently included in this repository.
