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

## Roles

- **Admin**: everything, plus upload list, manage volunteers, edit/delete voters, export CSV.
- **Volunteer**: add voters, search, review queue.

## Run locally

```bash
cp .env.example .env   # fill in DATABASE_URL and ADMIN_PASSWORD
npm install
npm start              # http://localhost:3000
```

The database schema is created automatically on start. If no users exist, an admin is
created from `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

## Hosting (free)

- **App**: Render free web service (`render.yaml`). It sleeps after 15 min idle; the
  first visit after that takes ~30-60 s to wake up.
- **Database**: Neon free Postgres (Render's free Postgres is deleted after 30 days).

Environment variables on Render: `DATABASE_URL`, `ADMIN_PASSWORD`, `NODE_ENV=production`.
