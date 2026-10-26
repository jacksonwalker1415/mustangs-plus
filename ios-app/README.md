# SMU+ iOS app (Capacitor)

A native iPhone shell for the SMU+ website at https://fanplatformdemo.com/. It is a concept built for an SMU Cox MBA class project. It is not affiliated with or endorsed by SMU, SMU Athletics or Learfield, and it is not in the App Store.

Nothing in `ios-app/` is used by the website. GitHub Pages publishes the repo root, and the site never links to anything in this folder.

## Try SMU+ on an iPhone

### Quickest: no Mac needed (home-screen web app)

This works once the PWA branch (`bot/ios-pwa`) is merged and live.

1. On the iPhone, open **https://fanplatformdemo.com/** in Safari.
2. Tap **Share**, then **Add to Home Screen**, then **Add**.
3. Open SMU+ from the home screen. It runs full screen with the SMU+ icon and the blue launch screen.

This version uses the website's own navigation. The bottom tab bar and native share sheet below are only in the Xcode app.

### Full native app (Mac with Xcode, free Apple ID)

You need:

- a Mac with **Xcode 26 or newer** (free in the Mac App Store)
- **Node 22 or newer**
- a USB cable
- a normal Apple ID (the paid Developer Program is not needed)

Steps:

1. Get the code (the `mustangs-plus` repository on GitHub, branch `bot/ios-capacitor`) and install the dependencies:
   ```bash
   cd mustangs-plus && git checkout bot/ios-capacitor
   cd ios-app
   npm install
   ```
2. Copy the current site into the app and update the Xcode project:
   ```bash
   npm run sync        # node scripts/copy-web.mjs, then npx cap sync ios
   ```
3. Open Xcode with `npm run open`, or open `ios/App/App.xcodeproj`. The first open downloads the Swift packages, which takes a minute or two.
4. Sign the app:
   - In the left sidebar click **App**, select the **App** target, then open **Signing & Capabilities**.
   - Keep **Automatically manage signing** checked.
   - Under **Team**, choose **Add an Account…**, sign in with your Apple ID, then pick the **(Personal Team)** entry.
   - If Xcode says the bundle identifier is taken, add a suffix, for example `com.fanplatformdemo.smuplus.demo1`.
5. Prepare the iPhone:
   - Plug it in, unlock it, and tap **Trust** on "Trust This Computer?".
   - Turn on **Developer Mode** in Settings → Privacy & Security → Developer Mode. The phone restarts; tap **Turn On** afterward.
   - The switch only appears after the phone has been connected to Xcode once.
6. In Xcode's toolbar, pick the iPhone as the run destination and press **Run** (⌘R).
7. The first launch is blocked with "Untrusted Developer". On the iPhone, go to Settings → General → **VPN & Device Management**, tap your Apple ID under Developer App, and tap **Trust**. Then open SMU+.

Limits of a free personal team:

- The app stops opening **7 days** after you install it. Plug in and press Run again to renew it.
- At most 3 of your own apps can be on the device at once.
- There is no TestFlight and no sharing with other people.

**After the website changes:** pull, run `npm run sync`, and press Run again. Feeds and live data refresh by themselves (see below). Pages, styles and schedules come from the copy bundled at sync time.

## What's in this folder

| Path | What it is |
| --- | --- |
| `capacitor.config.json` | App id `com.fanplatformdemo.smuplus`, name `SMU+`, web folder `www`, SMU blue `#354CA1` background, splash and status bar settings |
| `package.json` | Capacitor 8: core, cli, ios, app, browser, haptics, share, splash-screen, status-bar |
| `scripts/copy-web.mjs` | Copies the site from the repo root into `www/` and adds the native shim. It leaves the website alone and skips `sw.js`, `tools/`, `supabase/` and other non-site files. |
| `native/native.js`, `native/native.css` | App-only features. They run only when `window.Capacitor` reports a native platform. |
| `ios/` | Xcode project from `npx cap add ios` (Swift Package Manager, no CocoaPods) |
| `ios/App/App/SceneDelegate.swift` | `MultiPageRouter`: serves each folder's `index.html`. Capacitor's default router would send every page to the home page. |
| `ios/App/App/AppDelegate.swift`, `Info.plist` | Audio session for podcasts, background audio, the `smuplus` link scheme |
| `ios/App/App/Assets.xcassets` | App icon (one 1024×1024 image) and launch image (2732×2732) |
| `resources/` | Source images for the icon and launch screen |

`www/`, `node_modules/` and `ios/App/App/public/` are generated and are not in git.

## App features

- **Bottom tab bar:**
  - **Home**, **Watch** (`library/`), **Boards** (`boards/`), **Account** (`account/`).
  - **Sports** opens a sheet with all 12 team pages, reusing the site's own links and icons. It is highlighted on team and game pages.
  - The bar sits above the home indicator. The page, the upcoming-games ribbon, the Boards compose button and toasts all leave room for it.
- **Links:**
  - Links to fanplatformdemo.com stay inside the app.
  - Other web links (StatBroadcast live stats, smumustangs.com, X, YouTube, CollegeFootballData) open in an in-app Safari sheet, so you can swipe back to SMU+.
  - `mailto:` links open Mail.
- **Share:** the Share button opens the iOS share sheet with the public `https://fanplatformdemo.com/...` link. It falls back to web share.
- **Podcasts:** the Watch page's `<audio>` player plays inline. It keeps playing with the silent switch on and on the lock screen.
- **Live data:**
  - Live scores, play-by-play, game threads, boards and accounts come straight from Supabase over the network.
  - The video, podcast and search feeds (`data/*.json`) load from fanplatformdemo.com first. The bundled copy is used only when that fails.
- **Haptics:** a light tap on tabs, the Sports sheet, red buttons, Join, form submits and outside links.
- **Status bar and launch:** light status-bar text over the SMU blue header strip. The launch screen is flat SMU blue with the centered SMU+ logo and hides as soon as the first page is ready.
- **No service worker or web manifest** inside the app. The files are already local.

### Bundled site vs. loading the live URL

The app bundles a copy of the site (`webDir: www`). The alternative would be `server.url` pointing at https://fanplatformdemo.com/.

| | Bundled (chosen) | `server.url` to the live site |
| --- | --- | --- |
| Opens with a bad signal | Pages, styles and photos are on the phone | Blank page without a connection |
| Startup | Instant | Network on every launch |
| Page and design updates | Re-sync and Run in Xcode | Every push to `main` shows up right away |
| Live data (scores, threads, feeds) | Live from the network | Live from the network |
| App Store review (later) | Counts as app content | Apple often rejects apps that are only a website (guideline 4.2) |

To try the live-site mode for a demo, add `"server": { "url": "https://fanplatformdemo.com/" }` to `capacitor.config.json` and run `npx cap sync ios`. Don't commit that change.

## Sign-in from the app (Supabase)

The app's origin is `capacitor://localhost`. Supabase's REST and Auth endpoints answer that origin's CORS checks, and so does the jsDelivr copy of supabase-js. The live-scores table (`live_games`, filled server-side from CollegeFootballData) is readable from it too. So these work inside the app with no dashboard change:

- email + password sign-in and sign-up
- board posting
- live scores

Email links behave differently:

- **Free @smu.edu sign-up:** the code sends the email link (and, for password accounts, the confirmation link) back to `SITE_URL` in `assets/config.js`, which is https://fanplatformdemo.com/. Tapping the link opens Safari and finishes sign-in on the website, not in the app. Nothing breaks, but the app stays signed out until you sign in there with a password.
- **Optional, needs a decision (nothing has been changed):** to open email links in the app instead:
  1. Add `smuplus://app/**` under Supabase → Authentication → URL Configuration → Redirect URLs.
  2. Build with `SMU_NATIVE_AUTH_REDIRECT=1 npm run sync`. This rewrites `SITE_URL` in the app's bundled copy only.
  3. The app already registers the `smuplus` scheme and routes `smuplus://app/account/#…` to the Account page.

  Tradeoff: emails sent from that build only work on a phone with the app installed.

## Later: TestFlight (paid, needs approval)

TestFlight requires the **Apple Developer Program ($99/year)**. Nobody has signed up.

If approved:

1. Enroll at developer.apple.com.
2. In App Store Connect, create an app record with the bundle id.
3. In Xcode, pick the paid team under Signing, choose **Any iOS Device**, then Product → **Archive** → **Distribute App** → **App Store Connect** → Upload.
4. Add testers in TestFlight:
   - **Internal testers:** up to 100 people on the team, no review.
   - **External testers:** up to 10,000 by email or public link, after a short Beta App Review.

Builds expire after 90 days.

A public App Store release would also need SMU's permission to use its marks.

## Notes for maintainers

- After `npm run sync`, `www/` and `ios/App/App/public/` contain copies of the site's HTML. `tools/build_pages.py` skips `ios-app/`. Other site-wide scripts that search every `*.html` should do the same, or delete those two folders first.
- `npx cap sync` rewrites `ios/App/CapApp-SPM/Package.swift` and the copied config. It does not touch `SceneDelegate.swift`, `AppDelegate.swift`, `Info.plist` or the asset catalogs.
- **Testing without a Mac:** serve `ios-app/www/` at `/` and load it with a stub `window.Capacitor` that has `isNativePlatform: () => true`, `nativePromise` and `nativeCallback`. The tab bar and the other app features turn on.
