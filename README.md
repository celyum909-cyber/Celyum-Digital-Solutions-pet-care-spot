# Pet Care Spot — installable phone app (PWA)

This folder is the whole app. Customers open a link (or scan a QR code), and a banner offers to
add **Pet Care Spot** to their home screen. After that it opens full-screen like a normal app —
no App Store or Google Play needed.

## What's in the folder

| File | What it does |
| --- | --- |
| `index.html` | The app itself (booking, demo payments, Location, Share, owner login and dashboard, branding). |
| `manifest.webmanifest` | Tells phones the app's name ("Pet Care" under the icon), colors and icons. |
| `sw.js` | Service worker. Makes the app installable and lets it open with no signal. When online it always loads the newest version, so prices and branding are never stale. |
| `icon-192.png`, `icon-512.png` | App icons. |
| `icon-maskable-512.png` | Icon with extra padding so Android can crop it to a circle or rounded square. |
| `apple-touch-icon.png` | The iPhone home-screen icon (180 × 180). |

Keep every file at the top level of the folder. Don't move the icons into a subfolder.

## Important: it must be served, not double-clicked

Opening `index.html` straight from your files (`file://...`) shows the app, but phones won't offer
to install it. Installing needs a web address, and on a phone that address must be **https**.

## Test it on your computer

1. Open a terminal in this folder.
2. Run: `python3 -m http.server 8080`
3. Open **http://localhost:8080** in Chrome.
4. In Chrome's address bar you should see an install icon (a screen with a down arrow). Clicking it installs the app on your computer — a quick way to check everything is wired up.
5. To see the phone layout, press F12, then click the phone/tablet icon to turn on device mode.

`localhost` counts as secure, so the service worker works there. A phone on your Wi-Fi visiting
`http://your-computer-ip:8080` will show the app but **won't** offer to install it, because that
address isn't https. Use the free hosting below to test on a real phone.

## Put it online (free) with GitHub Pages

1. Sign in at github.com and click **New repository**. Name it, e.g. `pet-care-spot`, set it to **Public**, and click **Create repository**.
2. Click **uploading an existing file**, drag in **every file in this folder**, and click **Commit changes**.
3. Go to **Settings → Pages**. Under **Branch** choose `main` and `/ (root)`, then **Save**.
4. After a minute or two the page shows your address, e.g. `https://your-name.github.io/pet-care-spot/`. Use that exact address, trailing slash included.

Netlify (drag the folder onto app.netlify.com/drop) or Cloudflare Pages work the same way.

## Test on real phones

- **iPhone:** open the address in **Safari**. After about 2.5 seconds a banner explains: tap **Share**, then **Add to Home Screen**.
- **Android:** open it in **Chrome**. The banner shows an **Add to Home Screen** button.
- Tap the new icon: it should open full-screen with no browser bar.
- Turn on airplane mode and open it again: it should still load (it was saved on the first visit).
- Closing the banner with **×** hides it for 3 days. Customers can always reopen it from **Profile → Add to your phone**.

## Share it with customers

Turn the public address into a QR code and print it for the counter or the door. Always make the
QR from the final https address — a printed code can't be changed later.

## Updating the app

Upload the changed files to the same place. Phones that are online get the new version the next
time they open the app. If you ever need every phone to throw away its saved offline copy, open
`sw.js` and change `pcs-v1` to `pcs-v2` before uploading.

## For other stores (white-label)

Give each store its own copy of this folder (or its own hosting address) and change:
- `name`, `short_name` and `theme_color` in `manifest.webmanifest`
- the four icon files (same names and sizes)
- `theme-color` and `apple-mobile-web-app-title` near the top of `index.html`
- the banner's storage key `pcs-a2hs-dismissed-v1` in `index.html`, so two stores never share banner settings

The in-app **Branding** section changes the colors, name and logo inside the app. The home-screen
name and icon come from the manifest and icon files above.

## Still a demo

Prices, bookings, branding and owner changes are saved only on each phone. The owner login and
payments are fake. A real backend (e.g. Firebase or Supabase, plus Stripe for payments) is needed
before real customers use it.
