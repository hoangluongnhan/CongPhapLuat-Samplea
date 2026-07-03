"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import {
  cx,
  draftStatusLabel,
  feedbackStatusLabel,
  formatDate,
} from "@/lib/format";
import { genId } from "@/lib/storage";
import type {
  DraftStatus,
  OpenLetterContent,
  StrategicDirection,
  VisionContent,
} from "@/lib/types";

type Tab =
  | "tong-quan"
  | "tin-tuc"
  | "du-thao"
  | "phan-anh"
  | "noi-dung"
  | "he-thong";

const tabs: { key: Tab; label: string }[] = [
  { key: "tong-quan", label: "Tổng quan" },
  { key: "tin-tuc", label: "Tin tức" },
  { key: "du-thao", label: "Dự thảo" },
  { key: "phan-anh", label: "Phản ánh" },
  { key: "noi-dung", label: "Nội dung (CMS)" },
  { key: "he-thong", label: "Hệ thống" },
];

export default function AdminPage() {
  const { currentUser, ready } = useApp();
  const [tab, setTab] = useState<Tab>("tong-quan");

  // Chỉ chính quyền mới truy cập được
  if (ready && currentUser?.role !== "government") {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-xl font-bold text-slate-800">Không có quyền truy cập</h1>
        <p className="mt-2 text-slate-500">
          Trang quản trị chỉ dành cho tài khoản Chính quyền.
        </p>
        <Link href="/dang-nhap" className="btn-primary mt-4">
          Đăng nhập với tài khoản chính quyền
        </Link>
      </div>
    );
  }

  if (!ready) return <div className="container py-16">Đang tải...</div>;

  return (
    <>
      <PageHeader
        title="Trang quản trị"
        subtitle={`Xin chào ${currentUser?.fullName} - ${currentUser?.organization ?? ""}`}
      />
      <div className="container py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cx(
                "rounded-lg px-4 py-2 text-sm font-semibold",
                tab === t.key
                  ? "bg-primary-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "tong-quan" && <Overview />}
        {tab === "tin-tuc" && <NewsAdmin />}
        {tab === "du-thao" && <DraftAdmin />}
        {tab === "phan-anh" && <FeedbackAdmin />}
        {tab === "noi-dung" && <ContentAdmin />}
        {tab === "he-thong" && <SystemAdmin />}
      </div>
    </>
  );
}

function Overview() {
  const { db } = useApp();
  const stats = [
    { label: "Người dùng", value: db.users.length },
    { label: "Văn bản", value: db.documents.length },
    { label: "Dự thảo", value: db.drafts.length },
    { label: "Phản ánh", value: db.feedbacks.length },
    { label: "Tin tức", value: db.news.length },
    { label: "Trợ giúp pháp lý", value: db.legalAid.length },
  ];
  const pendingFeedback = db.feedbacks.filter((f) => f.status === "moi").length;
  const pendingAid = db.legalAid.filter((r) => !r.answer).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-extrabold text-primary-700">
              {s.value}
            </div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800">Cần xử lý</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>🆕 Phản ánh mới chưa xử lý: <b>{pendingFeedback}</b></li>
            <li>❓ Câu hỏi pháp lý chưa trả lời: <b>{pendingAid}</b></li>
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800">Văn bản xem nhiều</h3>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {[...db.documents]
              .sort((a, b) => b.views - a.views)
              .slice(0, 3)
              .map((d) => (
                <li key={d.id} className="flex justify-between gap-2">
                  <span className="line-clamp-1">{d.title}</span>
                  <span className="shrink-0 text-slate-400">{d.views}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function NewsAdmin() {
  const { db, addNews } = useApp();
  const [form, setForm] = useState({
    title: "",
    category: "Chính sách",
    excerpt: "",
    content: "",
    author: "Ban Biên tập",
    featured: false,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNews(form);
          setForm((f) => ({ ...f, title: "", excerpt: "", content: "" }));
        }}
        className="card space-y-3 p-5"
      >
        <h3 className="font-semibold text-slate-800">Đăng tin tức mới</h3>
        <div>
          <label className="label">Tiêu đề</label>
          <input required className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className="label">Chuyên mục</label>
          <input className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
        </div>
        <div>
          <label className="label">Tóm tắt</label>
          <textarea required rows={2} className="input" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
        </div>
        <div>
          <label className="label">Nội dung</label>
          <textarea required rows={4} className="input" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
          Đưa lên tin nổi bật trang chủ
        </label>
        <button type="submit" className="btn-primary">Đăng tin</button>
      </form>

      <div className="card p-5">
        <h3 className="mb-3 font-semibold text-slate-800">
          Tin đã đăng ({db.news.length})
        </h3>
        <div className="max-h-[28rem] space-y-2 overflow-y-auto scroll-thin">
          {db.news.map((n) => (
            <div key={n.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="font-medium text-slate-800">{n.title}</div>
              <div className="mt-1 text-xs text-slate-400">
                {n.category} · {formatDate(n.publishedAt)} · {n.views} lượt xem
                {n.featured && " · ⭐ Nổi bật"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DraftAdmin() {
  const { db, addDraft, updateDraftStatus } = useApp();
  const [form, setForm] = useState({
    title: "",
    agency: "",
    category: "Nghị định",
    summary: "",
    openDate: "",
    closeDate: "",
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addDraft(form);
          setForm((f) => ({ ...f, title: "", summary: "" }));
        }}
        className="card space-y-3 p-5"
      >
        <h3 className="font-semibold text-slate-800">Công bố dự thảo mới</h3>
        <div>
          <label className="label">Tên dự thảo</label>
          <input required className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Cơ quan</label>
            <input required className="input" value={form.agency} onChange={(e) => setForm((f) => ({ ...f, agency: e.target.value }))} />
          </div>
          <div>
            <label className="label">Loại</label>
            <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {["Luật", "Nghị định", "Thông tư", "Nghị quyết"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Ngày mở</label>
            <input type="date" required className="input" value={form.openDate} onChange={(e) => setForm((f) => ({ ...f, openDate: e.target.value }))} />
          </div>
          <div>
            <label className="label">Ngày đóng</label>
            <input type="date" required className="input" value={form.closeDate} onChange={(e) => setForm((f) => ({ ...f, closeDate: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Tóm tắt</label>
          <textarea required rows={3} className="input" value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
        </div>
        <button type="submit" className="btn-primary">Công bố</button>
      </form>

      <div className="card p-5">
        <h3 className="mb-3 font-semibold text-slate-800">
          Dự thảo ({db.drafts.length})
        </h3>
        <div className="max-h-[28rem] space-y-2 overflow-y-auto scroll-thin">
          {db.drafts.map((d) => (
            <div key={d.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="font-medium text-slate-800">{d.title}</div>
              <div className="mt-1 text-xs text-slate-400">
                {d.agency} · {d.comments.length} góp ý
              </div>
              <select
                value={d.status}
                onChange={(e) => updateDraftStatus(d.id, e.target.value as DraftStatus)}
                className="input mt-2 w-48 py-1 text-xs"
              >
                {(["dang-lay-y-kien", "da-dong", "da-ban-hanh"] as DraftStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {draftStatusLabel[s]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedbackAdmin() {
  const { db } = useApp();
  return (
    <div className="card p-5">
      <h3 className="mb-3 font-semibold text-slate-800">
        Danh sách phản ánh ({db.feedbacks.length})
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        Vào trang{" "}
        <Link href="/phan-anh-chinh-sach" className="text-primary-700 underline">
          Phản ánh chính sách
        </Link>{" "}
        để phản hồi trực tiếp từng mục.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="p-2">Tiêu đề</th>
              <th className="p-2">Lĩnh vực</th>
              <th className="p-2">Người gửi</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Đồng tình</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.feedbacks.map((f) => (
              <tr key={f.id}>
                <td className="p-2 font-medium text-slate-800">{f.title}</td>
                <td className="p-2 text-slate-600">{f.field}</td>
                <td className="p-2 text-slate-600">{f.authorName}</td>
                <td className="p-2 text-slate-600">
                  {feedbackStatusLabel[f.status]}
                </td>
                <td className="p-2 text-slate-600">{f.upvotes.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentAdmin() {
  const [sub, setSub] = useState<"tam-nhin" | "thu-ngo">("tam-nhin");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setSub("tam-nhin")}
          className={cx(
            "rounded-lg px-3 py-1.5 text-sm font-medium",
            sub === "tam-nhin" ? "bg-primary-100 text-primary-700" : "bg-white text-slate-600"
          )}
        >
          Tầm nhìn & định hướng
        </button>
        <button
          onClick={() => setSub("thu-ngo")}
          className={cx(
            "rounded-lg px-3 py-1.5 text-sm font-medium",
            sub === "thu-ngo" ? "bg-primary-100 text-primary-700" : "bg-white text-slate-600"
          )}
        >
          Thư ngỏ
        </button>
      </div>
      {sub === "tam-nhin" ? <VisionEditor /> : <OpenLetterEditor />}
    </div>
  );
}

function VisionEditor() {
  const { db, updateVision } = useApp();
  const [form, setForm] = useState<VisionContent>(db.siteContent.vision);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof VisionContent>(k: K, v: VisionContent[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  const setDir = (id: string, patch: Partial<StrategicDirection>) =>
    set(
      "directions",
      form.directions.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );

  const addDir = () =>
    set("directions", [
      ...form.directions,
      { id: genId("dir"), title: "", description: "", icon: "📌" },
    ]);

  const removeDir = (id: string) =>
    set("directions", form.directions.filter((d) => d.id !== id));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateVision(form);
        setSaved(true);
      }}
      className="card space-y-4 p-5"
    >
      {saved && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Đã lưu nội dung Tầm nhìn.
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Tiêu đề Tầm nhìn</label>
          <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className="label">URL hình minh họa (không bắt buộc)</label>
          <input className="input" value={form.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="label">Nội dung Tầm nhìn (cách đoạn bằng dòng trống)</label>
        <textarea rows={4} className="input" value={form.visionText} onChange={(e) => set("visionText", e.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Tiêu đề Sứ mệnh</label>
          <input className="input" value={form.missionTitle} onChange={(e) => set("missionTitle", e.target.value)} />
        </div>
        <div>
          <label className="label">Tiêu đề khu vực Định hướng</label>
          <input className="input" value={form.directionsTitle} onChange={(e) => set("directionsTitle", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Nội dung Sứ mệnh</label>
        <textarea rows={3} className="input" value={form.missionText} onChange={(e) => set("missionText", e.target.value)} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Danh sách định hướng</label>
          <button type="button" onClick={addDir} className="btn-outline text-sm">
            + Thêm định hướng
          </button>
        </div>
        <div className="space-y-3">
          {form.directions.map((d, i) => (
            <div key={d.id} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Định hướng {i + 1}</span>
                <button type="button" onClick={() => removeDir(d.id)} className="text-rose-600 hover:underline">
                  Xóa
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-[5rem_1fr]">
                <input className="input" value={d.icon} onChange={(e) => setDir(d.id, { icon: e.target.value })} placeholder="Icon" />
                <input className="input" value={d.title} onChange={(e) => setDir(d.id, { title: e.target.value })} placeholder="Tiêu đề" />
              </div>
              <textarea className="input mt-2" rows={2} value={d.description} onChange={(e) => setDir(d.id, { description: e.target.value })} placeholder="Mô tả" />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary">Lưu nội dung Tầm nhìn</button>
    </form>
  );
}

function OpenLetterEditor() {
  const { db, updateOpenLetter } = useApp();
  const [form, setForm] = useState<OpenLetterContent>(db.siteContent.openLetter);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof OpenLetterContent>(
    k: K,
    v: OpenLetterContent[K]
  ) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateOpenLetter(form);
        setSaved(true);
      }}
      className="card space-y-4 p-5"
    >
      {saved && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Đã lưu nội dung Thư ngỏ.
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Tiêu đề trang</label>
          <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className="label">Địa điểm và ngày</label>
          <input className="input" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Kính gửi</label>
        <input className="input" value={form.recipient} onChange={(e) => set("recipient", e.target.value)} />
      </div>
      <div>
        <label className="label">Nội dung thư (cách đoạn bằng dòng trống)</label>
        <textarea rows={6} className="input" value={form.body} onChange={(e) => set("body", e.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="label">Lời kết</label>
          <input className="input" value={form.closing} onChange={(e) => set("closing", e.target.value)} />
        </div>
        <div>
          <label className="label">Chức danh</label>
          <input className="input" value={form.signerTitle} onChange={(e) => set("signerTitle", e.target.value)} />
        </div>
        <div>
          <label className="label">Họ tên lãnh đạo</label>
          <input className="input" value={form.signerName} onChange={(e) => set("signerName", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">URL ảnh chân dung (không bắt buộc)</label>
          <input className="input" value={form.portraitUrl ?? ""} onChange={(e) => set("portraitUrl", e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="label">URL ảnh chữ ký (không bắt buộc)</label>
          <input className="input" value={form.signatureUrl ?? ""} onChange={(e) => set("signatureUrl", e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <button type="submit" className="btn-primary">Lưu nội dung Thư ngỏ</button>
    </form>
  );
}

function SystemAdmin() {
  const { resetData } = useApp();
  const [done, setDone] = useState(false);
  return (
    <div className="card max-w-lg p-6">
      <h3 className="font-semibold text-slate-800">Quản lý dữ liệu</h3>
      <p className="mt-2 text-sm text-slate-500">
        Toàn bộ dữ liệu được lưu trong localStorage của trình duyệt. Bạn có thể
        đặt lại về dữ liệu mẫu ban đầu (thao tác này không thể hoàn tác).
      </p>
      {done && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Đã đặt lại dữ liệu về mặc định.
        </div>
      )}
      <button
        onClick={() => {
          if (
            window.confirm(
              "Bạn chắc chắn muốn đặt lại toàn bộ dữ liệu về mặc định?"
            )
          ) {
            resetData();
            setDone(true);
          }
        }}
        className="btn mt-4 bg-rose-600 text-white hover:bg-rose-700"
      >
        Đặt lại dữ liệu mẫu
      </button>
    </div>
  );
}
