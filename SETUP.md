# Connecting SMU+ to Supabase

SMU+ works in two modes:

- **Demo mode** (what runs now). Accounts, memberships, board posts, saved players and Brief signups are kept in each visitor's own browser. Nothing is shared between people or devices.
- **Live mode.** Everything above is saved in a real database, so accounts work on any device and everyone sees each other's board posts as they're written.

The site switches to live mode by itself once `assets/config.js` has your Supabase URL and anon key. If those are empty, or Supabase can't be reached, the site stays in demo mode. It never breaks.

**Payments are not real in either mode.** "Join" opens a demo checkout that only changes your membership tier. No card is asked for and no money is taken.

Setup takes about 15 minutes.

## 1. Create the Supabase project

1. Go to https://supabase.com and sign in (GitHub sign-in is fine).
2. Click **New project**.
3. Name it `smu-plus` and choose a strong database password. Save the password in your password manager. The site doesn't need it.
4. Pick the region closest to Dallas (for example **East US (North Virginia)** or **Central US** if it's listed).
5. Click **Create new project** and wait 1–2 minutes for it to finish.

## 2. Create the tables (schema.sql)

1. In the left sidebar, open **SQL Editor** and click **New query**.
2. Open `supabase/schema.sql` from this repo, copy everything in it, and paste it into the editor.
3. Click **Run**. It should end with "Success. No rows returned".

This creates the tables (profiles, memberships, boards, threads, posts, content, Brief signups, watch progress and saved players). It also turns on Row Level Security, which means:

- Anyone can read the boards.
- Only signed-in people can post.
- Members-only boards can only be read by members.
- People can only change their own data.

You can run the file again safely if you ever need to.

## 3. Load the starting content (seed.sql)

1. Click **New query** again.
2. Paste in everything from `supabase/seed.sql` and click **Run**.

This loads the 6 boards and the 22 sample threads (with their 63 posts, all from fictional fans), plus the 15 fictional sample posters and the 24 library items. Running it again resets the sample threads, including any replies posted on them. Threads that real users started are left alone.

## 4. Turn on email sign-in

1. Go to **Authentication → Sign In / Providers** (on older dashboards: **Authentication → Providers**).
2. Make sure **Email** is enabled.
3. Leave **Confirm email** on. New members then get a confirmation email before their first sign-in. Turn it off if you want sign-up to work instantly during a class demo.

Magic links ("Email me a link") use the same Email provider, so they don't need any extra setup.

Supabase's built-in email sender is limited to a few emails an hour. That's fine for a class demo. For real traffic, add your own SMTP under **Authentication → Emails → SMTP Settings**.

## 5. Set the site URL and redirect URLs

These tell Supabase where to send people back after they click a link in an email.

1. Go to **Authentication → URL Configuration**.
2. Set **Site URL** to:

   `https://jacksonwalker1415.github.io/mustangs-plus/`

3. Under **Redirect URLs**, click **Add URL** and add both of these:

   `https://jacksonwalker1415.github.io/mustangs-plus/account/`
   `https://jacksonwalker1415.github.io/mustangs-plus/**`

4. Click **Save**.

## 6. Copy the URL and anon key into the site

1. Go to **Project Settings → API** (on newer dashboards: **Project Settings → Data API** for the URL, and **API Keys** for the key).
2. Copy the **Project URL**. It looks like `https://abcdefghijklmno.supabase.co`.
3. Copy the **anon public** key. It's a long string that starts with `eyJ…`. If you only see "publishable" keys, copy the publishable key (`sb_publishable_…`) instead. It does the same job.
4. In this repo, open `assets/config.js` and paste them in:

   ```js
   window.SMU_CONFIG = {
     SUPABASE_URL: 'https://abcdefghijklmno.supabase.co',
     SUPABASE_ANON_KEY: 'eyJ...your anon key...',
     SITE_URL: 'https://jacksonwalker1415.github.io/mustangs-plus/'
   };
   ```

5. Commit and push. GitHub Pages updates in about a minute.

**The anon key is meant to be public.** Every visitor's browser uses it, and Row Level Security decides what it's allowed to do. It's safe in the repo.

**Never put the `service_role` key (or a `sb_secret_…` key) in this repo or anywhere on the site.** That key skips every security rule. It belongs only on a server, such as a future Stripe webhook. If it ever ends up in a commit, rotate it right away in **Project Settings → API Keys**.

## 7. Check that it works

1. Open https://jacksonwalker1415.github.io/mustangs-plus/account/ in a private window.
2. Click **Create account**, use a real email address, and confirm it from your inbox (if confirmation is on).
3. On the account page, the small label should say **Your SMU+ account**, not "Demo account".
4. Pick a plan. The demo checkout should switch your tier.
5. Go to **The Expressway message boards**, start a thread, and reply to it.
6. Open the same thread in a second browser signed in as someone else. A new reply should show up in the other browser within a second or two.
7. In Supabase, open **Table Editor**. You should see your rows in `profiles`, `memberships`, `threads` and `posts`.

If the site shows "Live features are unavailable right now, so SMU+ is running in demo mode", check that the URL and key in `config.js` are right and that the project isn't paused. Free projects pause after a week with no activity; click **Restore** in the dashboard.

## Later: real payments (not set up)

Checkout is demo-only on purpose. If SMU+ ever takes real money, use Stripe in **test mode** first:

1. A Stripe Checkout session is created by a server-side function, such as a Supabase Edge Function. It is never created from the browser.
2. A Stripe webhook (also server-side, using the `service_role` key) sets `memberships.tier`, `status = 'active'` and `stripe_customer_id`.
3. Then remove the two "demo:" policies on `memberships` in `schema.sql`, so the browser can no longer change tiers.

The `memberships` table already has `status` and `stripe_customer_id` columns for this.
