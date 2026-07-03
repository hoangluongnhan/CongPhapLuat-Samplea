"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import {
  cx,
  feedbackStatusClass,
  feedbackStatusLabel,
  formatDateTime,
  roleBadgeClass,
  roleLabel,
} from "@/lib/format";
import type { Feedback } from "@/lib/types";

const fields = [
  "Tất cả",
  "Đất đai",
  "Xây dựng",
  "Thuế",
  "Lao động",
  "Y tế",
  "Giáo dục",
  "Trợ giúp pháp lý",
  "Khác",
];

export default function FeedbackPage() {
  const { db, currentUser } = useApp();
  const [field, setField] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);

  const canSubmit =
    currentUser?.role === "citizen" || currentUser?.role === "business";
  const isGov = currentUser?.role === "government";

  const list = useMemo(() => {
    return db.feedbacks
      .filter((f) => f.isPublic || isGov || f.authorId === currentUser?.id)
      .filter((f) => field === "Tất cả" || f.field === field);
  }, [db.feedbacks, field, isGov, currentUser?.id]);

  return (
    <>
      <PageHeader
        title="Phản ánh chính sách"
        subtitle="Người dân và doanh nghiệp gửi phản ánh, kiến nghị; chính quyền tiếp nhận và phản hồi công khai."
      />
      <div className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="input md:w-56"
          >
            {fields.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          {canSubmit ? (
            <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
              {showForm ? "Đóng" : "+ Gửi phản ánh"}
            </button>
          ) : !currentUser ? (
            <Link href="/dang-nhap" className="btn-outline">
              Đăng nhập để gửi phản ánh
            </Link>
          ) : null}
        </div>

        {canSubmit && showForm && <FeedbackForm onDone={() => setShowForm(false)} />}

        <div className="space-y-4">
          {list.map((f) => (
            <FeedbackCard key={f.id} fb={f} />
          ))}
          {list.length === 0 && (
            <div className="card p-10 text-center text-slate-400">
              Chưa có phản ánh nào.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FeedbackForm({ onDone }: { onDone: () => void }) {
  const { addFeedback } = useApp();
  const [form, setForm] = useState({
    title: "",
    field: "Đất đai",
    content: "",
    isPublic: true,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addFeedback(form);
        onDone();
      }}
      className="card mb-6 space-y-3 p-5"
    >
      <h3 className="font-semibold text-slate-800">Gửi phản ánh mới</h3>
      <div>
        <label className="label">Tiêu đề</label>
        <input
          required
          className="input"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>
      <div>
        <label className="label">Lĩnh vực</label>
        <select
          className="input md:w-56"
          value={form.field}
          onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))}
        >
          {fields.slice(1).map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Nội dung phản ánh</label>
        <textarea
          required
          rows={4}
          className="input"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={form.isPublic}
          onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
        />
        Công khai phản ánh này cho cộng đồng
      </label>
      <button type="submit" className="btn-primary">
        Gửi phản ánh
      </button>
    </form>
  );
}

function FeedbackCard({ fb }: { fb: Feedback }) {
  const { currentUser, respondFeedback, toggleUpvote, updateFeedbackStatus } =
    useApp();
  const isGov = currentUser?.role === "government";
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [agency, setAgency] = useState(currentUser?.organization ?? "");

  const upvoted = currentUser ? fb.upvotes.includes(currentUser.id) : false;

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge bg-primary-50 text-primary-700">{fb.field}</span>
        <span className={cx("badge", feedbackStatusClass[fb.status])}>
          {feedbackStatusLabel[fb.status]}
        </span>
        {!fb.isPublic && (
          <span className="badge bg-slate-100 text-slate-500">Riêng tư</span>
        )}
      </div>

      <h3 className="mt-2 text-lg font-semibold text-slate-800">{fb.title}</h3>
      <p className="mt-1 whitespace-pre-line text-slate-600">{fb.content}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
        <span className={cx("badge", roleBadgeClass[fb.authorRole])}>
          {roleLabel[fb.authorRole]}
        </span>
        <span>{fb.authorName}</span>
        <span>· {formatDateTime(fb.createdAt)}</span>
      </div>

      {/* Phản hồi từ chính quyền */}
      {fb.responses.length > 0 && (
        <div className="mt-4 space-y-3 border-l-2 border-primary-200 pl-4">
          {fb.responses.map((r) => (
            <div key={r.id} className="rounded-lg bg-primary-50 p-3">
              <div className="text-xs font-semibold text-primary-700">
                {r.agency} · {r.responderName}
              </div>
              <p className="mt-1 text-sm text-slate-700">{r.content}</p>
              <div className="mt-1 text-xs text-slate-400">
                {formatDateTime(r.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => currentUser && toggleUpvote(fb.id)}
          disabled={!currentUser}
          className={cx(
            "btn text-sm",
            upvoted
              ? "bg-primary-600 text-white"
              : "border border-slate-300 text-slate-600 hover:bg-slate-50"
          )}
        >
          👍 Đồng tình ({fb.upvotes.length})
        </button>
        <span className="text-sm text-slate-400">💬 {fb.responses.length} phản hồi</span>

        {isGov && (
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select
              value={fb.status}
              onChange={(e) =>
                updateFeedbackStatus(fb.id, e.target.value as Feedback["status"])
              }
              className="input w-40 py-1 text-sm"
            >
              <option value="moi">Mới</option>
              <option value="dang-xu-ly">Đang xử lý</option>
              <option value="da-phan-hoi">Đã phản hồi</option>
              <option value="da-dong">Đã đóng</option>
            </select>
            <button
              onClick={() => setReplyOpen((v) => !v)}
              className="btn-outline text-sm"
            >
              Phản hồi
            </button>
          </div>
        )}
      </div>

      {isGov && replyOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reply.trim()) return;
            respondFeedback(fb.id, reply.trim(), agency || "Cơ quan chức năng");
            setReply("");
            setReplyOpen(false);
          }}
          className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3"
        >
          <input
            className="input"
            placeholder="Tên cơ quan phản hồi"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Nội dung phản hồi chính thức..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button type="submit" className="btn-primary text-sm">
            Gửi phản hồi
          </button>
        </form>
      )}
    </div>
  );
}
