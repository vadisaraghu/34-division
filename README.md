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
- **Edit family:** anyone signed in can change the family's mobile number, street or family votes
  for all members at once. A mobile number used by another family is refused.
- **Family history:** every family card has *History*: who created it, who added / moved in / moved
  out / removed members (and whether it came from an upload or the review queue), and every edit
  with the old and new values, who made it and when.
- **Bulk uploads:** rows of the same file that share a new mobile number form one new family. A row
  whose number already belongs to a family (from the form or another file) is never joined
  silently: it waits in the **Review queue** with the family shown, and the reviewer chooses *Add to
  family*, *Use a different number* or *Discard*.

## Statistics

*Statistics* (sidebar, or *More* on a phone) shows the whole verification at a glance, for everyone
signed in. Filter by **street**, **volunteer** and **date range** (quick buttons: today, last 7 / 30
days, all time). Clicking a street or volunteer row filters to it; the filters are kept in the link,
so a filtered view can be bookmarked or shared.

- Verified voters and how much of the voter list that covers, families (voters per family), family
  votes still to verify, streets, volunteers and active days
- Voters verified per day (chosen range, default last 30 days) and by time of day
- Streets and volunteers tables (sortable): voters, families, double votes, today, last activity
- Family size, age bands and men / women (compared with the voter list)
- Data quality with links: double votes, names to check, review queue, serials not in the voter
  list, missing door numbers
- *Download CSV* of the current filtered view

## Duplicate votes in the voter list

Duplicates are found **only in the uploaded voter list** (not from the voters volunteers add). Entries
are the same person when:

- the **same voter card number** (voter ID) appears more than once, or
- the **same name and the same house (door) number** appear more than once. House numbers are
  compared without spaces or punctuation ("11-285 A/2" = "11-285A/2"); names in any word order, or
  the same Telugu name.

Father's / husband's name and age are shown on every entry but don't decide it. The list's own
"listed twice" mark is shown as a reason, but on its own it doesn't make two entries duplicates.

Searching **any one serial number** of such a person brings up **all** of their serial numbers
together, everywhere:

- **Add voter:** typing or picking serial 299 shows "Duplicate vote: this person is already added at
  another serial: Serial 215, Added, by whom" (or "Not added"), so the volunteer knows before saving.
- **Voter list:** the other entries are listed right under it with the header "Same person listed 2
  times: serial 299, 215" and an *Also serial 215* badge on each.
- **Voters:** saved voters show *Also serial 215* (red when that serial is added too) and there is a
  *Duplicate in voter list* filter.
- **More than one vote** page (sidebar, or *More* on a phone): one card per person with all entries
  side by side (serial, voter ID, door, father/husband, age, part, added or not). Filter by reason,
  verified / not verified / *Added more than once*; search by name, Telugu name, voter ID or serial;
  *Mark double vote* (the note names the other serials); *Download CSV*.

### Same name · check by hand

The second tab on *More than one vote* is a deliberately wide list so nobody is missed: **everyone in
the voter list who shares a name with someone else**, one row per name with all of their **serial
numbers beside it** (green = already added). Names match in any word order, with or without spaces
("Durgaprasad" = "Durga Prasad"), or by the same Telugu name. Each row shows hints (*Duplicate*,
*Same voter ID*, *Same house*, *Added more than once*, *Same father/husband*, *Listed twice*,
*Similar age*); the likeliest are listed first and each hint is a filter (*No other match* shows
names that only share the name). Tap a name to compare its entries side by side (voter ID, father /
husband, age, door, part, added by whom). Searching a serial number opens that person's row;
*Download CSV* exports the list for checking on paper.

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
