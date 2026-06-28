# 🎬 MovieWorld

> **Your World of Movies** — A Netflix-inspired movie discovery platform built with React, TailwindCSS, and the TMDB public API.

![MovieWorld Banner](https://img.shields.io/badge/MovieWorld-v1.0.0-e50914?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=flat-square&logo=tailwindcss)
![TMDB](https://img.shields.io/badge/API-TMDB-01b4e4?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- 🏠 **Cinematic Home Page** — Full-screen auto-rotating hero banner with trending movies, trailer play button, and 6 horizontal scroll carousels (Trending, Now Playing, Top Rated, Popular, Upcoming, TV Shows)
- 🔍 **Instant Search** — Suggestions appear on the **first keystroke** (250ms debounce) with poster thumbnails, release year, media type badges, and keyboard navigation (↑ ↓ arrows)
- 🕐 **Search History** — Last 10 searches remembered locally; shown when the search bar is focused with individual delete & clear all
- 🎬 **Movie / TV Detail Pages** — Cinematic backdrop, cast carousel, genre badges, budget/revenue stats, and similar recommendations
- ▶️ **YouTube Trailers** — Inline modal with autoplay, ESC to close, click-outside-to-close
- 📋 **Watchlist** — Add/remove movies; badge count on navbar; persisted across sessions
- ❤️ **Liked Movies** — Separate liked list with unlike-on-hover; persisted across sessions
- 🎭 **Browse by Genre** — Sidebar (desktop) + horizontal chips (mobile), Movies/TV toggle, load-more pagination
- 💾 **Fully Offline-Persistent** — Watchlist, liked movies, and search history all stored in `localStorage`
- 📱 **Fully Responsive** — Mobile (375px), tablet (768px), desktop (1440px+)
- ⚡ **Session Cache** — API responses cached in `sessionStorage` to avoid redundant requests

---

## 🖥️ Screenshots

| Home Page | Movie Detail | Search |
|---|---|---|
| Hero banner + carousels | Backdrop, cast, trailer | Live suggestions dropdown |

| Watchlist | Browse by Genre | Mobile |
|---|---|---|
| Saved titles grid | Genre sidebar + grid | Responsive layout |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | TailwindCSS v4 |
| Routing | React Router DOM v7 |
| API | [TMDB (The Movie Database)](https://www.themoviedb.org/) |
| Video | YouTube IFrame API |
| Fonts | Google Fonts — Russo One, Bebas Neue, Inter |
| State | React Context API + localStorage |

---

## 📁 Project Structure

```
movies-world/
├── index.html                  # HTML entry — Google Fonts, SEO meta
├── vite.config.js              # Vite + TailwindCSS plugin
├── package.json
│
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Router + UserProvider wrapper
    ├── index.css               # Global styles, design tokens, utilities
    ├── config.js               # TMDB API key + image URL helpers
    ├── api.js                  # All TMDB API calls + sessionStorage cache
    │
    ├── context/
    │   └── UserContext.jsx     # Watchlist, liked, search history (localStorage)
    │
    ├── hooks/
    │   ├── useLocalStorage.js  # Persistent state hook (cross-tab sync)
    │   ├── useDebounce.js      # Debounce hook for search input
    │   └── useFetch.js         # Generic fetch hook with cancellation
    │
    ├── components/
    │   ├── Navbar.jsx          # Sticky glassmorphic navbar + search toggle
    │   ├── SearchBar.jsx       # Dynamic search with instant suggestions
    │   ├── HeroBanner.jsx      # Auto-rotating full-screen hero
    │   ├── MovieCard.jsx       # Poster card with hover actions
    │   ├── MovieRow.jsx        # Horizontal carousel with arrow nav
    │   ├── TrailerModal.jsx    # YouTube trailer overlay
    │   └── SkeletonCard.jsx    # Shimmer loading placeholder
    │
    └── pages/
        ├── Home.jsx            # Landing page — hero + 6 carousels
        ├── MovieDetail.jsx     # Movie/TV detail — shared by /movie/:id & /tv/:id
        ├── Search.jsx          # Search results with filter tabs
        ├── Watchlist.jsx       # Saved watchlist grid
        ├── Liked.jsx           # Liked movies grid
        └── Browse.jsx          # Browse by genre with sidebar
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- npm **9+**
- A free **TMDB API Key** → [Get one here](https://www.themoviedb.org/settings/api)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/movies-world.git
cd movies-world

# 2. Install dependencies
npm install

# 3. Add your TMDB API key
#    Open src/config.js and paste your key:
#    API_KEY: 'YOUR_KEY_HERE'

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## ⚙️ Configuration

All API settings live in [`src/config.js`](./src/config.js):

```js
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: 'YOUR_TMDB_API_KEY',       // ← Replace with your key
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  YOUTUBE_EMBED: 'https://www.youtube.com/embed',
};
```

Alternatively, set it via environment variable in a `.env` file:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

Then in `config.js`:
```js
API_KEY: import.meta.env.VITE_TMDB_API_KEY,
```

---

## 🗺️ Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero + all movie carousels |
| `/movie/:id` | Movie Detail | Full movie info, cast, trailer |
| `/tv/:id` | TV Detail | Full TV show info, cast, trailer |
| `/search?q=...` | Search | Results with filter tabs |
| `/watchlist` | Watchlist | Saved movies list |
| `/liked` | Liked | Liked movies list |
| `/browse` | Browse | Browse by genre |

---

## 💾 Local Persistence

All user data is stored in the browser's `localStorage` under these keys:

| Key | Contents |
|---|---|
| `movieworld_watchlist` | Array of saved movie objects |
| `movieworld_liked` | Array of liked movie objects |
| `movieworld_search_history` | Array of up to 10 recent search strings |

Data persists across page refreshes and browser restarts. It is also synced across tabs in real time.

---

## 🔌 TMDB API Endpoints Used

| Endpoint | Used For |
|---|---|
| `/trending/movie/week` | Hero banner + Trending row |
| `/movie/popular` | Popular Movies row |
| `/movie/top_rated` | Top Rated row |
| `/movie/now_playing` | Now Playing row |
| `/movie/upcoming` | Upcoming row |
| `/tv/popular` | TV Shows row |
| `/movie/{id}?append_to_response=videos,credits,similar` | Movie detail page |
| `/tv/{id}?append_to_response=videos,credits,similar` | TV detail page |
| `/search/multi` | Live search suggestions + results |
| `/genre/movie/list` | Genre sidebar in Browse |
| `/discover/movie` | Browse by genre grid |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0f` | Page background |
| Card | `#16161f` | Movie cards |
| Accent Red | `#e50914` | Buttons, badges, active states |
| Gold | `#f5c518` | Star ratings |
| Logo Gradient | `#ff4500 → #e50914 → #ffd700` | "Movie" in navbar logo |
| Font — Logo | Russo One | Navbar brand name |
| Font — Titles | Bebas Neue | Hero title, movie title headings |
| Font — Body | Inter | All other text |

---

## 📜 Scripts

```bash
npm run dev      # Start development server (localhost:5173)
npm run build    # Build for production (output: /dist)
npm run preview  # Preview production build locally
npm run lint     # Run oxlint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [TMDB](https://www.themoviedb.org/) — Movie data and images API
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) — Trailer playback
- [Google Fonts](https://fonts.google.com/) — Russo One, Bebas Neue, Inter
- [React Router](https://reactrouter.com/) — Client-side routing
- [TailwindCSS](https://tailwindcss.com/) — Utility-first styling

---

<div align="center">
  Made with ❤️ and 🎬 &nbsp;|&nbsp; <strong>MovieWorld</strong> &mdash; Your World of Movies
</div>
