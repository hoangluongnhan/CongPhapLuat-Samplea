// Các kiểu dữ liệu dùng chung trong toàn hệ thống

/** Vai trò người dùng: người dân, doanh nghiệp, chính quyền */
export type UserRole = "citizen" | "business" | "government";

export interface User {
  id: string;
  fullName: string;
  email: string;
  /** Mật khẩu chỉ mô phỏng - KHÔNG dùng cho môi trường thật */
  password: string;
  role: UserRole;
  organization?: string; // Tên doanh nghiệp / cơ quan
  createdAt: string;
}

export type DocStatus = "con-hieu-luc" | "het-hieu-luc" | "chua-hieu-luc";

/** Văn bản quy phạm pháp luật đã ban hành */
export interface LegalDocument {
  id: string;
  soHieu: string; // Số hiệu văn bản
  title: string;
  category: string; // Luật, Nghị định, Thông tư...
  agency: string; // Cơ quan ban hành
  issuedDate: string;
  effectiveDate: string;
  status: DocStatus;
  summary: string;
  content: string;
  createdBy: string; // userId (chính quyền)
  createdAt: string;
  views: number;
}

export type DraftStatus = "dang-lay-y-kien" | "da-dong" | "da-ban-hanh";

/** Dự thảo văn bản đang lấy ý kiến */
export interface DraftDocument {
  id: string;
  title: string;
  agency: string;
  category: string;
  summary: string;
  openDate: string;
  closeDate: string;
  status: DraftStatus;
  createdBy: string;
  createdAt: string;
  comments: DraftComment[];
}

export interface DraftComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export type FeedbackStatus = "moi" | "dang-xu-ly" | "da-phan-hoi" | "da-dong";

/** Phản ánh chính sách từ người dân / doanh nghiệp */
export interface Feedback {
  id: string;
  title: string;
  field: string; // Lĩnh vực
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  status: FeedbackStatus;
  isPublic: boolean;
  createdAt: string;
  responses: FeedbackResponse[];
  upvotes: string[]; // danh sách userId đã đồng tình
}

export interface FeedbackResponse {
  id: string;
  responderId: string;
  responderName: string;
  agency: string;
  content: string;
  createdAt: string;
}

/** Tin tức - chính sách mới */
export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  featured: boolean;
  views: number;
}

/** Yêu cầu trợ giúp pháp lý */
export interface LegalAidRequest {
  id: string;
  fullName: string;
  contact: string;
  field: string;
  question: string;
  authorId?: string;
  status: "cho-tiep-nhan" | "da-tiep-nhan" | "da-tra-loi";
  answer?: string;
  createdAt: string;
}

/** Một định hướng / trụ cột phát triển chiến lược (UC2 - CPLQG-VI-002.MH02) */
export interface StrategicDirection {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji hoặc ký tự minh họa
}

/** Nội dung trang Tầm nhìn & định hướng phát triển (UC2 - CPLQG-VI-002) */
export interface VisionContent {
  title: string; // Mặc định "TẦM NHÌN"
  visionText: string;
  missionTitle: string; // Mặc định "SỨ MỆNH"
  missionText: string;
  imageUrl?: string; // Hình minh họa (không bắt buộc)
  directionsTitle: string; // Mặc định "ĐỊNH HƯỚNG PHÁT TRIỂN"
  directions: StrategicDirection[];
}

/** Nội dung trang Thư ngỏ (UC4 - CPLQG-VI-004) */
export interface OpenLetterContent {
  title: string; // Mặc định "Thư ngỏ"
  location: string; // "Hà Nội, ngày ... tháng ... năm ..."
  recipient: string; // "Kính gửi: ..."
  body: string; // Nội dung thư (các đoạn ngăn cách bằng dòng trống)
  closing: string; // "Trân trọng,"
  signerTitle: string; // Chức danh lãnh đạo
  signerName: string; // Họ tên lãnh đạo
  portraitUrl?: string; // Ảnh chân dung (không bắt buộc)
  signatureUrl?: string; // Ảnh chữ ký (không bắt buộc)
}

/** Nội dung tĩnh do quản trị viên biên soạn (mô phỏng CMS) */
export interface SiteContent {
  vision: VisionContent;
  openLetter: OpenLetterContent;
}

/** Cấu trúc toàn bộ dữ liệu lưu trong localStorage */
export interface AppDatabase {
  users: User[];
  documents: LegalDocument[];
  drafts: DraftDocument[];
  feedbacks: Feedback[];
  news: NewsArticle[];
  legalAid: LegalAidRequest[];
  siteContent: SiteContent;
}
