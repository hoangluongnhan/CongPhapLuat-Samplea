"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import { cx, formatDateTime } from "@/lib/format";
import type { LegalAidRequest } from "@/lib/types";

const fields = ["Đất đai", "Hôn nhân - Gia đình", "Lao động", "Hình sự", "Dân sự", "Doanh nghiệp", "Khác"];

const statusLabel: Record<LegalAidRequest["status"], string> = {
  "cho-tiep-nhan": "Chờ tiếp nhận",
  "da-tiep-nhan": "Đã tiếp nhận",
  "da-tra-loi": "Đã trả lời",
};
const statusClass: Record<LegalAidRequest["status"], string> = {
  "cho-tiep-nhan": "bg-sky-100 text-sky-700",
  "da-tiep-nhan": "bg-amber-100 text-amber-700",
  "da-tra-loi": "bg-emerald-100 text-emerald-700",
};

export default function LegalAidPage() {
  const { db, currentUser, addLegalAid, answerLegalAid } = useApp();
  const isGov = currentUser?.role === "government";
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    fullName: currentUser?.fullName ?? "",
    contact: "",
    field: fields[0],
    question: "",
  });

  // Người dùng thường chỉ xem câu hỏi của mình + các câu đã trả lời công khai
  const visible = db.legalAid.filter(
    (r) =>
      isGov || r.status === "da-tra-loi" || r.authorId === currentUser?.id
  );

  return (
    <>
      <PageHeader
        title="Hỗ trợ, trợ giúp pháp lý"
        subtitle="Đặt câu hỏi pháp lý và nhận hướng dẫn từ đội ngũ hỗ trợ. Xem lại các câu hỏi thường gặp đã được giải đáp."
      />
      <div className="container grid gap-8 py-8 lg:grid-cols-2">
        {/* Form gửi câu hỏi */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-800">Gửi câu hỏi</h2>
          {sent && (
            <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              Đã gửi câu hỏi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addLegalAid(form);
              setSent(true);
              setForm((f) => ({ ...f, question: "" }));
            }}
            className="card space-y-3 p-5"
          >
            <div>
              <label className="label">Họ và tên</label>
              <input
                required
                className="input"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Số điện thoại / Email liên hệ</label>
              <input
                required
                className="input"
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Lĩnh vực</label>
              <select
                className="input"
                value={form.field}
                onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))}
              >
                {fields.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Câu hỏi của bạn</label>
              <textarea
                required
                rows={4}
                className="input"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Gửi câu hỏi
            </button>
          </form>
        </div>

        {/* Danh sách câu hỏi - trả lời */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-800">
            Câu hỏi &amp; giải đáp
          </h2>
          <div className="space-y-3">
            {visible.map((r) => (
              <AidCard
                key={r.id}
                req={r}
                isGov={isGov}
                onAnswer={(ans) => answerLegalAid(r.id, ans)}
                statusLabel={statusLabel}
                statusClass={statusClass}
              />
            ))}
            {visible.length === 0 && (
              <div className="card p-10 text-center text-slate-400">
                Chưa có câu hỏi nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AidCard({
  req,
  isGov,
  onAnswer,
  statusLabel,
  statusClass,
}: {
  req: LegalAidRequest;
  isGov: boolean;
  onAnswer: (answer: string) => void;
  statusLabel: Record<LegalAidRequest["status"], string>;
  statusClass: Record<LegalAidRequest["status"], string>;
}) {
  const [ans, setAns] = useState("");
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="badge bg-primary-50 text-primary-700">{req.field}</span>
        <span className={cx("badge", statusClass[req.status])}>
          {statusLabel[req.status]}
        </span>
      </div>
      <p className="mt-2 font-medium text-slate-800">{req.question}</p>
      <div className="mt-1 text-xs text-slate-400">
        {req.fullName} · {formatDateTime(req.createdAt)}
      </div>

      {req.answer && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3">
          <div className="text-xs font-semibold text-emerald-700">Trả lời</div>
          <p className="mt-1 text-sm text-slate-700">{req.answer}</p>
        </div>
      )}

      {isGov && !req.answer && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!ans.trim()) return;
            onAnswer(ans.trim());
          }}
          className="mt-3 space-y-2"
        >
          <textarea
            className="input"
            rows={3}
            placeholder="Nhập nội dung trả lời..."
            value={ans}
            onChange={(e) => setAns(e.target.value)}
          />
          <button type="submit" className="btn-primary text-sm">
            Gửi trả lời
          </button>
        </form>
      )}
    </div>
  );
}
