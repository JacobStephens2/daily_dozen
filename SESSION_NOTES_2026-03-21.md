# Daily Dozen Tracker - Session Notes (2026-03-21)

## What we accomplished

### Structural
- Split monolithic `app.js` (2,193 lines) into 7 focused ES modules in `js/`
  - `categories.js` — diet type category definitions and link mapping
  - `storage.js` — localStorage helper functions and constants
  - `checkbox.js` — checkbox behavior logic
  - `pwa.js` — service worker, installation
  - `history.js` — history calendar view
  - `auth.js` — account management and sync
  - `focus-trap.js` — accessibility utility for modals
- Moved 10 manual test HTML files to `tests/` directory
- Updated `index.html` to use `<script type="module">`

### Features
- **History view** — monthly calendar grid color-coded by completion %, streak counter, perfect days stats
- **Past-day editing** — click any day in history to navigate and edit its entries
- **Date navigation** — date pill moved to header with prev/next arrows and native date picker
- **Data export** — JSON download of all profile data
- **Data import** — file picker to restore from JSON backup
- **Account system** — email/password auth with SQLite, JWT tokens, debounced auto-sync
- **Forgot password** — token-based reset with Mandrill email delivery
- **Diet type descriptions** — explanations below the diet selector

### Infrastructure
- Apache reverse proxy (`ProxyPass /api/`) forwarding to Node on port 3000
- systemd service `dailydozen-api` for the Node API (auto-restart, enabled on boot)
- SMTP via Mandrill (`smtp.mandrillapp.com`) using credentials from the wadadli project
- SQLite database in `data/` directory (gitignored, owned by www-data)
- `/data/` directory blocked from static serving in Apache config
- `trust proxy` enabled for correct rate limiting behind Apache

### Polish & Fixes
- Removed manual update system (~700 lines) — replaced with auto-reload on SW update
- Replaced `prompt()` with styled modal for profile name editing
- Rotating scripture quotes in celebration modal (7 verses)
- Offline indicator banner
- Accessibility: ARIA labels on checkboxes, focus trapping in all modals, role="dialog"
- Auth token auto-refresh when within 7 days of expiry
- Removed all `console.log` calls from production code
- Removed redundant `<script src="sw.js">` tag

## Key files and locations
- **App:** `/var/www/daily_dozen/`
- **Live URL:** `https://dailydozen.jacobstephens.net`
- **API service:** `sudo systemctl restart dailydozen-api`
- **Apache config:** `/etc/apache2/sites-enabled/dailydozen.jacobstephens.net-le-ssl.conf`
- **Database:** `/var/www/daily_dozen/data/daily_dozen.db`
- **SMTP creds source:** `/var/www/wadadliflarecatering.com/private/.env`
- **SMTP configured in:** `/etc/systemd/system/dailydozen-api.service`

## Known remaining items
- Version string `2.0.12` is hardcoded in multiple files (not yet centralized)
- No category miss insights ("You often miss Flaxseed")
- No share button for daily completion
- Google Analytics could be made opt-in
