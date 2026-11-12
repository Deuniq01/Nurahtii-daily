# Nurahtii 🌙
### *A daily world built for someone I love*

A Progressive Web App (PWA) built as a personal love project — a beautiful daily space that starts with 100 days of content and can grow over time. Designed to be installed on her phone like a real app, synced across her devices via Firebase, and crafted with care in every detail.

---

## What it does

Every day she opens it, she gets:

| Feature | Description |
|--------|-------------|
| 🎂 **Birthday Welcome** | A birthday page with her photos, image-inspired stories, wishes, and promises, shown before the daily-world entry screen |
| 💌 **Daily Love Note** | A personal message each day; the first 100 are included |
| 🌙 **Daily Dua** | An Islamic prayer each day; the first 100 are included |
| 🫙 **Love Jar** | One surprise to unlock per day; the first 100 are included |
| 📅 **Countdown** | Live ticking, annually recurring countdowns to the anniversary and both birthdays |
| 🌸 **Mood Garden** | She logs her mood daily, each one plants a flower in her growing garden |
| 💬 **Q&A Corner** | Pre-loaded answers to questions she'd ask, and she can submit new ones |
| ❓ **Daily Question** | A deep or playful daily question for her to answer privately; the first 100 are included |

All her answers, mood history, jar collects, and progress sync across every device she uses via Firebase Firestore.
If a cloud write fails, the app keeps the change on the current device, queues it for retry, and shows a sync warning. Pending writes are retried the next time data syncs or when **Retry sync** is used.

---

## Tech stack

- **Frontend** — Vanilla HTML/CSS/JS, no framework; each app page is a separate HTML fragment loaded on demand
- **Database** — Firebase Firestore (free tier)
- **Hosting** — Netlify via GitHub
- **PWA** — `manifest.json` + service worker for installability
- **Fonts** — Playfair Display, Tajawal, Lato (Google Fonts)

---

The birthday experience uses a mobile-first, full-screen card stack: each portrait or message fills a consistent card, and section-specific 3D transitions add cards as you scroll down and remove them as you scroll back up. The opening hero gets its own screen. The birthday-universe button opens a full-screen celebration. Desktop pointer effects are limited to fine pointers, and motion respects the device's reduced-motion preference.

## File structure

```
/
├── index.html          # Shared document shell, navigation, and load-error UI
├── page-loader.js      # Loads the birthday first, then app scripts and page fragments
├── app.js              # Shared application logic and navigation
├── styles.css          # Shared app styles
├── birthday.css        # Birthday page layout, full-screen stack, celebration, and effects
├── birthday-effects.js # Scroll-driven stacks, pointer tilt, celebration, and lightbox
├── pages/              # Individual HTML fragments for the 11 app pages
│   ├── birthday.html
│   ├── entry.html
│   ├── home.html
│   ├── note.html
│   ├── dua.html
│   ├── jar.html
│   ├── countdown.html
│   ├── mood.html
│   ├── qa.html
│   ├── daily-question.html
│   └── admin.html
├── images/             # Birthday gallery photos
├── manifest.json       # PWA manifest — name, icons, display mode
├── sw.js               # Service worker — app-shell and page-fragment caching
├── icon-192.png        # App icon (small)
└── icon-512.png        # App icon (large / splash screen)
```

---

## Admin panel

To update content (prepare a day's note, dua, jar surprise, and question; write a custom note for today; or answer her questions):

- **Desktop:** Type `habeeb` anywhere on the keyboard
- **Mobile:** Tap the *Nurahtii 🌙* logo in the top navigation **5 times quickly**
- **URL:** Add `#admin` to the end of the URL

The Admin Panel's **Reset All Data** action deletes this app's `userData` documents from Firestore and clears this browser's app data after confirmation.
Use **Prepare Daily Content** to load and edit content by day. The first 100 days are bundled; the planned initial extension is through Day 730, and the day counter can continue beyond that. Load a day successfully before saving so an unsuccessful Firebase read cannot be mistaken for an empty day.

---

## Data & privacy

App data is sent to and stored in Firebase Firestore under the configured Google Firebase project, and fonts are loaded from Google Fonts. The site has no analytics, ads, or tracking. Firestore access depends on your project security rules; this repository does not include those rules, so verify they restrict access before sharing the site. The entry screen is not authentication.

---

## Notes

- Day 1 is set automatically on first visit and stored in Firebase — the day counter advances on its own every calendar day
- The first 100 love notes, duas, jar surprises, and daily questions are pre-loaded
- The day counter continues beyond Day 100; add content in the Admin Panel as days are prepared. Missing future content is shown as unavailable rather than silently repeating an earlier day.

---

*Built with love. Till Jannah.* 💙🩷
