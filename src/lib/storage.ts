import type { AppDatabase } from "./types";
import { seedDatabase } from "./seed";

const STORAGE_KEY = "cpl-database-v1";

/** Kiểm tra đang chạy trên trình duyệt (có localStorage) */
const isBrowser = () => typeof window !== "undefined";

/** Đọc toàn bộ CSDL từ localStorage, tự nạp dữ liệu mẫu nếu chưa có */
export function readDB(): AppDatabase {
  if (!isBrowser()) return seedDatabase;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDatabase));
      return structuredCloneSafe(seedDatabase);
    }
    // Hợp nhất với dữ liệu mẫu để bổ sung các khóa mới (vd: siteContent)
    // cho những trình duyệt đã lưu phiên bản CSDL cũ hơn.
    const parsed = JSON.parse(raw) as Partial<AppDatabase>;
    return {
      ...structuredCloneSafe(seedDatabase),
      ...parsed,
      siteContent: {
        ...seedDatabase.siteContent,
        ...parsed.siteContent,
      },
    } as AppDatabase;
  } catch (err) {
    console.error("Không đọc được dữ liệu, dùng dữ liệu mẫu:", err);
    return structuredCloneSafe(seedDatabase);
  }
}

/** Ghi toàn bộ CSDL xuống localStorage và phát sự kiện để các tab/đồng bộ cập nhật */
export function writeDB(db: AppDatabase): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  // Thông báo cho các thành phần trong cùng tab biết dữ liệu đã đổi
  window.dispatchEvent(new CustomEvent("cpl-db-changed"));
}

/** Đặt lại toàn bộ dữ liệu về mẫu ban đầu */
export function resetDB(): AppDatabase {
  if (!isBrowser()) return seedDatabase;
  const fresh = structuredCloneSafe(seedDatabase);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  window.dispatchEvent(new CustomEvent("cpl-db-changed"));
  return fresh;
}

/** Sinh ID duy nhất đơn giản (không phụ thuộc thư viện ngoài) */
export function genId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(
    Math.random() * 1e6
  ).toString(36)}`;
}

function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const AUTH_KEY = "cpl-current-user";
