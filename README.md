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
| Same name + same mobile, but **different serial numbers that are both in the voter list** (e.g. father and son) | **Volunteer must confirm** instead of being blocked |
| Similar name with same serial / mobile / street, or same serial with a different name | **Volunteer must confirm** "this is a different person" after comparing side by side |
| Same mobile, clearly different name | Shown as **same family** (info only), saves normally |
| Nothing similar | Saves directly |

Bulk uploads (admin, Excel/CSV) follow the same rules: exact duplicates are skipped,
look-alikes go to the **Review queue** for a volunteer to accept or discard.

## Accounts

- **First run:** when the database has no users, the site shows a *Create the admin account*
  screen. Whoever completes it becomes the admin. Nobody else can use that screen afterwards.
- **Volunteers:** there is no public sign-up. The admin creates volunteer logins on the
  Volunteers page.

## Voter list (the official ward roll)

The admin uploads the ward's full voter list on *Upload list → Reference list* (Excel/CSV).
Columns are recognised automatically: serial no, name, name in Telugu, relation, father/husband
name (English and Telugu), age, gender, door no, voter ID, part no, listed twice. Only name and
serial number are required. Re-uploading is safe (rows are updated, not duplicated). Nobody
becomes "verified" from this list.

**The voter list is personal data. It is never stored in this repository** (`*.pdf`, `*.xlsx`,
`*.csv` are git-ignored); it lives only in the database.

What it powers:

- **Add voter:** typing a **name** (any English spelling, or Telugu), **serial number** or **door
  number** opens a drop-down with name, Telugu name, father/husband, age, serial and door number.
  People with the same name are grouped ("4 people named Ravi Kumar"); on a computer, hovering
  one highlights the others. Picking someone fills name, serial and door number. A serial number
  that belongs to exactly one voter fills the rest straight away. Already-verified people can't be
  picked. Mobile number and street are never filled from the list.
- **Official names:** when a saved voter's serial number is in the list and the typed name is the
  same person, the list's name is stored (Telugu, plus the English spelling made from it).
- **Name check:** if the typed name doesn't fit the list at that serial, the volunteer is warned;
  if saved anyway, it appears on the admin's **Check names** page.
- **Voter list page:** anyone can search the list (e.g. "who lives at door 11-250") and add a
  person from there.
- After an upload, voters saved earlier are matched to the list by serial number. Clear matches get
  the official name; anything unclear goes to **Check names** (use the list name, move to another
  serial, or keep the typed name).

## Families & money

- **One mobile number = one family.** Typing a number that already belongs to a family shows that
  family (ID, street, members). The volunteer either taps *Add to family F-0012* or uses a different
  number; a new family can never reuse a number. The server enforces this too (also when an admin
  edits a voter's mobile: moving into another family must be confirmed).
- **Money:** tapping *Money* opens a dialog listing the family's members (looked up live). Choose who
  the money is for (other members still waiting can be added) and **who received it**: a family
  member or someone else typed in. A family card also has *Give money* for everyone still waiting.
  The receiver is shown on each voter, kept in the money history and cleared on *Undo*.
- **Edit family:** change the family's mobile number, street or family votes for all members at
  once. A mobile number used by another family is refused. The card shows who edited it last.

## Double vote

Each voter has a *double vote* yes/no with an optional note on where the other vote is. Set it on
the Add voter form, or later with the chip on the voter's row. Voters has a *Double votes only*
filter, the dashboard shows the count, and the CSV export includes it.

## Roles

- **Admin**: everything, plus upload list (verified voters or reference list), check names, manage volunteers, edit/delete voters, export CSV.
- **Volunteer**: add voters, search the voter list, mark money / double vote, review queue.

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
