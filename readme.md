Run it from the note parser directory

```
./triage.sh
```

## What it does:

Fetches your 20 most recently modified Apple Notes via JXA (~1.5s)
Sends them to Claude Sonnet for triage (~8s)
Outputs a formatted briefing with NOW / SOON / REVIEW / PATTERNS sections

## Configure with env vars:

- `NOTE_COUNT=30 ./triage.sh` — analyze more notes
- `MODEL=opus ./triage.sh` — deeper analysis
- `MAX_NOTE_CHARS=4000 ./triage.sh` — shorter context, faster/cheaper

## For daily use, add an alias to your ~/.zshrc:

```
alias scan-notes='/Users/ivanprokopovich/code/--temporary/note\ parser/triage.sh'
```

Then just type `scan-notes` each morning. You can also tweak `prompt.txt` anytime to adjust how Claude categorizes and presents your notes.

## Sample output:

☀️ Fetching your 20 most recently modified notes...
🧠 Analyzing with Claude (sonnet)...
I'll analyze your 20 most recently modified Apple Notes and provide a structured morning triage.
Show less

### 🔴 NOW

- **📆 New 5 Day** — Robinhood deadline for 3% match needs attention. Cancel Lodi Tri Vi in Chalten if staying longer. Cancel Liberty Dental appointment. Airbnb maintenance issues (leaking shower, missing kitchen items) need immediate communication.
- **Keeping #tabs on** — Multiple financial loose ends tracked but needs review of what's actually still pending vs completed.

### 🟡 SOON

- **Jesssica's Patagonia** — Outstanding expense settlement: Vanya paid $496 total that needs to be split or reconciled with Jessica.
- **📆 New 5 Day** — "Lingering Integrity" items: send photos to Agustina, Abbie, and Katie; rebuild TypeScript habit; investigate solve.it.com; make Chipas with Cassava Starch.
- **📆 New 5 Day** — Work planning: need to plan active weeks (strength/endurance alternating with rest days).

### 🟢 REVIEW

- **Be funny - humor** — Recently updated collection of humor examples and teasing techniques. Modified just hours ago (today).
- **TO WATCH 🎥 🍿** — Added "New York, I Love You" link early this morning. Massive watch list being actively curated.
- **Spanish 🇪🇸 🇦🇷** — Active language learning with Acro Yoga vocabulary and romantic phrases added yesterday.
- **Food in Mexico with Diamond Dogs** — Simple grocery/supply list for upcoming Mexico trip.

### 🔗 PATTERNS

You're clearly in **Argentina/Patagonia mode** (Bariloche, El Chalten references across multiple notes). Strong focus on **movement practices** (acro yoga, hiking, climbing, parkour) and **health tracking** (back pain management, digestion, recent appendicitis recovery). **Spanish learning** is active and practical. You're balancing **remote work** with adventure travel, and there's evidence of **financial housekeeping** that needs attention (Robinhood deadline, expense settlements). The humor note suggests you're working on **social skills/personality development**.
