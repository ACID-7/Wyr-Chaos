# Wyr-Chaos

Wyr-Chaos is a browser-based "Would You Rather" party game with local pass-and-play plus online room-based multiplayer, animated UI, bonus cards, punishments, and an optional 18+ content gate.

## Features

- Two-player local play
- Online room-based multiplayer over WebSockets
- Configurable round counts
- Multiple prompt categories, including adult-only sets
- Chaos Wheel event overlay
- Bonus cards and punishment rounds
- Local leaderboard/history stored in browser `localStorage`
- Static frontend plus lightweight Node/WebSocket server

## Project Structure

- `index.html` - app structure and overlays
- `style.css` - all styling and visual effects
- `game.js` - game flow, scoring, overlays, leaderboard logic
- `wheel.js` - animated wheel rendering and spin resolution
- `data.js` - questions, punishments, bonus cards, wheel segments
- `online.js` - online room flow and client-side sync
- `server.js` - static file server and WebSocket relay
- `package.json` - Node dependencies and start script

## Run Locally

Install dependencies and start the app with Node:

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

Notes:

- Opening `index.html` directly still works for local pass-and-play only.
- Online multiplayer requires the Node server because the browser clients connect through WebSockets.

## Gameplay

1. Confirm age to unlock the full game.
2. Choose `Local` or `Online`.
3. For online: create a room or join with a room code.
4. Select categories and round count.
5. Start the game and choose between the two prompt options each round.
6. The host awards each round after both players lock in.
7. Use the Chaos Wheel, punishments, and bonus cards to escalate the match.

## Notes

- Game history is still saved locally in each browser and is not globally synced.
- Adult categories are included in the default content set.
- For deployed online multiplayer, use a host that can run Node/WebSocket servers. GitHub Pages alone is not enough.

## License

No license file is currently included in this repository.
