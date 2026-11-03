# Pub Games · Dice, Cards & Tables

The dice, card, domino and table games from the pub games night rules cards, in one app you can install on a phone and play with no signal.

**Play it:** https://pub-games.appsbydave.com/

(The old address, https://appsbydave.github.io/Pub-games/, now forwards here.)

## Games

- **Dice:** Zanzibar, Ship Captain & Crew, Farkle, Midnight, Pass the Pigs, Shut the Box
- **Cards:** Three-Card Brag, Cuckoo, Skat
- **Dominoes:** Texas 42
- **Table games:** Toad in the Hole, Hookey, Sjoelbak, Shuffleboard, Bank Shot Shuffleboard, Indoor Curling, Shove Ha'penny

Player 1 starts as "Jeanette" and the computer fills any empty seats. With two or more people on one phone, the card and domino games ask you to pass the phone before each person's go. Every game has a **Rules** button that opens its rules card.

The dice games can mix real dice and the app. Set each player to **App dice**, **Real dice** or **Computer** (in Pass the Pigs, **Real pigs**). Anyone on real dice rolls at the table, then taps in how their dice landed, and the app scores everyone on one scoreboard.

**Shut the Box** can be played solo (your best score is kept on the phone) or with up to eight. Players on real dice tap in each roll and shut the tiles in the app, or, if they're playing on a real box, just tap in the tiles left up at the end. There's a "Pick the best for me" helper, and the twist from the card (digital scoring: 2, 5 and 9 left reads 259) is an option.

**Hookey** has all three games from its card: race to exactly 101 (with the Irish finish as an option), Round the Clock, and the kids' game to 50. In the app you pull back to throw rings at the board; at the real board you tap the hook each ring lands on, on a picture of the board.

The table games can be played three ways:

- **In the app:** touch where to shoot from, pull back like a catapult, let go. The computer can take any seat.
- **Keep score at the real table:** play the real board and tap in the scores. The app does the sums and the rules (busts at 31, sjoelbak sets, who's furthest, chalking up beds).
- **Hybrid:** one match on one scoreboard. In Toad, Sjoelbak and Shove Ha'penny each player picks the real board or the app; in Shuffleboard, Bank Shot and Curling you pick before each round or end.

Bank Shot and Shove Ha'penny aren't on the printed cards yet, so their rules cards in the app were written to match the others.

## Install it on your phone

Open https://pub-games.appsbydave.com/ once with signal. The app saves itself on the phone (you'll see "Saved — works offline now"), then:

- **iPhone / iPad (Safari):** tap **Share**, then **Add to Home Screen**.
- **Android (Chrome):** tap **Install** on the bar at the bottom, or open the **⋮** menu and choose **Install app** / **Add to Home screen**.

After that, open it from the home screen icon. It works in airplane mode.

**Installed it from the old github.io address?** That copy keeps working, but open https://pub-games.appsbydave.com/ and add it to your home screen again, then remove the old icon. Scores and names saved on the phone stay with the old copy.

## Updating the app

The app always opens from the copy saved on the phone, and checks for a newer version in the background whenever there's signal (when it's opened, and when it comes back from the background). When it has saved a newer version, an **Update ready · Reload** bar appears; tap Reload to use it straight away, or it's used the next time the app is opened. Push a change here and that's all there is to it.

To make every phone fetch a fresh copy of all the files (for example after changing the icons or the manifest), bump `VERSION` in `sw.js`.

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
| `CNAME` | Tells GitHub Pages to serve the app at pub-games.appsbydave.com. |

No build step and nothing to install: it's plain files served by GitHub Pages. Scores and settings are kept on each phone only.
