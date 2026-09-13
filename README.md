# Lifestyle & Wellness Assessment — Bilingual Survey App

A production-ready, mobile-first, bilingual (English + Telugu) lifestyle and wellness survey web application. Built with pure HTML5 / CSS3 / Vanilla JavaScript. Responses are saved to Google Sheets via Google Apps Script. Zero dependencies, zero build step.

---

## File Structure

```
wellness-survey/
├── index.html                    ← Application shell
├── styles.css                    ← Mobile-first wellness styles
├── app.js                        ← All JS: translations, wizard, scoring, submission
├── config.js                     ← Runtime config (add your Script URL here)
├── google-apps-script/
│   └── Code.gs                   ← Google Apps Script backend
└── README.md                     ← This file
```

---

## Quick-Start Checklist

- [ ] Create Google Sheet  
- [ ] Deploy Google Apps Script  
- [ ] Update `config.js` with the Web App URL  
- [ ] Push to GitHub  
- [ ] Enable GitHub Pages  
- [ ] Test English survey  
- [ ] Test Telugu survey  

---

## Step 1 — Create Your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name the spreadsheet: **Lifestyle Wellness Responses** (or any name you prefer).
3. The sheet **does not** need pre-created column headers — the Apps Script will create them automatically.
4. Note your spreadsheet URL; you will open it again in Step 3.

---

## Step 2 — Open Apps Script

1. Inside your Google Sheet, click **Extensions → Apps Script**.
2. A new Apps Script project opens in a browser tab.
3. Delete all existing code in the editor (the default `myFunction` stub).

---

## Step 3 — Paste Code.gs

1. Open the file `google-apps-script/Code.gs` from this repository.
2. Copy the entire contents.
3. Paste it into the Apps Script editor.
4. Click **Save** (the floppy-disk icon, or `Ctrl+S` / `Cmd+S`).
5. Name the project (e.g. "Wellness Survey API") when prompted.

---

## Step 4 — Initialise the Sheet (One-time)

1. In the Apps Script editor, select the function `setupSheet` from the dropdown next to the **Run** button.
2. Click **Run**.
3. When asked for permissions, click **Review Permissions**, choose your Google account, then click **Allow**.
4. Switch back to your Google Sheet — a tab named **Responses** with styled column headers should now appear.

---

## Step 5 — Deploy as Web App

1. In Apps Script, click **Deploy → New deployment**.
2. Click the gear icon ⚙ next to "Select type" and choose **Web app**.
3. Fill in the settings:
   | Setting | Value |
   |---------|-------|
   | Description | Wellness Survey API v1 |
   | Execute as | **Me** |
   | Who has access | **Anyone** |
4. Click **Deploy**.
5. **Copy the Web App URL** — it will look like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   Keep this URL safe; you will need it in the next step.

> **Important:** Every time you edit `Code.gs`, you must create a **New deployment** (not "Manage deployments" → Edit) to get an updated URL that serves the latest code.

---

## Step 6 — Update config.js

Open `config.js` and paste your Web App URL into `googleScriptUrl`:

```js
const CONFIG = {
  brandName: "Lifestyle & Wellness",
  contactName: "Moulika",
  phone: "6302552079",
  whatsapp: "916302552079",
  googleScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",  // ← paste here
  defaultLanguage: "en",
  surveyDuration: "2–3 minutes",
  langStorageKey: "wellness_lang",
  version: "1.0.0"
};
```

Save the file.

---

## Step 7 — Deploy to GitHub Pages

### 7a — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository**.
3. Name it (e.g. `wellness-survey`) and set it to **Public**.
4. Click **Create repository**.

### 7b — Push Files

From your local folder, run:

```bash
git init
git add .
git commit -m "Initial wellness survey deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/wellness-survey.git
git push -u origin main
```

### 7c — Enable GitHub Pages

1. In your repository on GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main` — `/ (root)`
3. Click **Save**.
4. After 1–2 minutes, your site will be live at:
   ```
   https://YOUR-USERNAME.github.io/wellness-survey/
   ```

---

## Step 8 — Test English Survey

1. Open the site URL in Chrome (desktop or mobile).
2. On the Language Selection screen, click **English**.
3. Complete all 5 steps using test data:
   - Name: Test User
   - Contact: 9876543210
   - Answer all questions
4. Click **Submit Survey**.
5. Verify the **Thank You screen** appears with a wellness score and 3 focus areas.
6. Open your Google Sheet — a new row should appear in the **Responses** tab with all 33 columns filled and `Language = EN`.

---

## Step 9 — Test Telugu Survey

1. Open the site URL in a new private/incognito window (to clear `localStorage`).
2. On the Language Selection screen, click **తెలుగు**.
3. Verify the **entire application switches to Telugu** — all labels, buttons, questions, and options.
4. Complete all 5 steps in Telugu mode.
5. Click **సర్వే సమర్పించండి**.
6. Verify the **Thank You screen** shows Telugu text with the score.
7. Open your Google Sheet — a second row should appear with `Language = TE`.

---

## Step 10 — Test Language Switch During Survey

1. Start a survey in English.
2. Fill in Step 1 (personal details).
3. Click **Next** to go to Step 2.
4. Click **తెలుగు** in the header switcher.
5. Verify:
   - All labels switch to Telugu immediately
   - **Your personal details from Step 1 are preserved** (not cleared)
   - The current step stays at Step 2
6. Switch back to English — all answers still intact.

---

## Step 11 — Test Error Handling

1. Temporarily clear `googleScriptUrl` in `config.js` (set to empty string `""`).
2. Complete and submit the survey.
3. The app shows the result page immediately in **demo mode** (no Sheet write).
4. Restore the URL when done.

---

## Troubleshooting

### Survey submits but nothing appears in Google Sheet
- Confirm `googleScriptUrl` in `config.js` points to the correct deployed URL.
- Open the Apps Script editor → **Execution log** to see any server errors.
- Make sure the deployment was created with **Who has access: Anyone** (not "Anyone with Google account").

### CORS error in browser console
- Apps Script returns CORS headers. If you see a CORS error:
  - Confirm you copied the `/exec` URL, not the `/dev` URL.
  - The `/dev` URL is for testing inside Apps Script only and does not serve CORS headers.
  - Create a new deployment if the issue persists.

### Telugu characters appear garbled
- Ensure `<meta charset="UTF-8">` is in `index.html` (it is by default).
- Confirm the file was saved as UTF-8 in your editor.
- The Noto Sans Telugu font is loaded from Google Fonts — users need internet access for first load.

### "We couldn't save your response" error
- Check the user's internet connection.
- Verify the Apps Script URL is correct.
- Check the Apps Script execution log for specific errors.

### Response ID counter resets
- The counter is stored in Google Apps Script **Script Properties** keyed by date.
- It resets to 0001 each calendar day automatically (by design).
- To inspect: Apps Script editor → **Project Settings → Script Properties**.

---

## Google Sheet Column Reference

| Column | Header | Description |
|--------|--------|-------------|
| A | Timestamp | Server-side submission time |
| B | ResponseID | Unique ID (e.g. WL-20260913-0001) |
| C | Language | EN or TE |
| D | Date | User-entered date |
| E | Name | Participant name |
| F | Age | Age |
| G | Gender | Male / Female / Prefer not to say |
| H | Contact | Mobile number |
| I | Q1 | Overall lifestyle rating |
| J | Q2 | Exercise days/week |
| K | Q3 | Water glasses/day |
| L | Q4 | Food habits |
| M | Q5 | Areas to improve (comma-separated) |
| N | Q5Other | Q5 "Other" description |
| O | Q6 | Sleep quality |
| P | Q7 | Energy level |
| Q | Q8 | Digestion comfort |
| R | Q9 | Main wellness goal |
| S | Q9Other | Q9 "Other" description |
| T | Q10 | Motivation level |
| U | GuidanceRequested | Yes / Maybe / No |
| V | PreferredMode | At Wellness Centre / Phone/WhatsApp / Online |
| W | PreferredTime | User-entered preferred time |
| X | OverallScore | Weighted lifestyle score (0–100) |
| Y | ActivityScore | Exercise domain score |
| Z | DietScore | Diet domain score |
| AA | HydrationScore | Hydration domain score |
| AB | SleepScore | Sleep domain score |
| AC | EnergyScore | Energy & stress domain score |
| AD | FocusArea1 | Top focus area key |
| AE | FocusArea2 | Second focus area key |
| AF | FocusArea3 | Third focus area key |
| AG | SubmissionStatus | Always "Submitted" |

---

## Scoring Formula

| Domain | Weight | Source Questions |
|--------|--------|-----------------|
| Exercise / Activity | 25% | Q2 |
| Diet / Food Habits | 25% | Q1 + Q4 (average) |
| Sleep | 20% | Q6 |
| Hydration | 15% | Q3 |
| Energy & Stress | 15% | Q7 + Q10 (average) |

**Overall Score = (Activity × 0.25) + (Diet × 0.25) + (Sleep × 0.20) + (Hydration × 0.15) + (Energy × 0.15)**

Focus areas are the **3 lowest-scoring domains** — used to generate personalised suggestions.

> ⚠️ **Disclaimer:** This score is a general wellness indicator only. It is **not** a medical diagnosis, disease prediction, or clinical assessment. Always consult a healthcare professional for medical advice.

---

## Security Notes

- The Google Sheet is only accessible by you (the owner).
- The Apps Script Web App **only writes data** — it never reads or exposes Sheet data to users.
- No personal data is stored in the frontend. All data goes directly to your private Sheet.
- Do **not** commit your Google Apps Script URL to a public repository if you want to prevent spam submissions. Use environment variables or a server-side proxy in production.
- Contact numbers are stored for follow-up guidance purposes only.

---

## Contact

**Moulika** — Lifestyle & Wellness Guidance  
📞 [6302552079](tel:6302552079)  
💬 [WhatsApp](https://wa.me/916302552079)
