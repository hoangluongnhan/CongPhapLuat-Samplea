import type {
  DocStatus,
  DraftStatus,
  FeedbackStatus,
  UserRole,
} from "./types";

/** Định dạng ngày kiểu Việt Nam: dd/MM/yyyy */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Định dạng ngày giờ đầy đủ */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const roleLabel: Record<UserRole, string> = {
  citizen: "Người dân",
  business: "Doanh nghiệp",
  government: "Chính quyền",
};

export const roleBadgeClass: Record<UserRole, string> = {
  citizen: "bg-emerald-100 text-emerald-700",
  business: "bg-amber-100 text-amber-700",
  government: "bg-primary-100 text-primary-700",
};

export const docStatusLabel: Record<DocStatus, string> = {
  "con-hieu-luc": "Còn hiệu lực",
  "het-hieu-luc": "Hết hiệu lực",
  "chua-hieu-luc": "Chưa hiệu lực",
};

export const docStatusClass: Record<DocStatus, string> = {
  "con-hieu-luc": "bg-emerald-100 text-emerald-700",
  "het-hieu-luc": "bg-rose-100 text-rose-700",
  "chua-hieu-luc": "bg-slate-100 text-slate-600",
};

export const draftStatusLabel: Record<DraftStatus, string> = {
  "dang-lay-y-kien": "Đang lấy ý kiến",
  "da-dong": "Đã đóng",
  "da-ban-hanh": "Đã ban hành",
};

export const draftStatusClass: Record<DraftStatus, string> = {
  "dang-lay-y-kien": "bg-primary-100 text-primary-700",
  "da-dong": "bg-slate-100 text-slate-600",
  "da-ban-hanh": "bg-emerald-100 text-emerald-700",
};

export const feedbackStatusLabel: Record<FeedbackStatus, string> = {
  moi: "Mới",
  "dang-xu-ly": "Đang xử lý",
  "da-phan-hoi": "Đã phản hồi",
  "da-dong": "Đã đóng",
};

export const feedbackStatusClass: Record<FeedbackStatus, string> = {
  moi: "bg-sky-100 text-sky-700",
  "dang-xu-ly": "bg-amber-100 text-amber-700",
  "da-phan-hoi": "bg-emerald-100 text-emerald-700",
  "da-dong": "bg-slate-100 text-slate-600",
};

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
