# Sam Reading — CLAUDE.md

## 專案簡介

珊珊書評（Sam's World）個人部落格，使用 Nuxt 4 + Tailwind CSS 4 + MongoDB (Mongoose) 建置，部署於 Vercel，靜態資源放在 Cloudflare R2。

## 技術棧

- **框架**：Nuxt 4（`nuxt@^4.x`）
- **樣式**：Tailwind CSS 4（透過 `@tailwindcss/vite` 整合）
- **資料庫**：MongoDB via Mongoose 7.6.1，連線透過 Nitro plugin（`server/db/index.js`）
- **套件管理**：pnpm
- **部署**：Vercel（`nitro.preset: 'vercel'`）
- **儲存**：Cloudflare R2（AWS S3 compatible）

## 分支與修改原則

**一律在 `main` 分支上直接進行修改，不要手動建立額外分支或 worktree。**
Desktop App 可能會自動建立 worktree 環境，但所有完成的變更都應該提交並推回 `main`。

## 開發指令

```bash
pnpm dev          # 啟動開發伺服器（port 3000）
pnpm build        # 建置
pnpm generate     # 靜態生成
pnpm preview      # 預覽 build 結果
```

## 環境變數

所有 secret 透過 `.env` 管理，勿 commit 至 git：

- `MONGODB_URI` — MongoDB Atlas 連線字串
- `CLOUDFLARE_STORAGE_*` — R2 存取金鑰與設定
- `NUXT_PUBLIC_*` — 公開的網站設定（名稱、描述、URL 等）

## 程式碼慣例

- 語言：繁體中文（zh-Hant-TW）
- API routes 放在 `server/api/`
- 頁面放在 `app/pages/`
- 元件放在 `app/components/`
- 能用 `useAsyncData` 的地方優先使用，確保 SSR 正常運作
- `/api/articles` 查詢時用 `.select()` 排除 `content` 和 `comments`，避免回傳過大
- `about` 資料的 `useAsyncData` key 統一使用 `'about'`
