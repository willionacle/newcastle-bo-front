# RP Back-Office Frontend

Admin/back-office for the RP (RoyPay) online betting platform — members, payments, betting logs,
settlements, agents/commission, promotions, providers. Operator-facing, Korean UI by default (now
translatable to English/Filipino). Developer communication is in English.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 7 (esbuild minify, `esbuild.drop` for console/debugger) |
| UI | **Ant Design 5** (`antd`, `@ant-design/icons`, `@ant-design/plots`) |
| Data fetching | **SWR** |
| State | Zustand |
| i18n | **i18next + react-i18next + i18next-browser-languagedetector** |
| Routing | react-router-dom 6 |
| HTTP | Axios |
| Charts | chart.js + react-chartjs-2, `@ant-design/plots` |
| Tables/DnD | antd Table, `@dnd-kit/*` |
| Date | dayjs (utc + timezone plugins) |

## Run

```bash
npm install
npm run dev          # vite --mode develop (loads .env + .env.develop)
npm run dev-staging  # --mode staging
npm run build        # tsc && vite build
npm run lint
```

API base URLs / config come from `VITE_`-prefixed env vars (bundled into the client — never put true
secrets here). Auth token is attached per-request as `Authorization: Bearer <token>`.

## Directory Structure

```
src/
├── api/         # endpoint hooks (SWR) + axios wrapper (api/axios)
├── components/  # shared UI (tables, tags, ChangePaymentState, CommaNumber, UserAvatar, LanguageSwitcher…)
├── hooks/       # useMenu (sidebar), useSort, useDeleteItem, …
├── i18n/        # i18n.ts + locales/{ko,en,fil}.json (bundled translations)
├── layout/      # Layout, header/ (Header, HeaderItem*, UserAvatar), sideNav/
├── pages/       # one folder per feature (payment, user, agent, promotion, system, sports-v3, statistic…)
├── provider/    # configProviderProps.tsx (antd ConfigProvider — theme + locale sync)
├── router/      # router.tsx (routes, ConfigProvider wrapper)
└── store/       # Zustand stores (user.store, …)
```

## Conventions

- **Tables/forms are Ant Design.** Columns, `Form.Item` labels, and menus mostly use `t()` already.
- **Toasts** use antd `message.*` / `notification.*`. User-visible status messages should use `t()`;
  **server-provided text stays verbatim** (`res.data.message`, `err.response?.data?.message`).
- All planning/specs for the active **Sports Integration (TiketPay v3)** feature live in
  `../.claude/plans/sports-integration/` (admin views are under `pages/sports-v3/`).

## Internationalization (i18n)

Supports **English / Filipino / Korean** (browser-default, persisted). Setup in
[`src/i18n/i18n.ts`](src/i18n/i18n.ts): **bundled** locale JSON imported from
[`src/i18n/locales/`](src/i18n/locales/) (`ko.json` / `en.json` / `fil.json`) — ready synchronously
before first render (no flicker; do **not** reintroduce http-backend / `public/locales`).

- **Detection:** `["localStorage","navigator"]`, key `i18nextLng`, `fallbackLng:"en"` (keep `en`
  complete), `tl`→`fil`, `react.useSuspense:false`. Init imported in `main.tsx`.
- **antd locale sync:** [`src/provider/configProviderProps.tsx`](src/provider/configProviderProps.tsx)
  maps `i18n.language` → antd locale (`ko`→ko_KR, `fil`/`en`→en_US) and relabels reactively — no remount.
- **Toggle:** [`src/components/LanguageSwitcher.tsx`](src/components/LanguageSwitcher.tsx) (antd Select)
  in the header `UserAvatar`.
- **Keys are nested** (`sidemenu.tn001`, `deposit.de002`, `toast.*`, `validation.*`, `global.*`). Add new
  copy to **all three** files; keep `en` complete.
- **⚠️ Anti-pattern to avoid/fix:** `t("한글literal")` — passing a Korean string as the *key*. It silently
  renders Korean in en/fil (the key doesn't exist → falls back to itself). Always use a real key
  (`t("ns.key")`) and add it to the locale files.
- **Live toggle (reactivity):** components that call the i18next **singleton** `i18next.t()` (table column
  builders, charts, `api/*` message helpers) don't re-render on language change. Fixed *in place* (no
  remount → no flicker/refetch) by [`LangReactive`](src/i18n/LangReactive.tsx): it subscribes to the
  language and returns a fresh `cloneElement` only when it changes, defeating React's same-element bail-out.
  `wrapRoutes()` in [`router.tsx`](src/router/router.tsx) wraps every route `element` for page-body
  reactivity; `Layout` already calls `useTranslation()` (chrome); antd labels relabel via ConfigProvider.
  **Do not remove `LangReactive`/`wrapRoutes`** without another mechanism.
- **Status:** rollout is phased; tracker at [`../.claude/plans/i18n-translation/`](../.claude/plans/i18n-translation/)
  (`PROGRESS.md` is the living checklist).
