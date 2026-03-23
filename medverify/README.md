# MedVerify — Blockchain Medical Authentication

A role-based medical records platform built with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo Login

| Role | Email hint | Result |
|------|-----------|--------|
| Patient | any email e.g. `john@hospital.com` | Patient Dashboard |
| Laboratory | include "lab" e.g. `lab@medchain.com` | Lab Dashboard |

## Project Structure

```
medverify/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                    ← React entry point
    ├── App.jsx                     ← Root role-based router
    ├── styles/
    │   └── global.css              ← All shared CSS & animations
    ├── data/
    │   └── mockData.js             ← Seed records, transactions, constants
    ├── hooks/
    │   ├── useAuth.js              ← Login / logout / role state
    │   └── useRecords.js           ← Patient records CRUD state
    ├── pages/
    │   └── SettingsPage.jsx        ← Shared settings (renders for both roles)
    └── components/
        ├── shared/                 ← Reused by both Patient and Lab
        │   ├── Icon.jsx            ← All SVG icons in one place
        │   ├── Sidebar.jsx         ← Role-aware navigation sidebar
        │   ├── TopBar.jsx          ← Dashboard sticky header
        │   ├── Badge.jsx           ← Verified / Pending status badges
        │   ├── Toggle.jsx          ← Animated toggle switch
        │   ├── RecordRow.jsx       ← Single medical record list item
        │   ├── SettingsRow.jsx     ← Settings menu row with icon + toggle/chevron
        │   └── StepIndicator.jsx   ← 3-step upload progress bar
        ├── auth/
        │   ├── LoginPage.jsx
        │   └── SignupPage.jsx
        ├── patient/                ← Only rendered when role === "patient"
        │   ├── PatientDashboard.jsx
        │   ├── PHome.jsx
        │   ├── PRecords.jsx
        │   ├── PUpload.jsx         ← 3-step upload flow
        │   ├── PWallet.jsx
        │   └── PSettings.jsx
        ├── lab/                    ← Only rendered when role === "laboratory"
        │   ├── LabDashboard.jsx
        │   ├── LHome.jsx
        │   ├── LUpload.jsx
        │   ├── LHistory.jsx
        │   └── LSettings.jsx
        └── landing/
            └── LandingPage.jsx
```

## Role-Based Access

The `useAuth` hook in `src/hooks/useAuth.js` controls routing.
`App.jsx` checks `user.role` and renders either `PatientDashboard`
or `LabDashboard` — the other dashboard's routes simply don't exist
for the logged-in role.

## Replacing Mock Data

All mock data lives in `src/data/mockData.js`.  
Swap the arrays for API calls inside `useEffect` hooks in:
- `useRecords.js` — patient records
- `LHome.jsx` — lab transaction history

## Tech Stack

- React 18
- Vite 5
- DM Sans + DM Mono (Google Fonts)
- Inline styles + global CSS (no Tailwind dependency)

