# 34 Division — voter verification portal

Mobile-first web app for volunteers to verify voters street by street, with
automatic duplicate detection.

## How duplicates are handled

Every new entry is compared against all verified voters on **name, serial number,
mobile and street**. Names are compared order-independently and fuzzily
("Rao Venkata K" ≈ "K Venkata Rao", "Venkat" ≈ "Venkata").

| Situation | Result |
|---|---|
| Same name **and** (same serial no. **or** same mobile) | **Blocked**: already verified, cannot be entered again |
| Similar name with same serial / mobile / street, or same serial with a different name | **Volunteer must confirm** "this is a different person" after comparing side by side |
| Same mobile, clearly different name | Shown as **same family** (info only), saves normally |
| Nothing similar | Saves directly |

Bulk uploads (admin, Excel/CSV) follow the same rules: exact duplicates are skipped,
look-alikes go to the **Review queue** for a volunteer to accept or discard.

## Accounts

- **First run:** when the database has no users, the site shows a *Create the admin account*
  screen. Whoever completes it becomes the admin. Nobody else can use that screen afterwards.
- **Volunteer sign-up:** volunteers can create their own account from the login page. It stays
  locked until the admin approves it (Volunteers page, or the banner on the dashboard).
- The admin can also create volunteer logins directly.

## Roles

- **Admin**: everything, plus upload list, approve/manage volunteers, edit/delete voters, export CSV.
- **Volunteer**: add voters, search, review queue.

## Run locally

```bash
cp .env.example .env   # fill in DATABASE_URL
npm install
npm start              # http://localhost:3000
```

The database schema is created automatically on start.

## Hosting (free)

- **App**: Render free web service (`render.yaml`). It sleeps after 15 min idle; the
  first visit after that takes ~30-60 s to wake up.
- **Database**: Neon free Postgres (Render's free Postgres is deleted after 30 days).

Environment variables on Render: `DATABASE_URL`, `NODE_ENV=production`.
