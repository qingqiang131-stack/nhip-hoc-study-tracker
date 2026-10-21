# 學習節奏

繁體中文學習追蹤 PWA，支援桌面與手機。包含每週課表、2026 校務行事曆、學習計時，以及按科目和日期保存的課堂照片、重點摘要與作業。

## 本機預覽

目前 `cloud-config.js` 的 `enabled` 設為 `false`，所以直接開啟 `index.html` 會使用本機模式。學習紀錄保存在瀏覽器儲存空間，照片和筆記保存在 IndexedDB；本機模式不會跨裝置同步。

## 設定私人登入與跨裝置同步

應用使用 Supabase Email Magic Link 登入、Postgres 儲存學習紀錄，以及私人 Storage bucket 儲存照片。同步後，手機和電腦登入相同電子郵件帳戶即可看到同一份內容。

1. 建立 Supabase 專案，並在 Authentication 的 Users 頁面新增自己的帳戶。停用公開註冊，讓應用只接受已建立的帳戶。
2. 在 Supabase 專案的 Connect 視窗取得 Project URL 和 Publishable key，填入 `cloud-config.js` 的 `supabaseUrl` 和 `publishableKey`；將 `ownerEmail` 設為該帳戶的電子郵件，然後將 `enabled` 改成 `true`。
3. 開啟 `supabase/schema.sql`，把每個 `your_email_here` 換成自己的電子郵件（小寫），再於 Supabase SQL Editor 執行整份 SQL。此檔會建立學習紀錄資料表、私人照片 bucket，以及只允許該帳戶存取的 RLS 規則。
4. 在 Supabase Authentication 的 URL Configuration 加入網站網址，讓登入郵件可以安全地返回應用。
5. 將檔案部署到 HTTPS 網站。手機可以從瀏覽器安裝 PWA；兩台裝置都要使用相同網站網址並登入相同帳戶。

用戶端只能使用 Publishable key；不可把 Secret key 或舊版 `service_role` key 放進 `cloud-config.js`。資料庫和照片存取由 RLS 與私人 bucket 控制。

## GitHub 與網站隱私

原始碼已放在 [Private repository](https://github.com/qingqiang131-stack/nhip-hoc-study-tracker)。一般 GitHub Pages 網址仍可公開連線，即使它顯示登入畫面；這個版本會在登入前隱藏學習內容，並由 Supabase 規則保護筆記與照片。若要讓網站網址本身也只供已授權者連線，需使用 GitHub Enterprise Cloud 的私有 Pages，或使用有存取控制的託管服務。

尚未設定 Supabase 專案或正式網站網址，因此 `cloud-config.js` 仍保持 `enabled: false`；設定完成前不要公開部署。一般 GitHub Pages 網址即使來源 repository 是 Private，網站仍可能公開。若只使用 Private repository 而不公開部署，程式碼和課程表不會向公眾開放。本機與雲端資料使用不同的瀏覽器儲存空間。首次登入時，應用會將這台裝置原有的學習時段和筆記匯入雲端；之後新建的內容會在網路可用時同步。
