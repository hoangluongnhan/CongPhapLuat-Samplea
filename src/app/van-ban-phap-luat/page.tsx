"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import {
  cx,
  docStatusClass,
  docStatusLabel,
  formatDate,
} from "@/lib/format";
import type { DocStatus } from "@/lib/types";

const categories = ["Tất cả", "Luật", "Nghị định", "Thông tư", "Nghị quyết"];

function DocsInner() {
  const { db, currentUser, addDocument } = useApp();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("Tất cả");
  const [status, setStatus] = useState<"all" | DocStatus>("all");
  const [showForm, setShowForm] = useState(false);

  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return db.documents.filter((d) => {
      const matchKw =
        !kw ||
        d.title.toLowerCase().includes(kw) ||
        d.soHieu.toLowerCase().includes(kw) ||
        d.summary.toLowerCase().includes(kw) ||
        d.agency.toLowerCase().includes(kw);
      const matchCat = category === "Tất cả" || d.category === category;
      const matchStatus = status === "all" || d.status === status;
      return matchKw && matchCat && matchStatus;
    });
  }, [db.documents, q, category, status]);

  const isGov = currentUser?.role === "government";

  return (
    <>
      <PageHeader
        title="Văn bản pháp luật"
        subtitle="Tra cứu hệ thống văn bản quy phạm pháp luật đang có hiệu lực. Chính quyền có thể đăng tải văn bản mới."
      />
      <div className="container py-8">
        {/* Bộ lọc */}
        <div className="card mb-6 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên, số hiệu, cơ quan..."
              className="input"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input md:w-44"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "all" | DocStatus)}
              className="input md:w-44"
            >
              <option value="all">Mọi trạng thái</option>
              <option value="con-hieu-luc">Còn hiệu lực</option>
              <option value="chua-hieu-luc">Chưa hiệu lực</option>
              <option value="het-hieu-luc">Hết hiệu lực</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Tìm thấy <b>{results.length}</b> văn bản
          </p>
          {isGov && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="btn-primary"
            >
              {showForm ? "Đóng" : "+ Đăng văn bản mới"}
            </button>
          )}
        </div>

        {isGov && showForm && (
          <AddDocForm
            onSubmit={(doc) => {
              addDocument({ ...doc, createdBy: currentUser!.id });
              setShowForm(false);
            }}
          />
        )}

        {/* Danh sách */}
        <div className="space-y-3">
          {results.map((d) => (
            <Link
              key={d.id}
              href={`/van-ban-phap-luat/${d.id}`}
              className="card block p-5 transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-primary-50 text-primary-700">
                  {d.category}
                </span>
                <span className={cx("badge", docStatusClass[d.status])}>
                  {docStatusLabel[d.status]}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Số: {d.soHieu}
                </span>
              </div>
              <h3 className="mt-2 font-semibold text-slate-800">{d.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {d.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                <span>Cơ quan: {d.agency}</span>
                <span>Ban hành: {formatDate(d.issuedDate)}</span>
                <span>Hiệu lực: {formatDate(d.effectiveDate)}</span>
                <span>{d.views} lượt xem</span>
              </div>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="card p-10 text-center text-slate-400">
              Không tìm thấy văn bản phù hợp.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AddDocForm({
  onSubmit,
}: {
  onSubmit: (doc: {
    soHieu: string;
    title: string;
    category: string;
    agency: string;
    issuedDate: string;
    effectiveDate: string;
    status: DocStatus;
    summary: string;
    content: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    soHieu: "",
    title: "",
    category: "Luật",
    agency: "",
    issuedDate: "",
    effectiveDate: "",
    status: "con-hieu-luc" as DocStatus,
    summary: "",
    content: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="card mb-6 space-y-3 p-5"
    >
      <h3 className="font-semibold text-slate-800">Đăng văn bản mới</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Số hiệu</label>
          <input required className="input" value={form.soHieu} onChange={(e) => set("soHieu", e.target.value)} />
        </div>
        <div>
          <label className="label">Loại văn bản</label>
          <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {["Luật", "Nghị định", "Thông tư", "Nghị quyết"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Tên văn bản</label>
        <input required className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="label">Cơ quan ban hành</label>
          <input required className="input" value={form.agency} onChange={(e) => set("agency", e.target.value)} />
        </div>
        <div>
          <label className="label">Ngày ban hành</label>
          <input type="date" required className="input" value={form.issuedDate} onChange={(e) => set("issuedDate", e.target.value)} />
        </div>
        <div>
          <label className="label">Ngày hiệu lực</label>
          <input type="date" required className="input" value={form.effectiveDate} onChange={(e) => set("effectiveDate", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Trạng thái</label>
        <select className="input md:w-56" value={form.status} onChange={(e) => set("status", e.target.value as DocStatus)}>
          <option value="con-hieu-luc">Còn hiệu lực</option>
          <option value="chua-hieu-luc">Chưa hiệu lực</option>
          <option value="het-hieu-luc">Hết hiệu lực</option>
        </select>
      </div>
      <div>
        <label className="label">Tóm tắt</label>
        <textarea required rows={2} className="input" value={form.summary} onChange={(e) => set("summary", e.target.value)} />
      </div>
      <div>
        <label className="label">Nội dung</label>
        <textarea required rows={4} className="input" value={form.content} onChange={(e) => set("content", e.target.value)} />
      </div>
      <button type="submit" className="btn-primary">Lưu văn bản</button>
    </form>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="container py-10">Đang tải...</div>}>
      <DocsInner />
    </Suspense>
  );
}
