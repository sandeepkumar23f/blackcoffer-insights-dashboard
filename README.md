# Blackcoffer Insights Dashboard

Interactive analytics dashboard for the Blackcoffer data visualization assignment. The UI reads **live aggregations from MongoDB** through an Express API. Chart and KPI values are not hard-coded.

## 1. Overview

The app visualizes 1,000 insight records (energy, geopolitics, markets, and related topics). You can filter globally by year, topic, sector, region, PESTLE, source, country, and free-text search. Every KPI, chart, and table row updates from the same filter.

**City** and **SWOT** are required by the assignment brief but **do not exist in the supplied JSON**. The dashboard shows explicit unavailable states instead of inventing values. See `DATA_ANALYSIS.md`.

## 2. Tech stack

| Layer | Stack |
|--------|--------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, Recharts, TanStack Query, Lucide |
| Backend | Node.js, Express, TypeScript, Mongoose, Zod, Helmet, CORS, dotenv |
| Database | MongoDB (`insights` collection) |

## 3. Project structure

```
blackcoffer-insights-dashboard/
├── client/                 # Vite React app
├── server/                 # Express API
├── data/jsondata.json      # Assignment dataset
├── DATA_ANALYSIS.md
├── .env.example
└── package.json            # npm workspaces
```

## 4. MongoDB setup

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community) or use MongoDB Atlas.
2. Ensure the database is reachable (local default: `mongodb://127.0.0.1:27017`).
3. Copy environment variables (next section) and set `MONGODB_URI`.

A local database named `blackcoffer_insights` is created on first connect.

## 5. Environment variables

Copy `.env.example` to `.env` in the **project root**:

```
MONGODB_URI=mongodb://127.0.0.1:27017/blackcoffer_insights
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Do not commit `.env`. Atlas users should paste their connection string into `MONGODB_URI`.

## 6. Install dependencies

From the repository root (Node 20+):

```bash
npm install
```

This installs root tools plus `client` and `server` workspace packages.

## 7. Import JSON data

With MongoDB running:

```bash
npm run import-data
```

The script:

- reads `data/jsondata.json`
- treats empty strings as missing (`null`)
- stores numerics as numbers (never coercing missing values to `0`)
- replaces the `insights` collection so re-running does not duplicate records
- prints read / imported / skipped counts

## 8. Start the backend

```bash
npm run dev:server
```

API: `http://127.0.0.1:5000`

## 9. Start the frontend

```bash
npm run dev:client
```

UI: `http://localhost:5173` (Vite proxies `/api` to the backend).

Or run both together:

```bash
npm run dev
```

## 10. API endpoints

All dashboard routes honor the same query filters: `startYear`, `endYear`, `topics`, `sector`, `region`, `pestle`, `source`, `swot`, `country`, `city`, `search`. Multiple values can be comma-separated.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Liveness |
| GET | `/api/filters` | Distinct filter options |
| GET | `/api/insights` | Paginated table (`page`, `limit`, `sortBy`, `sortOrder`) |
| GET | `/api/insights/:id` | Single document |
| GET | `/api/dashboard/summary` | KPI totals and averages |
| GET | `/api/dashboard/by-year` | Time series (`yearField=coalesced\|end_year\|start_year`) |
| GET | `/api/dashboard/by-topic` | Topic ranking |
| GET | `/api/dashboard/by-country` | Country ranking |
| GET | `/api/dashboard/by-region` | Region distribution |
| GET | `/api/dashboard/by-sector` | Sector metrics |
| GET | `/api/dashboard/by-pestle` | PESTLE labels as stored |
| GET | `/api/dashboard/by-source` | Top sources |
| GET | `/api/dashboard/by-city` | Unavailable payload (no city field) |
| GET | `/api/dashboard/by-swot` | Unavailable payload (no SWOT field) |
| GET | `/api/dashboard/risk-matrix` | Topic scatter (likelihood × intensity) |
| GET | `/api/dashboard/topic-region-heatmap` | Topic × region intensity |

Example: `/api/dashboard/by-year?endYear=2026&country=India`

Averages use MongoDB `$avg`, which ignores `null`.

## 11. Dashboard features

- KPI cards: total insights, average intensity / likelihood / relevance, country count, topic count
- Global filters with active count and clear-all
- Year trend with intensity / likelihood / relevance toggle
- Topics, countries, regions, sectors, PESTLE, sources
- City and SWOT unavailable states
- Intensity × likelihood scatter (bubble size = relevance); quadrants are guides only
- Topic × region heatmap
- Sortable, paginated insights table with row detail drawer
- Dark / light theme, loading / error / empty states, responsive layout

## 12. Build commands

```bash
npm run build
npm run start          # production API (after server build)
npm run preview --w client
```

## 13. Troubleshooting

| Issue | What to check |
|--------|----------------|
| `MongoServerError` / connection refused | MongoDB is running; `MONGODB_URI` is correct |
| Empty charts after first clone | Run `npm run import-data` |
| Frontend API errors | Backend on port 5000; CORS `CLIENT_URL` matches Vite origin |
| Duplicate records | Re-run `npm run import-data` (it replaces the collection) |
| Port in use | Change `PORT` or Vite `server.port` in `client/vite.config.ts` |

## License

Assignment / portfolio project. Dataset provided for the Blackcoffer visualization task.
