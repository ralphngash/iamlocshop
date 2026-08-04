# Deploy checklist — I AM Loc Shop (red)

Open this file when you are ready to go live.  
Also tell the AI: **ready to deploy**

---

## Before deploy

- [ ] Run full check: `python check.py red` (from `iamlocshopmain/`)
- [ ] Confirm GitHub is up to date: https://github.com/ralphngash/iamlocshop
- [ ] Optional: clean any leftover `[Red]` from page titles

---

## Hosting

- [ ] Connect GitHub repo `ralphngash/iamlocshop` to host (Railway / Netlify / Cloudflare Pages / Vercel)
- [ ] Branch: `main`, root directory: `/`
- [ ] Static serve works (Railway needs start command on `$PORT` if used)
- [ ] Test temporary host URL (all pages, gallery See more, school video, logo, lion fade)

---

## Domain + HTTPS

- [ ] Add custom domain in host dashboard
- [ ] Set DNS records as host instructs
- [ ] Confirm **https://** padlock works
- [ ] Enable **Always use HTTPS** (http → https)
- [ ] One canonical host (www or non-www) with redirect

---

## Open Graph / Facebook (IMPORTANT)

Facebook needs an **absolute** `og:image` URL.

**Current (GitHub raw — testing only):**

```text
https://raw.githubusercontent.com/ralphngash/iamlocshop/main/assets/og-image.png
```

**When your domain is live — update every HTML page** (search-replace):

```html
<meta property="og:image" content="https://YOURDOMAIN.com/assets/og-image.png" />
<meta name="twitter:image" content="https://YOURDOMAIN.com/assets/og-image.png" />
```

Optional:

```html
<meta property="og:url" content="https://YOURDOMAIN.com/" />
```

Then:

1. Push to GitHub  
2. Open [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)  
3. Enter live URL → **Scrape Again** (twice if needed)

---

## Security / accounts

- [ ] 2FA on GitHub, host, domain registrar
- [ ] Strong passwords on SalonRunner / Booksy / email
- [ ] Prefer `https://` for booking links
- [ ] Optional: security headers (HSTS, nosniff, frame protection)

---

## After go-live

- [ ] Smoke test: Home, Services, Gallery, School, Contact
- [ ] Mobile check
- [ ] Facebook share preview looks correct
- [ ] Optional: redirect old Weebly site to new domain

---

## Ongoing updates

```text
edit → git push origin main → host redeploys → smoke-test live site
```
