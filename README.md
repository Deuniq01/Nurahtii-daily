# Nurahtii 🌙
### *A daily world built for someone I love*

A Progressive Web App (PWA) built as a personal love project — a private, beautiful space that gives her something new every single day for 100 days. Designed to be installed on her phone like a real app, synced across all her devices via Firebase, and crafted with care in every detail.

---

## What it does

Every day she opens it, she gets:

| Feature | Description |
|--------|-------------|
| 💌 **Daily Love Note** | A new personal message, one for each of the 100 days |
| 🌙 **Daily Dua** | A fresh Islamic prayer written specifically for her |
| 🫙 **Love Jar** | One surprise to unlock per day — 100 waiting |
| 📅 **Countdown** | Live ticking countdowns to the anniversary, and both birthdays |
| 🌸 **Mood Garden** | She logs her mood daily, each one plants a flower in her growing garden |
| 💬 **Q&A Corner** | Pre-loaded answers to questions she'd ask, and she can submit new ones |
| ❓ **Daily Question** | A new deep or playful question each day for her to answer privately |

All her answers, mood history, jar collects, and progress sync across every device she uses via Firebase Firestore.

---

## Tech stack

- **Frontend** — Single-file HTML/CSS/JS, no framework
- **Database** — Firebase Firestore (free tier)
- **Hosting** — Netlify via GitHub
- **PWA** — `manifest.json` + service worker for installability
- **Fonts** — Playfair Display, Tajawal, Lato (Google Fonts)

---

## File structure

```
/
├── index.html        # The full application
├── manifest.json     # PWA manifest — name, icons, display mode
├── sw.js             # Service worker — caching and offline support
├── icon-192.png      # App icon (small)
└── icon-512.png      # App icon (large / splash screen)
```

---

## Admin panel

To update content (write a custom note for today, answer her questions, add a jar surprise):

- **Desktop:** Type `habeeb` anywhere on the keyboard
- **Mobile:** Tap the *Nurahtii 🌙* logo in the top navigation **5 times quickly**
- **URL:** Add `#admin` to the end of the URL

---

## Data & privacy

All data is stored in a private Firebase Firestore database under your own Google account. Nothing is shared with third parties. The site has no analytics, no ads, no tracking.

---

## Notes

- Day 1 is set automatically on first visit and stored in Firebase — the day counter advances on its own every calendar day
- 100 love notes, 100 duas, 100 jar surprises, and 100 daily questions are pre-loaded
- After Day 100 the site stays open — content loops gracefully

---

*Built with love. Till Jannah.* 💙🩷
