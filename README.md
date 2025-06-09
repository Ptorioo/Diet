# Dietogether

## 專案介紹

本專案以「交通成本限制下的用餐決策」為切入點，針對大學生面臨的用餐猶豫問題提出系統性解決方案。我們結合使用者訪談與情境洞察，設計出能即時考量天氣、位置與偏好的推薦系統，並透過 Rapidfire 類別選擇機制有效降低使用者認知負擔。在兩輪使用者測試中，系統整體操作流程獲得正向回饋，亦透過迭代修正強化了推薦邏輯與互動體驗。

---

## 運行方法
### 本機前後端開發（Dev Build）
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### 前端 Production Build
```bash
npm run build
npm run start
```

### 使用 Docker
```bash
docker compose up --build -d
```

使用瀏覽器開啟 `http://localhost:3000`，即可在本機運行 Dietogether；後端位址則預設為 `http://localhost:3001`。

---

## 設定
### 資料庫
請於 PostgreSQL 創建 dietogether 資料庫，並使用 `backend/database/backup_0609.backup` 輸入資料。

### secrets - 後端
由於本專案使用 PostgreSQL 遠端資料庫連線，並使用 Google Maps Routes Matrix API 與 Visual Crossing Weather API，
需要設定以下環境變數：

```env
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
GOOGLE_MAPS_API_KEY=
VISUALCROSSING_API_KEY=
```
請將以上變數撰寫於 `secrets.env` 並放在 `backend/` 資料夾。

### secrets - 前端
此外，前端需要請求 API 之位址，因此請將下列變數撰寫於 `.env` 並置於 `frontend/` 資料夾。
若在本機進行測試，API 之位址填入 `"http://localhost:3001"` 即可。

```env
NEXT_PUBLIC_APP_API_URL=
```

---

## Dependencies
整體建議使用 `Node.js >= 22.16.0`、`npm >= 10.9.2`。

### Backend
除了安裝 PostgreSQL 以外，使用 `npm install` 即可。
- `express`
- `pg` (PostgreSQL)
- `dotenv`, `axios`, `cors`

### Frontend
使用 `npm install` 即可。
- `next` with Turbopack
- `@radix-ui` (UI components)
- `react-hook-form`
- `jest`, `eslint`, `typescript`

---

## 開發指令
- Backend Dev Server: `npm run dev`
- Frontend Dev Server: `npm run dev`
- Lint: `npm run lint`
- Type Check: `npm run typecheck`
- Test（Jest 單元測試）: `npm run test`

---

## 主要貢獻者

- **B11705030 嚴邦華**
- **B11705060 盧沛宏**
- B11705034 蔡逸芃
- B11705050 林稚翔
- B11705002 余沛殷
- B11705003 蔡炘誼
- B11705035 劉至軒