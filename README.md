# Pub Games · Dice, Cards & Tables

The dice, card, domino and table games from the pub games night rules cards, in one app you can install on a phone and play with no signal.

**Play it:** https://appsbydave.github.io/Pub-games/

## Games

- **Dice:** Zanzibar, Ship Captain & Crew, Farkle, Midnight, Pass the Pigs
- **Cards:** Three-Card Brag, Cuckoo, Skat
- **Dominoes:** Texas 42
- **Table games:** Toad in the Hole, Sjoelbak, Shuffleboard, Bank Shot Shuffleboard, Indoor Curling, Shove Ha'penny

Player 1 starts as "Jeanette" and the computer fills any empty seats. With two or more people on one phone, the card and domino games ask you to pass the phone before each person's go. Every game has a **Rules** button that opens its rules card.

The table games can be played three ways:

- **In the app:** touch where to shoot from, pull back like a catapult, let go. The computer can take any seat.
- **Keep score at the real table:** play the real board and tap in the scores. The app does the sums and the rules (busts at 31, sjoelbak sets, who's furthest, chalking up beds).
- **Hybrid:** one match on one scoreboard. In Toad, Sjoelbak and Shove Ha'penny each player picks the real board or the app; in Shuffleboard, Bank Shot and Curling you pick before each round or end.

Bank Shot and Shove Ha'penny aren't on the printed cards yet, so their rules cards in the app were written to match the others.

## Install it on your phone

Open the link above once with signal. The app saves itself on the phone (you'll see "Saved — works offline now"), then:

- **iPhone / iPad (Safari):** tap **Share**, then **Add to Home Screen**.
- **Android (Chrome):** tap **Install** on the bar at the bottom, or open the **⋮** menu and choose **Install app** / **Add to Home screen**.

After that, open it from the home screen icon. It works in airplane mode.

## Updating the app

The app always opens from the copy saved on the phone, and checks for a newer version in the background whenever there's signal. Push a change here and it appears the next time the app is opened (sometimes the time after).

To swap in a new version of the game page from Claude, replace `index.html` but keep these lines in its `<head>`, just after `<title>`:

```html
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Pub Games">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<script src="pwa.js" defer></script>
```

## What's in here

| File | What it does |
| --- | --- |
| `index.html` | The whole app: every game, the rules cards, and the Lexend font built in. The table games sit in their own section of the script and styles. |
| `pwa.js` | Saves the app for offline use and shows the "add to home screen" hint. |
| `sw.js` | The service worker that keeps the saved copy and fetches updates. |
| `manifest.webmanifest` | App name, colours and icons for the home screen. |
| `icons/` | Home screen icons, drawn from the app's own dice-and-card artwork. |

No build step and nothing to install: it's plain files served by GitHub Pages. Scores and settings are kept on each phone only.
