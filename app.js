const cloudConfig = window.STUDY_CLOUD || {};
const LOCAL_STORAGE_KEY = "nhip-hoc-state-v1";
const CLOUD_CACHE_STORAGE_KEY = "nhip-hoc-private-cache-v1";
const STORAGE_KEY = cloudConfig.enabled === true ? CLOUD_CACHE_STORAGE_KEY : LOCAL_STORAGE_KEY;
const NOTES_DATABASE_NAME = cloudConfig.enabled === true ? "nhip-hoc-private-notes" : "nhip-hoc-notes";
const LOCAL_NOTES_DATABASE_NAME = "nhip-hoc-notes";
const CLOUD_LOCAL_IMPORT_KEY = "nhip-hoc-private-local-imported-v1";
const COURSE_SUBJECTS = [
  { name: "電腦輔助實體設計", english: "CAD of Solid Design" },
  { name: "奈米材料", english: "Nanomaterials" },
  { name: "近代科學導論", english: "Introduction to Modern Science" },
  { name: "台灣社會", english: "Taiwanese Society" },
  { name: "半導體製程設備技術", english: "Semiconductor Manufacturing Equipment" },
  { name: "半導體材料與元件", english: "Semiconductor Material and Device" },
  { name: "電子學實驗(二)", english: "Electronics Lab (II)" },
  { name: "薄膜光學與鍍膜技術", english: "Optical Thin Film and Coating Technology" },
  { name: "科技英文(三)", english: "Technical English (III)" },
];
const DEFAULT_SUBJECTS = COURSE_SUBJECTS.map((subject) => subject.name);
const SUBJECT_ENGLISH = new Map(COURSE_SUBJECTS.map((subject) => [subject.name, subject.english]));
const ACADEMIC_EVENTS = [
  { start: "2026-10-05", end: "2026-11-01", title: "學分學程申請", category: "申請" },
  { start: "2026-10-09", end: "2026-10-09", title: "調整放假", detail: "國慶日（10/10）補假。", category: "假期" },
  { start: "2026-10-17", end: "2026-10-17", title: "退還 2/3 學雜費截止", detail: "適用於休學或退學學生。", category: "行政期限" },
  { start: "2026-10-17", end: "2026-10-17", title: "創校 60 週年校慶／運動會", category: "校園活動" },
  { start: "2026-10-26", end: "2026-10-26", title: "調整放假", detail: "臺灣光復節（10/25）補假。", category: "假期" },
  { start: "2026-11-02", end: "2026-11-08", title: "期中考試", detail: "期中考試期間。", category: "考試" },
  { start: "2026-11-04", end: "2026-11-04", title: "教務會議 · 導師會議", category: "教務" },
  { start: "2026-11-09", end: "2026-11-25", title: "雙主修／輔系／學程申請", category: "申請" },
  { start: "2026-11-09", end: "2026-11-25", title: "轉系申請", detail: "收件截止日：11/25。", category: "申請期限" },
  { start: "2026-11-25", end: "2026-11-25", title: "學生事務委員會會議", category: "教務" },
  { start: "2026-11-28", end: "2026-11-28", title: "退還 1/3 學雜費截止", detail: "適用於休學或退學學生。", category: "行政期限" },
  { start: "2026-11-28", end: "2026-11-28", title: "地方公職人員選舉日", category: "假期" },
  { start: "2026-11-29", end: "2026-11-29", title: "退學或休學不予退費", category: "行政期限" },
  { start: "2026-12-09", end: "2026-12-09", title: "社團評鑑日", category: "校園活動" },
  { start: "2026-12-23", end: "2026-12-23", title: "校務會議", category: "教務" },
  { start: "2026-12-24", end: "2026-12-24", title: "調整放假", detail: "創校 60 週年校慶／運動會（10/17）補假。", category: "假期" },
  { start: "2026-12-25", end: "2026-12-25", title: "行憲紀念日（放假）", category: "假期" },
];
const SCHEDULE_PERIODS = [
  { number: 1, time: "08:10–09:00" },
  { number: 2, time: "09:10–10:00" },
  { number: 3, time: "10:10–11:00" },
  { number: 4, time: "11:10–12:00" },
  { number: 5, time: "13:10–14:00" },
  { number: 6, time: "14:10–15:00" },
  { number: 7, time: "15:10–16:00" },
  { number: 8, time: "16:10–17:00" },
];
const WEEKLY_SCHEDULE = [
  { day: 1, startPeriod: 2, endPeriod: 4, subject: "電腦輔助實體設計", location: "逢春樓二樓光電多媒體及電腦教學教室" },
  { day: 1, startPeriod: 5, endPeriod: 7, subject: "半導體材料與元件", location: "明明樓四樓 409 教室" },
  { day: 2, startPeriod: 2, endPeriod: 4, subject: "奈米材料", location: "明明樓三樓 306 教室" },
  { day: 2, startPeriod: 5, endPeriod: 7, subject: "電子學實驗(二)", location: "逢春樓二樓實驗室" },
  { day: 3, startPeriod: 2, endPeriod: 4, subject: "近代科學導論", location: "明明樓五樓 508 教室" },
  { day: 3, startPeriod: 7, endPeriod: 8, subject: "科技英文(三)", location: "明明樓四樓 408 教室" },
  { day: 4, startPeriod: 1, endPeriod: 2, subject: "台灣社會", location: "明明樓四樓 406 教室" },
  { day: 4, startPeriod: 3, endPeriod: 4, subject: "半導體製程設備技術", location: "明明樓四樓 406 教室" },
  { day: 4, startPeriod: 5, endPeriod: 7, subject: "薄膜光學與鍍膜技術", location: "明明樓三樓 304 教室" },
];
const DEFAULT_STATE = {
  subjects: DEFAULT_SUBJECTS,
  sessions: [],
  calendarEvents: [],
  deletedCalendarEventIds: [],
  weeklyGoalHours: 8,
  lastModified: "",
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return structuredClone(DEFAULT_STATE);
    const sessions = Array.isArray(saved.sessions) ? saved.sessions.filter(isValidSession) : [];
    const calendarEvents = Array.isArray(saved.calendarEvents) ? saved.calendarEvents.filter(isValidCalendarEvent) : [];
    const deletedCalendarEventIds = Array.isArray(saved.deletedCalendarEventIds) ? saved.deletedCalendarEventIds.filter((id) => typeof id === "string") : [];
    const oldDefaultInUse = sessions.some((session) => session.subject === "Tự học");
    const savedSubjects = Array.isArray(saved.subjects) ? saved.subjects.filter((subject) => typeof subject === "string" && subject.trim()) : [];
    return {
      subjects: [...new Set([...DEFAULT_SUBJECTS, ...savedSubjects.filter((subject) => subject !== "Tự học" || oldDefaultInUse)])],
      sessions,
      calendarEvents,
      deletedCalendarEventIds,
      weeklyGoalHours: clampNumber(saved.weeklyGoalHours, 1, 80, 8),
      lastModified: typeof saved.lastModified === "string" ? saved.lastModified : "",
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function isValidSession(session) {
  return session && typeof session.id === "string" && typeof session.subject === "string" &&
    typeof session.date === "string" && Number.isFinite(session.durationSec) && session.durationSec > 0;
}

function isValidCalendarEvent(event) {
  return event && typeof event.id === "string" && typeof event.title === "string" && event.title.trim() &&
    typeof event.start === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.start) &&
    typeof event.end === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.end) && event.end >= event.start &&
    typeof event.category === "string";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

const state = loadState();
const byId = (id) => document.getElementById(id);
const todayKey = dateKey(new Date());
const timer = { interval: null, running: false, duration: 25 * 60, remaining: 25 * 60, startedAt: null };
let reviewWeekOffset = 0;
let scheduleWeekOffset = 0;
const notesDbPromises = new Map();
let noteImageUrls = [];
let pendingNotePreviewUrl = null;
let noteRenderToken = 0;
let recentActivityRenderToken = 0;
let cloudClient = null;
let cloudUser = null;
let cloudSyncReady = false;
let cloudDirty = false;
let cloudChangeVersion = 0;
let cloudSyncTimer = null;
let cloudSyncPromise = null;
let authHandling = Promise.resolve();

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(key) {
  const parts = key.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function mondayOf(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - weekday);
  return result;
}

function addDays(date, amount) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + amount);
  return result;
}

function formatDate(date, options = { weekday: "long", day: "numeric", month: "long" }) {
  return new Intl.DateTimeFormat("zh-TW", options).format(date);
}

function formatMinutes(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} 分鐘`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} 小時 ${remainder} 分鐘` : `${hours} 小時`;
}

function formatClock(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function saveState() {
  state.lastModified = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleCloudSync();
}

function openNotesDatabase(name = NOTES_DATABASE_NAME) {
  if (!("indexedDB" in window)) return Promise.reject(new Error("此瀏覽器不支援儲存筆記照片。"));
  if (!notesDbPromises.has(name)) {
    const databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 2);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("notes")) database.createObjectStore("notes", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("無法開啟筆記資料庫。"));
      request.onblocked = () => reject(new Error("另一個應用程式視窗正在使用筆記資料庫。"));
    });
    notesDbPromises.set(name, databasePromise);
  }
  return notesDbPromises.get(name);
}

async function getSavedNotes(databaseName = NOTES_DATABASE_NAME) {
  const database = await openNotesDatabase(databaseName);
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("notes", "readonly");
    const request = transaction.objectStore("notes").getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error || new Error("無法讀取筆記。"));
  });
}

async function putSavedNote(note) {
  const database = await openNotesDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("notes", "readwrite");
    transaction.objectStore("notes").put(note);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("無法儲存筆記。"));
    transaction.onabort = () => reject(transaction.error || new Error("筆記儲存作業已中斷。"));
  });
}

async function clearSavedNotes() {
  const database = await openNotesDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("notes", "readwrite");
    transaction.objectStore("notes").clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("無法清除本機筆記快取。"));
    transaction.onabort = () => reject(transaction.error || new Error("清除筆記快取作業已中斷。"));
  });
}

function setSyncStatus(message, status = "") {
  const element = byId("syncStatus");
  element.textContent = message;
  element.hidden = !message;
  element.className = `sync-status${status ? ` is-${status}` : ""}`;
}

function setAuthMessage(message, isError = false) {
  const element = byId("authMessage");
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function mergeSessions(localSessions, remoteSessions) {
  const sessions = new Map();
  [...(Array.isArray(remoteSessions) ? remoteSessions : []), ...(Array.isArray(localSessions) ? localSessions : [])].forEach((session) => {
    if (session && typeof session.id === "string") sessions.set(session.id, session);
  });
  return [...sessions.values()].filter(isValidSession);
}

function mergeNotes(localNotes, remoteNotes) {
  const notes = new Map();
  [...(Array.isArray(remoteNotes) ? remoteNotes : []), ...(Array.isArray(localNotes) ? localNotes : [])].forEach((note) => {
    if (!note || typeof note.id !== "string") return;
    const previous = notes.get(note.id) || {};
    notes.set(note.id, {
      ...previous,
      ...note,
      storagePath: note.storagePath || previous.storagePath || "",
      image: note.image instanceof Blob ? note.image : previous.image || null,
    });
  });
  return [...notes.values()].filter((note) => typeof note.subject === "string" && typeof note.date === "string");
}

function mergeStudyState(remoteState, importedState = null) {
  const remote = remoteState && typeof remoteState === "object" ? remoteState : {};
  const imported = importedState && typeof importedState === "object" ? importedState : {};
  const candidates = [state, remote, imported];
  let preferred = state;
  candidates.slice(1).forEach((candidate) => {
    if ((Date.parse(candidate.lastModified || "") || 0) > (Date.parse(preferred.lastModified || "") || 0)) preferred = candidate;
  });
  const remoteSubjects = [remote.subjects, imported.subjects]
    .flatMap((subjects) => Array.isArray(subjects) ? subjects : [])
    .filter((subject) => typeof subject === "string");
  state.subjects = [...new Set([...DEFAULT_SUBJECTS, ...remoteSubjects, ...state.subjects])];
  state.sessions = mergeSessions(mergeSessions(state.sessions, remote.sessions), imported.sessions);
  const events = new Map();
  const deletedEventIds = new Set([
    ...(Array.isArray(remote.deletedCalendarEventIds) ? remote.deletedCalendarEventIds : []),
    ...(Array.isArray(imported.deletedCalendarEventIds) ? imported.deletedCalendarEventIds : []),
    ...state.deletedCalendarEventIds,
  ].filter((id) => typeof id === "string"));
  [...(Array.isArray(remote.calendarEvents) ? remote.calendarEvents : []), ...(Array.isArray(imported.calendarEvents) ? imported.calendarEvents : []), ...state.calendarEvents]
    .filter(isValidCalendarEvent)
    .forEach((event) => events.set(event.id, { ...events.get(event.id), ...event }));
  state.deletedCalendarEventIds = [...deletedEventIds];
  state.calendarEvents = [...events.values()].filter((event) => !deletedEventIds.has(event.id));
  state.weeklyGoalHours = clampNumber(preferred.weeklyGoalHours, 1, 80, 8);
  const latestTimestamp = Math.max(...candidates.map((candidate) => Date.parse(candidate.lastModified || "") || 0));
  state.lastModified = latestTimestamp ? new Date(latestTimestamp).toISOString() : "";
}

async function hydrateCloudNoteImages(notes) {
  for (const note of notes) {
    if (!note.storagePath || note.image instanceof Blob) continue;
    const { data, error } = await cloudClient.storage.from("class-notes").download(note.storagePath);
    if (error) throw error;
    note.image = data;
  }
}

async function uploadLocalNoteImages(notes) {
  for (const note of notes) {
    if (!(note.image instanceof Blob) || note.storagePath) continue;
    const storagePath = `${cloudUser.id}/${note.id}`;
    const { error } = await cloudClient.storage.from("class-notes").upload(storagePath, note.image, {
      upsert: true,
      contentType: note.image.type || "application/octet-stream",
    });
    if (error) throw error;
    note.storagePath = storagePath;
    await putSavedNote(note);
  }
}

async function synchronizeCloud({ initial = false } = {}) {
  if (!cloudUser) return;
  if (cloudSyncPromise) return cloudSyncPromise;
  const versionAtStart = cloudChangeVersion;
  cloudSyncPromise = (async () => {
    if (!navigator.onLine) {
      if (initial) cloudDirty = true;
      setSyncStatus("離線 · 連線後同步", "pending");
      return;
    }
    setSyncStatus("正在同步…", "pending");
    try {
      let importedState = null;
      let importedNotes = [];
      const shouldImportLocal = cloudConfig.enabled === true && localStorage.getItem(CLOUD_LOCAL_IMPORT_KEY) !== "1";
      if (shouldImportLocal) {
        try {
          const legacy = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "null");
          if (legacy && typeof legacy === "object") {
            const sessions = Array.isArray(legacy.sessions) ? legacy.sessions.filter(isValidSession) : [];
            const legacySubjects = Array.isArray(legacy.subjects) ? legacy.subjects.filter((subject) => typeof subject === "string" && subject.trim()) : [];
            const oldDefaultInUse = sessions.some((session) => session.subject === "Tự học");
            importedState = {
              subjects: [...new Set([...DEFAULT_SUBJECTS, ...legacySubjects.filter((subject) => subject !== "Tự học" || oldDefaultInUse)])],
              sessions,
              calendarEvents: Array.isArray(legacy.calendarEvents) ? legacy.calendarEvents.filter(isValidCalendarEvent) : [],
              deletedCalendarEventIds: Array.isArray(legacy.deletedCalendarEventIds) ? legacy.deletedCalendarEventIds.filter((id) => typeof id === "string") : [],
              weeklyGoalHours: clampNumber(legacy.weeklyGoalHours, 1, 80, 8),
              lastModified: typeof legacy.lastModified === "string" ? legacy.lastModified : "",
            };
          }
          importedNotes = await getSavedNotes(LOCAL_NOTES_DATABASE_NAME);
        } catch (error) {
          throw new Error(`無法匯入這台裝置原有的筆記：${error.message || "請確認本機儲存權限。"}`);
        }
      }

      let saved = false;
      for (let attempt = 0; attempt < 3 && !saved; attempt += 1) {
        const { data: row, error: readError } = await cloudClient
          .from("study_data")
          .select("payload, updated_at")
          .eq("user_id", cloudUser.id)
          .maybeSingle();
        if (readError) throw readError;

        const localNotes = await getSavedNotes();
        const remotePayload = row?.payload && typeof row.payload === "object" ? row.payload : {};
        const notes = mergeNotes(mergeNotes(localNotes, importedNotes), remotePayload.notes);
        mergeStudyState(remotePayload.state, importedState);
        await hydrateCloudNoteImages(notes);
        for (const note of notes) await putSavedNote(note);
        await uploadLocalNoteImages(notes);

        const payload = {
          state: {
            subjects: state.subjects,
            sessions: state.sessions,
            calendarEvents: state.calendarEvents,
            deletedCalendarEventIds: state.deletedCalendarEventIds,
            weeklyGoalHours: state.weeklyGoalHours,
            lastModified: state.lastModified,
          },
          notes: notes.map((note) => ({
            id: note.id,
            subject: note.subject,
            date: note.date,
            createdAt: note.createdAt,
            text: note.text || "",
            assignment: note.assignment || "",
            storagePath: note.storagePath || "",
          })),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        const previousTimestamp = Date.parse(row?.updated_at || "") || 0;
        const updatedAt = new Date(Math.max(Date.now(), previousTimestamp + 10)).toISOString();
        if (row) {
          const { data: updatedRow, error: updateError } = await cloudClient
            .from("study_data")
            .update({ payload, updated_at: updatedAt })
            .eq("user_id", cloudUser.id)
            .eq("updated_at", row.updated_at)
            .select("user_id")
            .maybeSingle();
          if (updateError) throw updateError;
          saved = Boolean(updatedRow);
        } else {
          const { error: insertError } = await cloudClient.from("study_data").insert({
            user_id: cloudUser.id,
            payload,
            updated_at: updatedAt,
          });
          if (insertError && insertError.code !== "23505") throw insertError;
          saved = !insertError;
        }
      }
      if (!saved) throw new Error("另一台裝置剛更新了資料，請重新同步一次。");
      if (shouldImportLocal) localStorage.setItem(CLOUD_LOCAL_IMPORT_KEY, "1");
      cloudDirty = cloudChangeVersion !== versionAtStart;
      setSyncStatus(cloudDirty ? "有新資料待同步…" : "已同步", cloudDirty ? "pending" : "");
      if (cloudDirty) cloudSyncTimer = window.setTimeout(() => { synchronizeCloud(); }, 650);
    } catch (error) {
      if (initial) cloudDirty = true;
      setSyncStatus("同步失敗", "error");
      if (initial) throw error;
      console.error("Study data sync failed", error);
    }
  })();
  try {
    await cloudSyncPromise;
  } finally {
    cloudSyncPromise = null;
  }
}

function scheduleCloudSync() {
  if (!cloudSyncReady || !cloudUser) return;
  cloudDirty = true;
  cloudChangeVersion += 1;
  clearTimeout(cloudSyncTimer);
  setSyncStatus("待同步…", "pending");
  cloudSyncTimer = window.setTimeout(() => { synchronizeCloud(); }, 650);
}

async function clearPrivateCache() {
  clearNoteImageUrls();
  localStorage.removeItem(STORAGE_KEY);
  state.subjects = [...DEFAULT_SUBJECTS];
  state.sessions = [];
  state.calendarEvents = [];
  state.deletedCalendarEventIds = [];
  state.weeklyGoalHours = DEFAULT_STATE.weeklyGoalHours;
  state.lastModified = "";
  await clearSavedNotes();
}

function showAuthenticatedApp() {
  byId("authGate").hidden = true;
  byId("appShell").hidden = false;
  byId("accountEmail").textContent = cloudUser?.email || "";
  byId("accountEmail").hidden = !cloudUser;
  byId("signOutButton").hidden = !cloudUser;
  byId("authSignOutButton").hidden = true;
  byId("notesStorageNote").textContent = cloudUser
    ? "課堂筆記與照片會同步到你的私人雲端。"
    : "照片與筆記會保存在這台裝置上。";
  renderToday();
  renderReview();
  registerServiceWorker();
}

async function applyCloudSession(session) {
  if (!session) {
    const hadUnsyncedChanges = cloudDirty;
    if (cloudUser && !hadUnsyncedChanges) await clearPrivateCache();
    cloudUser = null;
    cloudSyncReady = false;
    if (cloudConfig.enabled === true) {
      byId("appShell").hidden = true;
      byId("authGate").hidden = false;
      byId("authDescription").textContent = hadUnsyncedChanges
        ? "有尚未同步的資料暫存在這台裝置。重新登入並連線後即可繼續同步。"
        : "登入後即可在手機和電腦查看同一份課堂資料。";
      byId("signInForm").hidden = false;
      byId("signOutButton").hidden = true;
      byId("authSignOutButton").hidden = true;
      byId("accountEmail").hidden = true;
      setSyncStatus("");
    }
    return;
  }

  const email = (session.user.email || "").trim().toLowerCase();
  const ownerEmail = (cloudConfig.ownerEmail || "").trim().toLowerCase();
  if (!ownerEmail || email !== ownerEmail) {
    setAuthMessage("這個學習空間只開放已設定的帳戶，請使用自己的電子郵件重新登入。", true);
    await cloudClient.auth.signOut({ scope: "local" });
    return;
  }
  if (cloudUser?.id === session.user.id && cloudSyncReady) return;

  cloudUser = session.user;
  cloudSyncReady = false;
  byId("authGate").hidden = false;
  byId("appShell").hidden = true;
  byId("authDescription").textContent = "正在載入並同步你的課堂資料……";
  byId("signInForm").hidden = true;
  try {
    await synchronizeCloud({ initial: true });
    cloudSyncReady = true;
    setAuthMessage("");
    showAuthenticatedApp();
  } catch (error) {
    byId("authDescription").textContent = "無法連線到私人資料庫。請確認網路與 Supabase 設定後再試一次。";
    byId("signInForm").hidden = false;
    byId("authSignOutButton").hidden = false;
    setAuthMessage(error.message || "同步失敗。", true);
  }
}

function queueAuthSession(session) {
  authHandling = authHandling
    .then(() => applyCloudSession(session))
    .catch((error) => {
      byId("authDescription").textContent = "無法開啟私人學習空間。";
      byId("signInForm").hidden = false;
      byId("authSignOutButton").hidden = !cloudUser;
      setAuthMessage(error.message || "登入狀態處理失敗。", true);
    });
}

async function loadSupabaseSdk() {
  if (window.supabase?.createClient) return;
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("無法載入登入服務，請確認網路連線後重新整理。"));
    document.head.appendChild(script);
  });
  if (!window.supabase?.createClient) throw new Error("登入服務沒有正確載入。");
}

async function initializeStudyApp() {
  bindEvents();
  updateTimerDisplay();
  setTimerState(false);

  if (cloudConfig.enabled !== true) {
    byId("authGate").hidden = true;
    byId("appShell").hidden = false;
    byId("notesStorageNote").textContent = "照片與筆記會保存在這台裝置上。";
    renderToday();
    renderReview();
    registerServiceWorker();
    return;
  }

  byId("appShell").hidden = true;
  byId("authGate").hidden = false;
  byId("authDescription").textContent = "輸入你的電子郵件，我們會寄送安全的登入連結。";
  const hasCredentials = Boolean(cloudConfig.supabaseUrl && cloudConfig.publishableKey && cloudConfig.ownerEmail);
  byId("signInForm").hidden = !hasCredentials;
  if (!hasCredentials) {
    byId("authDescription").textContent = "私人登入與跨裝置同步尚未完成設定。請先填入 cloud-config.js，並建立私人資料庫。";
    return;
  }
  try {
    await loadSupabaseSdk();
  } catch (error) {
    byId("signInForm").hidden = true;
    setAuthMessage(error.message || "無法載入登入服務。", true);
    return;
  }

  cloudClient = window.supabase.createClient(cloudConfig.supabaseUrl, cloudConfig.publishableKey);
  cloudClient.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => queueAuthSession(session), 0);
  });
  const { data, error } = await cloudClient.auth.getSession();
  if (error) {
    setAuthMessage(error.message || "無法讀取登入狀態。", true);
    return;
  }
  queueAuthSession(data.session);
}

function weekDays(offset = 0) {
  const thisMonday = mondayOf(new Date());
  thisMonday.setDate(thisMonday.getDate() + offset * 7);
  return Array.from({ length: 7 }, (_, index) => addDays(thisMonday, index));
}

function sessionsForDays(days) {
  const keys = new Set(days.map(dateKey));
  return state.sessions.filter((session) => keys.has(session.date));
}

function totalSeconds(sessions) {
  return sessions.reduce((sum, session) => sum + session.durationSec, 0);
}

function setView(viewName) {
  const viewIds = { today: "todayView", schedule: "scheduleView", review: "reviewView", calendar: "calendarView", notes: "notesView" };
  Object.entries(viewIds).forEach(([name, id]) => { byId(id).hidden = name !== viewName; });
  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === viewName;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (viewName === "schedule") renderSchedule();
  if (viewName === "review") renderReview();
  if (viewName === "calendar") renderAcademicCalendar();
  if (viewName === "notes") renderNotes();
  if (viewName === "today") renderToday();
}

function setTheme(theme, savePreference = true) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = selectedTheme;
  const darkMode = selectedTheme === "dark";
  document.querySelector('meta[name="theme-color"]').content = darkMode ? "#0b1120" : "#f5f7fb";
  byId("themeToggle").setAttribute("aria-label", darkMode ? "切換至淺色模式" : "切換至深色模式");
  byId("themeToggle").title = darkMode ? "淺色模式" : "深色模式";
  byId("themeToggle").setAttribute("aria-pressed", String(darkMode));
  byId("themeToggle").innerHTML = darkMode
    ? '<svg class="theme-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
    : '<svg class="theme-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z"/></svg>';
  if (savePreference) localStorage.setItem("nhip-hoc-theme", selectedTheme);
}

function renderSubjectOptions() {
  const previousFocusSubject = byId("focusSubject").value;
  const previousManualSubject = byId("manualSubject").value;
  const previousNoteSubject = byId("noteSubject")?.value;
  const selectMarkup = state.subjects.map((subject) => {
    const english = SUBJECT_ENGLISH.get(subject);
    const label = english ? `${subject} · ${english}` : subject;
    return `<option value="${escapeAttribute(subject)}">${escapeHtml(label)}</option>`;
  }).join("");
  byId("focusSubject").innerHTML = selectMarkup;
  byId("manualSubject").innerHTML = selectMarkup;
  if (state.subjects.includes(previousFocusSubject)) byId("focusSubject").value = previousFocusSubject;
  if (state.subjects.includes(previousManualSubject)) byId("manualSubject").value = previousManualSubject;
  if (byId("noteSubject")) {
    byId("noteSubject").innerHTML = selectMarkup;
    if (state.subjects.includes(previousNoteSubject)) byId("noteSubject").value = previousNoteSubject;
  }
  if (byId("noteSubjectFilter")) {
    const selected = byId("noteSubjectFilter").value || "all";
    byId("noteSubjectFilter").innerHTML = `<option value="all">所有科目</option>${selectMarkup}`;
    byId("noteSubjectFilter").value = state.subjects.includes(selected) ? selected : "all";
  }
}

function renderSubjectRows(container, sessions) {
  const totals = new Map(state.subjects.map((subject) => [subject, 0]));
  sessions.forEach((session) => totals.set(session.subject, (totals.get(session.subject) || 0) + session.durationSec));
  const rows = [...totals.entries()].filter(([, seconds]) => seconds > 0).sort((a, b) => b[1] - a[1]);
  if (!rows.length) {
    container.innerHTML = `<div class="empty-subjects">開始第一段學習，即可查看各科目時間分布。</div>`;
    return;
  }
  const maximum = Math.max(...rows.map(([, seconds]) => seconds));
  container.innerHTML = rows.map(([subject, seconds]) => `
    <div class="subject-row">
      <div class="subject-row-label"><span class="subject-dot" aria-hidden="true"></span><span class="subject-copy"><span class="subject-name">${escapeHtml(subject)}</span>${SUBJECT_ENGLISH.has(subject) ? `<span class="subject-translation">${escapeHtml(SUBJECT_ENGLISH.get(subject))}</span>` : ""}</span></div>
      <span class="subject-time">${formatMinutes(seconds)}</span>
      <div class="subject-bar" aria-label="${escapeAttribute(subject)}: ${formatMinutes(seconds)}"><span style="width:${Math.max(6, seconds / maximum * 100)}%"></span></div>
    </div>`).join("");
}

function renderSessions(container, sessions, emptyTitle, emptyText, showDate = false) {
  if (!sessions.length) {
    container.innerHTML = `<div class="empty-state"><strong>${escapeHtml(emptyTitle)}</strong>${escapeHtml(emptyText)}</div>`;
    return;
  }
  const sorted = [...sessions].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  container.innerHTML = sorted.map((session) => {
    const date = parseDate(session.date);
    const time = session.startedAt ? new Intl.DateTimeFormat("zh-TW", { hour: "2-digit", minute: "2-digit" }).format(new Date(session.startedAt)) : "";
    const subtitle = showDate ? `${formatDate(date, { weekday: "short", day: "numeric", month: "short" })} · ${time}` : `${time}${time ? " · " : ""}${formatDate(date, { day: "numeric", month: "short" })}`;
    return `<article class="session-item">
      <div class="session-main"><span class="session-mark" aria-hidden="true">◷</span><div class="session-copy"><strong>${escapeHtml(session.subject)}</strong>${SUBJECT_ENGLISH.has(session.subject) ? `<span class="subject-translation">${escapeHtml(SUBJECT_ENGLISH.get(session.subject))}</span>` : ""}<span class="session-meta">${escapeHtml(subtitle)}</span></div></div>
      <span class="session-duration">${formatMinutes(session.durationSec)}</span>
      ${session.note ? `<span class="session-note">${escapeHtml(session.note)}</span>` : ""}
    </article>`;
  }).join("");
}

function renderMiniWeek(days, sessions) {
  const byDay = new Map(days.map((day) => [dateKey(day), 0]));
  sessions.forEach((session) => byDay.set(session.date, (byDay.get(session.date) || 0) + session.durationSec));
  const maximum = Math.max(1, ...byDay.values());
  byId("miniWeek").innerHTML = days.map((day) => {
    const key = dateKey(day);
    const seconds = byDay.get(key) || 0;
    const height = seconds ? Math.max(6, seconds / maximum * 100) : 0;
    const todayClass = key === todayKey ? " is-today" : "";
    return `<div class="mini-day${todayClass}" aria-label="${formatDate(day, { weekday: "long" })}: ${formatMinutes(seconds)}">
      <div class="mini-day-bar-wrap"><span class="mini-day-bar" style="height:${height}%"></span></div>
      <span>${new Intl.DateTimeFormat("zh-TW", { weekday: "narrow" }).format(day)}</span>
    </div>`;
  }).join("");
}

function renderToday() {
  const now = new Date();
  byId("topbarDate").textContent = formatDate(now, { day: "numeric", month: "long", year: "numeric" });
  byId("todayDate").textContent = formatDate(now).toLocaleUpperCase("zh-TW");
  byId("manualDate").value = todayKey;
  byId("manualDate").max = todayKey;
  renderSubjectOptions();

  const days = weekDays(0);
  const weekSessions = sessionsForDays(days);
  const weekTotal = totalSeconds(weekSessions);
  const goalSeconds = state.weeklyGoalHours * 3600;
  const percent = Math.min(100, Math.round(weekTotal / goalSeconds * 100));
  byId("previewTotal").textContent = weekTotal ? formatMinutes(weekTotal) : "0 分鐘";
  byId("previewGoal").textContent = `/ ${state.weeklyGoalHours} 小時`;
  byId("previewProgressFill").style.width = `${percent}%`;
  byId("previewProgress").setAttribute("aria-valuenow", String(percent));
  byId("previewNote").textContent = weekTotal ? `${percent}% 已完成每週目標。` : "已記錄的學習時段會顯示在這裡。";
  renderMiniWeek(days, weekSessions);

  const todaySessions = state.sessions.filter((session) => session.date === todayKey);
  renderSubjectRows(byId("subjectPreviewList"), weekSessions);
  renderSessions(byId("todaySessionList"), todaySessions, "今天還沒有學習紀錄", "開始計時，或手動記錄已完成的學習。");
  renderUpcomingBanner();
  renderUpcomingEventList();
  renderRecentActivity();
  renderTodaySchedule();
}

function scheduledDayNumber(date) {
  return ((date.getDay() + 6) % 7) + 1;
}

function scheduledTime(block) {
  const start = SCHEDULE_PERIODS.find((period) => period.number === block.startPeriod).time.split("–")[0];
  const end = SCHEDULE_PERIODS.find((period) => period.number === block.endPeriod).time.split("–")[1];
  return start + "–" + end;
}

function scheduleNoteButton(block, date) {
  return '<button class="schedule-note-button" type="button" data-class-note data-subject="' +
    escapeAttribute(block.subject) + '" data-date="' + escapeAttribute(dateKey(date)) + '">＋ 記錄課堂</button>';
}

function renderTodaySchedule() {
  const container = byId("todayScheduleList");
  const today = new Date();
  const blocks = WEEKLY_SCHEDULE.filter((block) => block.day === scheduledDayNumber(today));
  if (!blocks.length) {
    container.innerHTML = '<div class="today-class-empty">今天沒有排定課程。可以先查看完整課表。</div>';
    return;
  }
  container.innerHTML = blocks.map((block) => {
    const english = SUBJECT_ENGLISH.get(block.subject);
    return '<article class="today-class-row">' +
      '<span class="today-class-time">' + scheduledTime(block) + '</span>' +
      '<div class="today-class-copy"><strong>' + escapeHtml(block.subject) + '</strong>' +
      (english ? '<span>' + escapeHtml(english) + '</span>' : '') +
      '<span>' + escapeHtml(block.location) + '</span></div>' +
      scheduleNoteButton(block, today) + '</article>';
  }).join("");
}

function renderSchedule() {
  const days = weekDays(scheduleWeekOffset).slice(0, 4);
  const formatDay = new Intl.DateTimeFormat("zh-TW", { weekday: "short" });
  const dateLabel = (date) => formatDate(date, { year: "numeric", month: "numeric", day: "numeric" });
  byId("scheduleWeekLabel").textContent = dateLabel(days[0]) + " – " + dateLabel(days[3]);
  byId("scheduleThisWeek").hidden = scheduleWeekOffset === 0;
  byId("scheduleTableHead").innerHTML = '<tr><th>節次／時間</th>' + days.map((day) =>
    '<th>' + formatDay.format(day) + '<span class="schedule-date">' +
    formatDate(day, { month: "numeric", day: "numeric" }) + '</span></th>'
  ).join("") + '</tr>';
  byId("scheduleTableBody").innerHTML = SCHEDULE_PERIODS.map((period) => {
    const cells = days.map((date, index) => {
      const day = index + 1;
      const block = WEEKLY_SCHEDULE.find((item) =>
        item.day === day && item.startPeriod <= period.number && item.endPeriod >= period.number
      );
      if (!block) return '<td><span class="schedule-empty-cell">—</span></td>';
      if (period.number !== block.startPeriod) return "";
      const english = SUBJECT_ENGLISH.get(block.subject);
      const endPeriod = SCHEDULE_PERIODS.find((item) => item.number === block.endPeriod);
      const timeRange = period.time.split("–")[0] + "–" + endPeriod.time.split("–")[1];
      return '<td rowspan="' + (block.endPeriod - block.startPeriod + 1) + '">' +
        '<div class="schedule-cell"><strong>' + escapeHtml(block.subject) + '</strong>' +
        (english ? '<span>' + escapeHtml(english) + '</span>' : '') +
        '<span>' + escapeHtml(block.location) + '</span>' +
        '<span>第 ' + block.startPeriod + '–' + block.endPeriod + ' 節 · ' + timeRange + '</span>' +
        scheduleNoteButton(block, date) + '</div></td>';
    }).join("");
    return '<tr><td><strong>第 ' + period.number + ' 節</strong>' + period.time + '</td>' + cells + '</tr>';
  }).join("");
}

function eventDateLabel(event) {
  const start = parseDate(event.start);
  const end = parseDate(event.end);
  if (event.start === event.end) return formatDate(start, { day: "numeric", month: "long", year: "numeric" });
  return `${formatDate(start, { day: "numeric", month: "short" })} – ${formatDate(end, { day: "numeric", month: "short", year: "numeric" })}`;
}

function allCalendarEvents() {
  return [...ACADEMIC_EVENTS, ...state.calendarEvents.map((event) => ({ ...event, custom: true }))];
}

function renderUpcomingBanner() {
  const banner = byId("upcomingEventBanner");
  const events = allCalendarEvents();
  const upcomingEvents = events.filter((event) => event.start >= todayKey).sort((a, b) => a.start.localeCompare(b.start));
  const activeEvents = events.filter((event) => event.start < todayKey && event.end >= todayKey).sort((a, b) => a.end.localeCompare(b.end));
  const event = upcomingEvents[0] || activeEvents[0];
  if (!event) {
    banner.hidden = true;
    return;
  }
  const daysUntil = Math.round((parseDate(event.start) - parseDate(todayKey)) / 86400000);
  byId("upcomingEventTitle").textContent = event.title;
  byId("upcomingEventDate").textContent = eventDateLabel(event);
  byId("upcomingCountdown").textContent = daysUntil > 0 ? `· 還有 ${daysUntil} 天` : daysUntil === 0 ? "· 今天" : "· 進行中";
  banner.hidden = false;
}

function renderUpcomingEventList() {
  const events = allCalendarEvents().filter((event) => event.end >= todayKey)
    .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title)).slice(0, 4);
  const container = byId("upcomingEventList");
  if (!events.length) {
    container.innerHTML = '<div class="empty-state"><strong>目前沒有近期日期</strong>你可以標記考試、作業或報告期限。</div>';
    return;
  }
  container.innerHTML = events.map((event) => {
    const daysUntil = Math.round((parseDate(event.start) - parseDate(todayKey)) / 86400000);
    const countdown = daysUntil > 0 ? `${daysUntil} 天後` : daysUntil === 0 ? "今天" : "進行中";
    const examClass = event.category === "考試" ? " is-exam" : "";
    return `<article class="upcoming-item${examClass}">
      <span class="upcoming-item-date">${escapeHtml(formatDate(parseDate(event.start), { month: "numeric", day: "numeric" }))}</span>
      <span class="upcoming-item-copy"><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.category)} · ${countdown}</small></span>
      ${event.category === "考試" ? '<span class="exam-indicator">考試</span>' : ""}
    </article>`;
  }).join("");
}

async function renderRecentActivity() {
  const container = byId("recentActivityList");
  const renderToken = ++recentActivityRenderToken;
  try {
    const notes = await getSavedNotes();
    if (renderToken !== recentActivityRenderToken) return;
    const items = [
      ...notes.map((note) => ({ type: "note", id: note.id, subject: note.subject, date: note.date, createdAt: typeof note.createdAt === "string" ? note.createdAt : `${note.date}T12:00:00`, text: String(note.assignment || note.text || (note.image ? "已保存課堂照片" : "課堂筆記")) })),
      ...state.sessions.map((session) => ({ type: "session", id: session.id, subject: session.subject, date: session.date, createdAt: session.startedAt || `${session.date}T12:00:00`, text: `${formatMinutes(session.durationSec)} 學習時段` })),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
    if (!items.length) {
      container.innerHTML = '<div class="empty-state"><strong>還沒有最近活動</strong>拍下課堂重點或記錄學習後，這裡會顯示最新內容。</div>';
      return;
    }
    container.innerHTML = items.map((item) => {
      const isNote = item.type === "note";
      const icon = isNote ? "▧" : "◷";
      const when = formatDate(parseDate(item.date), { month: "numeric", day: "numeric" });
      return `<button class="activity-item" type="button" ${isNote ? `data-open-saved-note="${escapeAttribute(item.id)}"` : 'data-view="review"'}>
        <span class="activity-icon${isNote ? " is-note" : ""}" aria-hidden="true">${icon}</span>
        <span class="activity-copy"><strong>${escapeHtml(item.subject)}</strong><small>${escapeHtml(item.text.slice(0, 90))}</small></span>
        <span class="activity-meta">${escapeHtml(when)}<span aria-hidden="true">→</span></span>
      </button>`;
    }).join("");
  } catch (error) {
    if (renderToken !== recentActivityRenderToken) return;
    container.innerHTML = `<div class="empty-state"><strong>無法讀取最近活動</strong>${escapeHtml(error.message || "請稍後再試。")}</div>`;
  }
}

function renderAcademicCalendar() {
  const selectedMonth = byId("eventMonth").value;
  const events = allCalendarEvents().filter((event) => {
    if (selectedMonth === "all") return true;
    const monthStart = `2026-${selectedMonth}-01`;
    const lastDay = new Date(2026, Number(selectedMonth), 0).getDate();
    const monthEnd = `2026-${selectedMonth}-${String(lastDay).padStart(2, "0")}`;
    return event.start <= monthEnd && event.end >= monthStart;
  }).sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title));

  if (!events.length) {
    byId("academicEventList").innerHTML = `<div class="empty-state"><strong>本月沒有重要日期</strong>請選擇其他月份查看校務行事。</div>`;
    return;
  }
  byId("academicEventList").innerHTML = events.map((event) => {
    const start = parseDate(event.start);
    const end = parseDate(event.end);
    const dateRange = event.start === event.end
      ? String(start.getDate())
      : `${start.getDate()}${start.getMonth() === end.getMonth() ? `–${end.getDate()}` : `/${start.getMonth() + 1}–${end.getDate()}/${end.getMonth() + 1}`}`;
    const monthLabel = event.start === event.end || start.getMonth() === end.getMonth()
      ? new Intl.DateTimeFormat("zh-TW", { month: "short" }).format(start)
      : `${new Intl.DateTimeFormat("zh-TW", { month: "short" }).format(start)} – ${new Intl.DateTimeFormat("zh-TW", { month: "short" }).format(end)}`;
    const status = event.end < todayKey ? "已結束" : event.start <= todayKey ? "進行中" : "即將到來";
    const statusClass = event.end < todayKey ? "past" : event.start <= todayKey ? "active" : "upcoming";
    return `<article class="event-item">
      <div class="event-date-box"><strong>${dateRange}</strong><span>${monthLabel}</span></div>
      <div class="event-main"><div class="event-title-row"><h3>${escapeHtml(event.title)}</h3><span class="event-status ${statusClass}">${status}</span></div>
        ${event.detail ? `<p class="event-detail">${escapeHtml(event.detail)}</p>` : ""}
        <span class="event-category">${escapeHtml(event.category)}${event.custom ? " · 個人標記" : ""}</span>
      </div>
      ${event.custom ? `<button class="event-remove" type="button" data-remove-event="${escapeAttribute(event.id)}" aria-label="刪除${escapeAttribute(event.title)}">刪除</button>` : ""}
    </article>`;
  }).join("");
}

function clearNoteImageUrls() {
  noteImageUrls.forEach((url) => URL.revokeObjectURL(url));
  noteImageUrls = [];
}

async function renderNotes() {
  const container = byId("noteList");
  const renderToken = ++noteRenderToken;
  try {
    const selectedSubject = byId("noteSubjectFilter").value;
    const allNotes = await getSavedNotes();
    if (renderToken !== noteRenderToken) return;
    clearNoteImageUrls();
    const notes = allNotes
      .filter((note) => selectedSubject === "all" || note.subject === selectedSubject)
      .sort((a, b) => b.date.localeCompare(a.date) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    if (!notes.length) {
      container.innerHTML = `<div class="empty-state"><strong>尚無課堂筆記</strong>點選「拍攝筆記」，依科目與日期儲存照片或重點摘要。</div>`;
      return;
    }
    const groups = new Map();
    notes.forEach((note) => {
      if (!groups.has(note.date)) groups.set(note.date, []);
      groups.get(note.date).push(note);
    });
    container.innerHTML = [...groups.entries()].map(([date, dayNotes]) => {
      const heading = formatDate(parseDate(date), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const cards = dayNotes.map((note) => {
        const createdAt = new Date(note.createdAt || `${date}T12:00:00`);
        const time = new Intl.DateTimeFormat("zh-TW", { hour: "2-digit", minute: "2-digit" }).format(createdAt);
        let photo = "";
        if (note.image instanceof Blob) {
          const imageUrl = URL.createObjectURL(note.image);
          noteImageUrls.push(imageUrl);
          photo = `<button class="note-photo-open" type="button" data-view-note-photo="${escapeAttribute(imageUrl)}" data-photo-caption="${escapeAttribute(note.subject)} · ${escapeAttribute(date)}"><img class="note-image" src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(note.subject)} 的課堂筆記照片，日期：${escapeAttribute(date)}" /><span>點選放大照片</span></button>`;
        }
        const english = SUBJECT_ENGLISH.get(note.subject);
        if (note.assignment) {
          photo = '<div class="note-assignment"><strong>老師交代／作業</strong><p>' +
            escapeHtml(note.assignment) + '</p></div>' + photo;
        }
        return `<article class="note-card" data-note-id="${escapeAttribute(note.id)}">
          <div class="note-card-head"><div><strong>${escapeHtml(note.subject)}</strong>${english ? `<span class="subject-translation">${escapeHtml(english)}</span>` : ""}</div><span>${time}</span></div>
          ${note.text ? `<p class="note-card-text">${escapeHtml(note.text)}</p>` : ""}
          ${photo}
        </article>`;
      }).join("");
      return `<section class="note-date-group"><h2>${escapeHtml(heading)}</h2><div class="note-cards">${cards}</div></section>`;
    }).join("");
  } catch (error) {
    if (renderToken !== noteRenderToken) return;
    clearNoteImageUrls();
    container.innerHTML = `<div class="empty-state notes-error"><strong>無法開啟筆記資料庫</strong>${escapeHtml(error.message || "請確認瀏覽器的儲存權限後再試一次。")}</div>`;
  }
}

function openNoteDialog(subject = "", date = todayKey) {
  const selectedSubject = subject || byId("focusSubject").value;
  renderSubjectOptions();
  if (state.subjects.includes(selectedSubject)) byId("noteSubject").value = selectedSubject;
  byId("noteDate").value = date;
  byId("noteDate").removeAttribute("max");
  byId("noteText").value = "";
  byId("noteAssignment").value = "";
  byId("notePhoto").value = "";
  byId("notePhotoStatus").textContent = "在手機上選擇照片，即可開啟相機或相簿。";
  byId("noteError").hidden = true;
  byId("notePreview").hidden = true;
  byId("notePreview").removeAttribute("src");
  if (pendingNotePreviewUrl) URL.revokeObjectURL(pendingNotePreviewUrl);
  pendingNotePreviewUrl = null;
  byId("noteDialog").showModal();
}

function previewNotePhoto() {
  const file = byId("notePhoto").files[0];
  byId("noteError").hidden = true;
  if (pendingNotePreviewUrl) URL.revokeObjectURL(pendingNotePreviewUrl);
  pendingNotePreviewUrl = null;
  if (!file) {
    byId("notePreview").hidden = true;
    byId("notePreview").removeAttribute("src");
    byId("notePhotoStatus").textContent = "在手機上選擇照片，即可開啟相機或相簿。";
    return;
  }
  if (!file.type.startsWith("image/")) {
    byId("noteError").textContent = "請選擇圖片檔案。";
    byId("noteError").hidden = false;
    byId("notePhoto").value = "";
    byId("notePreview").hidden = true;
    byId("notePreview").removeAttribute("src");
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    byId("noteError").textContent = "照片大小不能超過 20 MB。";
    byId("noteError").hidden = false;
    byId("notePhoto").value = "";
    byId("notePreview").hidden = true;
    byId("notePreview").removeAttribute("src");
    return;
  }
  pendingNotePreviewUrl = URL.createObjectURL(file);
  byId("notePreview").src = pendingNotePreviewUrl;
  byId("notePreview").hidden = false;
  byId("notePhotoStatus").textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
}

async function saveNote() {
  if (!byId("noteForm").reportValidity()) return;
  const photo = byId("notePhoto").files[0] || null;
  const text = byId("noteText").value.trim();
  const assignment = byId("noteAssignment").value.trim();
  if (!photo && !text && !assignment) {
    byId("noteError").textContent = "請先拍照、記下重點或輸入老師交代的作業，再儲存筆記。";
    byId("noteError").hidden = false;
    return;
  }
  const button = byId("saveNote");
  button.disabled = true;
  try {
    await putSavedNote({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject: byId("noteSubject").value,
      date: byId("noteDate").value,
      createdAt: new Date().toISOString(),
      text,
      assignment,
      image: photo,
    });
    scheduleCloudSync();
    byId("noteDialog").close();
    if (pendingNotePreviewUrl) URL.revokeObjectURL(pendingNotePreviewUrl);
    pendingNotePreviewUrl = null;
    byId("noteSubjectFilter").value = "all";
    setView("notes");
  } catch (error) {
    byId("noteError").textContent = error.message || "無法儲存筆記，請再試一次。";
    byId("noteError").hidden = false;
  } finally {
    button.disabled = false;
  }
}

function renderReview() {
  const days = weekDays(reviewWeekOffset);
  const sessions = sessionsForDays(days);
  const total = totalSeconds(sessions);
  const goalSeconds = state.weeklyGoalHours * 3600;
  const percent = Math.min(100, Math.round(total / goalSeconds * 100));
  const start = days[0];
  const end = days[6];
  const monthFormatter = new Intl.DateTimeFormat("zh-TW", { month: "long" });
  let label = `${start.getDate()} – ${end.getDate()} ${monthFormatter.format(end)}`;
  if (start.getMonth() !== end.getMonth()) label = `${start.getDate()} ${monthFormatter.format(start)} – ${end.getDate()} ${monthFormatter.format(end)}`;
  byId("reviewWeekLabel").textContent = label;
  byId("reviewDateLabel").textContent = `本週 ${label}`;
  byId("reviewTotal").textContent = total ? formatMinutes(total) : "0 分鐘";
  byId("reviewGoalCaption").textContent = `目標：${state.weeklyGoalHours} 小時`;
  byId("reviewSessionCount").textContent = String(sessions.length);
  byId("reviewActiveDays").textContent = `${new Set(sessions.map((session) => session.date)).size}/7`;
  byId("reviewProgressLabel").textContent = `${percent}% 每週目標`;
  byId("reviewProgressFill").style.width = `${percent}%`;
  byId("reviewProgress").setAttribute("aria-valuenow", String(percent));
  renderWeekChart(days, sessions);
  renderSubjectRows(byId("reviewSubjectList"), sessions);
  renderSessions(byId("reviewSessionList"), sessions, "本週尚無學習時段", "本週的學習時段會顯示在這裡。", true);
  byId("nextWeek").disabled = reviewWeekOffset >= 0;
  byId("nextWeek").setAttribute("aria-disabled", String(reviewWeekOffset >= 0));
  byId("nextWeek").style.opacity = reviewWeekOffset >= 0 ? ".45" : "1";
  byId("goToThisWeek").hidden = reviewWeekOffset === 0;
}

function renderWeekChart(days, sessions) {
  const totals = new Map(days.map((day) => [dateKey(day), 0]));
  sessions.forEach((session) => totals.set(session.date, (totals.get(session.date) || 0) + session.durationSec));
  const maxMinutes = Math.max(60, ...[...totals.values()].map((seconds) => seconds / 60));
  byId("weekChart").innerHTML = days.map((day) => {
    const key = dateKey(day);
    const seconds = totals.get(key) || 0;
    const minutes = Math.round(seconds / 60);
    const height = seconds ? Math.max(5, seconds / 60 / maxMinutes * 100) : 0;
    const todayClass = key === todayKey ? " is-today" : "";
    const dayName = new Intl.DateTimeFormat("zh-TW", { weekday: "short" }).format(day).replace(" ", "");
    return `<div class="chart-day${todayClass}" aria-label="${formatDate(day, { weekday: "long", day: "numeric" })}: ${minutes} 分鐘">
      <div class="chart-bar-wrap"><span class="chart-bar" style="height:${height}%">${minutes ? `<span class="chart-value">${minutes}</span>` : ""}</span></div>
      <span>${dayName}</span>
    </div>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function updateTimerDisplay() {
  byId("timerDisplay").textContent = formatClock(timer.remaining);
  const progress = timer.duration ? 1 - timer.remaining / timer.duration : 0;
  const circumference = 2 * Math.PI * 78;
  byId("timerProgress").style.strokeDasharray = String(circumference);
  byId("timerProgress").style.strokeDashoffset = String(circumference * progress);
  byId("timerRing").setAttribute("aria-label", `剩餘 ${formatClock(timer.remaining)}`);
}

function setTimerState(running) {
  timer.running = running;
  byId("timerStart").hidden = running || timer.startedAt !== null;
  byId("timerPause").hidden = timer.startedAt === null;
  byId("timerFinish").hidden = timer.startedAt === null;
  byId("focusSubject").disabled = timer.startedAt !== null;
  byId("focusDuration").disabled = timer.startedAt !== null;
  byId("timerPause").innerHTML = running ? '<span aria-hidden="true">Ⅱ</span> 暫停' : '<span aria-hidden="true">▶</span> 繼續';
  byId("timerStatus").textContent = running ? "專注中，按照自己的步調繼續學習。" : timer.startedAt !== null ? "學習時段已暫停。" : "短時間專注，也能為今天開個好頭。";
}

function startTimer() {
  if (timer.startedAt === null) {
    timer.duration = Number(byId("focusDuration").value) * 60;
    timer.remaining = timer.duration;
    timer.startedAt = new Date().toISOString();
  }
  setTimerState(true);
  clearInterval(timer.interval);
  timer.interval = window.setInterval(() => {
    timer.remaining = Math.max(0, timer.remaining - 1);
    updateTimerDisplay();
    if (timer.remaining === 0) finishTimer(true);
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer.interval);
  timer.interval = null;
  setTimerState(false);
}

function finishTimer(completed = false) {
  clearInterval(timer.interval);
  timer.interval = null;
  const durationSec = Math.max(0, timer.duration - timer.remaining);
  if (durationSec > 0) {
    state.sessions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject: byId("focusSubject").value,
      date: dateKey(new Date()),
      startedAt: timer.startedAt,
      durationSec,
      note: "",
    });
    saveState();
  }
  timer.startedAt = null;
  timer.running = false;
  timer.duration = Number(byId("focusDuration").value) * 60;
  timer.remaining = timer.duration;
  updateTimerDisplay();
  setTimerState(false);
  byId("timerStatus").textContent = durationSec > 0
    ? `${completed ? "已完成" : "已儲存"}學習時段 · ${formatMinutes(durationSec)}。休息一下吧。`
    : "學習時間為 0，因此尚未儲存。";
  renderToday();
  if (!byId("reviewView").hidden) renderReview();
}

function openSessionDialog() {
  byId("manualDate").value = todayKey;
  byId("manualMinutes").value = "30";
  byId("manualNote").value = "";
  byId("sessionDialog").showModal();
}

function saveManualSession() {
  const form = byId("sessionForm");
  if (!form.reportValidity()) return;
  const minutes = clampNumber(byId("manualMinutes").value, 1, 1440, 30);
  state.sessions.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    subject: byId("manualSubject").value,
    date: byId("manualDate").value,
    startedAt: new Date(`${byId("manualDate").value}T12:00:00`).toISOString(),
    durationSec: minutes * 60,
    note: byId("manualNote").value.trim(),
  });
  saveState();
  byId("sessionDialog").close();
  renderToday();
  renderReview();
}

function saveSubject() {
  const input = byId("newSubjectName");
  const name = input.value.trim();
  if (!name) return input.reportValidity();
  if (state.subjects.some((subject) => subject.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    input.setCustomValidity("此科目已存在。");
    input.reportValidity();
    input.setCustomValidity("");
    return;
  }
  state.subjects.push(name);
  saveState();
  byId("subjectDialog").close();
  input.value = "";
  renderToday();
}

function openGoalDialog() {
  byId("weeklyGoalInput").value = String(state.weeklyGoalHours);
  byId("goalDialog").showModal();
}

function openEventDialog() {
  byId("eventTitleInput").value = "";
  byId("eventStartInput").value = todayKey;
  byId("eventEndInput").value = "";
  byId("eventEndInput").min = todayKey;
  byId("eventCategoryInput").value = "考試";
  byId("eventDetailInput").value = "";
  byId("eventError").hidden = true;
  byId("eventDialog").showModal();
}

function saveCalendarEvent() {
  const form = byId("eventForm");
  if (!form.reportValidity()) return;
  const start = byId("eventStartInput").value;
  const end = byId("eventEndInput").value || start;
  if (end < start) {
    byId("eventError").textContent = "結束日期不能早於開始日期。";
    byId("eventError").hidden = false;
    return;
  }
  state.calendarEvents.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    start,
    end,
    title: byId("eventTitleInput").value.trim(),
    detail: byId("eventDetailInput").value.trim(),
    category: byId("eventCategoryInput").value,
  });
  saveState();
  byId("eventDialog").close();
  renderAcademicCalendar();
  renderToday();
}

async function openSavedNote(noteId) {
  const notes = await getSavedNotes();
  const note = notes.find((item) => item.id === noteId);
  if (!note) return;
  byId("noteSubjectFilter").value = note.subject;
  setView("notes");
  await renderNotes();
  const card = [...document.querySelectorAll("[data-note-id]")].find((item) => item.dataset.noteId === noteId);
  if (card) {
    card.classList.add("note-card-highlight");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => card.classList.remove("note-card-highlight"), 1800);
  }
}

function openPhotoViewer(imageUrl, caption) {
  byId("photoViewerImage").src = imageUrl;
  byId("photoViewerCaption").textContent = caption;
  byId("photoViewerDialog").showModal();
}

function saveGoal() {
  const input = byId("weeklyGoalInput");
  if (!input.reportValidity()) return;
  state.weeklyGoalHours = clampNumber(input.value, 1, 80, 8);
  saveState();
  byId("goalDialog").close();
  renderToday();
  renderReview();
}

function bindEvents() {
  setTheme(document.documentElement.dataset.theme || "light", false);
  byId("themeToggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) setView(viewButton.dataset.view);
  });
  document.querySelectorAll("[data-open-session]").forEach((button) => button.addEventListener("click", openSessionDialog));
  document.querySelectorAll("[data-open-note]").forEach((button) => button.addEventListener("click", () => openNoteDialog()));
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-add-subject]")) byId("subjectDialog").showModal();
  });
  document.addEventListener("click", (event) => {
    const classNoteButton = event.target.closest("[data-class-note]");
    if (classNoteButton) openNoteDialog(classNoteButton.dataset.subject, classNoteButton.dataset.date);
  });
  document.addEventListener("click", (event) => {
    const savedNoteButton = event.target.closest("[data-open-saved-note]");
    if (savedNoteButton) openSavedNote(savedNoteButton.dataset.openSavedNote).catch((error) => console.error("Could not open saved note", error));
    const photoButton = event.target.closest("[data-view-note-photo]");
    if (photoButton) openPhotoViewer(photoButton.dataset.viewNotePhoto, photoButton.dataset.photoCaption || "");
    const removeEventButton = event.target.closest("[data-remove-event]");
    if (removeEventButton) {
      const deletedId = removeEventButton.dataset.removeEvent;
      state.calendarEvents = state.calendarEvents.filter((item) => item.id !== deletedId);
      state.deletedCalendarEventIds = [...new Set([...state.deletedCalendarEventIds, deletedId])];
      saveState();
      renderAcademicCalendar();
      renderToday();
    }
  });
  byId("schedulePreviousWeek").addEventListener("click", () => { scheduleWeekOffset -= 1; renderSchedule(); });
  byId("scheduleNextWeek").addEventListener("click", () => { scheduleWeekOffset += 1; renderSchedule(); });
  byId("scheduleThisWeek").addEventListener("click", () => { scheduleWeekOffset = 0; renderSchedule(); });
  byId("timerStart").addEventListener("click", startTimer);
  byId("timerPause").addEventListener("click", () => timer.running ? pauseTimer() : startTimer());
  byId("timerFinish").addEventListener("click", () => finishTimer(false));
  byId("focusDuration").addEventListener("change", () => {
    if (timer.startedAt !== null) return;
    timer.duration = Number(byId("focusDuration").value) * 60;
    timer.remaining = timer.duration;
    updateTimerDisplay();
  });
  byId("saveManualSession").addEventListener("click", saveManualSession);
  byId("notePhoto").addEventListener("change", previewNotePhoto);
  byId("saveNote").addEventListener("click", saveNote);
  byId("noteSubjectFilter").addEventListener("change", renderNotes);
  byId("signInForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!byId("signInForm").reportValidity() || !cloudClient) return;
    const email = byId("authEmail").value.trim().toLowerCase();
    const ownerEmail = (cloudConfig.ownerEmail || "").trim().toLowerCase();
    if (email !== ownerEmail) {
      setAuthMessage("請使用這個私人學習空間設定的電子郵件。", true);
      return;
    }
    const button = byId("signInButton");
    button.disabled = true;
    setAuthMessage("正在寄送登入連結……");
    try {
      const { error } = await cloudClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
          shouldCreateUser: false,
        },
      });
      if (error) throw error;
      setAuthMessage("登入連結已寄出。請開啟電子郵件，並在此裝置完成登入。請檢查垃圾郵件匣。 ");
    } catch (error) {
      setAuthMessage(error.message || "無法寄送登入連結，請再試一次。", true);
    } finally {
      button.disabled = false;
    }
  });
  byId("signOutButton").addEventListener("click", async () => {
    if (!cloudClient) return;
    byId("signOutButton").disabled = true;
    try {
      clearTimeout(cloudSyncTimer);
      if (cloudDirty) await synchronizeCloud();
      if (cloudDirty) {
        setSyncStatus("仍有資料未同步", "error");
        return;
      }
      const { error } = await cloudClient.auth.signOut({ scope: "local" });
      if (error) setSyncStatus("登出失敗", "error");
    } finally {
      byId("signOutButton").disabled = false;
    }
  });
  byId("authSignOutButton").addEventListener("click", async () => {
    if (!cloudClient) return;
    byId("authSignOutButton").disabled = true;
    const { error } = await cloudClient.auth.signOut({ scope: "local" });
    if (error) setAuthMessage(error.message || "無法登出。", true);
    byId("authSignOutButton").disabled = false;
  });
  window.addEventListener("online", () => scheduleCloudSync());
  window.addEventListener("offline", () => {
    if (cloudUser) setSyncStatus("離線 · 連線後同步", "pending");
  });
  byId("eventMonth").addEventListener("change", renderAcademicCalendar);
  byId("openEventDialog").addEventListener("click", openEventDialog);
  byId("saveCalendarEvent").addEventListener("click", saveCalendarEvent);
  byId("eventStartInput").addEventListener("change", () => { byId("eventEndInput").min = byId("eventStartInput").value; });
  byId("closePhotoViewer").addEventListener("click", () => byId("photoViewerDialog").close());
  byId("photoViewerDialog").addEventListener("click", (event) => {
    if (event.target === byId("photoViewerDialog")) byId("photoViewerDialog").close();
  });
  byId("openSubjectDialog").addEventListener("click", () => byId("subjectDialog").showModal());
  byId("saveSubject").addEventListener("click", saveSubject);
  byId("openGoalSettings").addEventListener("click", openGoalDialog);
  byId("reviewGoalButton").addEventListener("click", openGoalDialog);
  byId("saveGoal").addEventListener("click", saveGoal);
  byId("previousWeek").addEventListener("click", () => { reviewWeekOffset -= 1; renderReview(); });
  byId("nextWeek").addEventListener("click", () => { if (reviewWeekOffset < 0) reviewWeekOffset += 1; renderReview(); });
  byId("goToThisWeek").addEventListener("click", () => { reviewWeekOffset = 0; renderReview(); });
  ["sessionDialog", "subjectDialog", "goalDialog", "noteDialog", "eventDialog"].forEach((id) => {
    byId(id).addEventListener("click", (event) => {
      if (event.target === byId(id)) byId(id).close();
    });
  });
  byId("noteDialog").addEventListener("close", () => {
    if (pendingNotePreviewUrl) URL.revokeObjectURL(pendingNotePreviewUrl);
    pendingNotePreviewUrl = null;
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

initializeStudyApp().catch((error) => {
  byId("authGate").hidden = false;
  byId("appShell").hidden = true;
  byId("authDescription").textContent = "無法開啟學習空間。請重新整理，或確認雲端設定。";
  setAuthMessage(error.message || "應用程式初始化失敗。", true);
});

