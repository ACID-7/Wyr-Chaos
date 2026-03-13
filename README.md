# Wyr-Chaos

Wyr-Chaos is a browser-based "Would You Rather" party game with local pass-and-play plus online room-based multiplayer, animated UI, bonus cards, punishments, and an optional 18+ content gate.

## Features

- Two-player local play
- Online room-based multiplayer over Firebase Realtime Database
- Configurable round counts
- Multiple prompt categories, including adult-only sets
- Chaos Wheel event overlay
- Bonus cards and punishment rounds
- Local leaderboard/history stored in browser `localStorage`
- Static frontend with Firebase-powered realtime sync

## Project Structure

- `index.html` - app structure and overlays
- `style.css` - all styling and visual effects
- `game.js` - game flow, scoring, overlays, leaderboard logic
- `wheel.js` - animated wheel rendering and spin resolution
- `data.js` - questions, punishments, bonus cards, wheel segments
- `custom-content.js` - optional bulk prompt overrides/additions loaded on top of the base question bank
- `online.js` - Firebase multiplayer room flow and client-side sync
- `config.js` - Firebase project configuration for the frontend

## Run Locally

Serve the project with any static server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Notes:

- Opening `index.html` directly still works for local pass-and-play only.
- Online multiplayer requires a Firebase project and Realtime Database.
- For Netlify hosting, deploy the frontend there and fill in `config.js` with your Firebase config.

## Firebase Setup

1. Create a Firebase project.
2. Add a Web App to the project.
3. Enable Realtime Database.
4. Copy your Firebase web config into `config.js`.

Example:

```js
window.WYR_CHAOS_CONFIG = {
  firebase: {
    apiKey: '...',
    authDomain: '...',
    databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...'
  }
};
```

Suggested Realtime Database rules for a simple two-player public game prototype:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": true
    }
  }
}
```

Tighten these rules before using the app at scale.

## Netlify

Netlify can host the frontend directly.

1. Deploy this repo as a static site.
2. Update `config.js` with your Firebase config.
3. Redeploy.

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
- To add large custom prompt packs, put them in `custom-content.js`. The app merges those prompts into the built-in categories at load time.
- For deployed online multiplayer, use a host that can run Node/WebSocket servers. GitHub Pages and Netlify static hosting alone are not enough.

## License

No license file is currently included in this repository.
