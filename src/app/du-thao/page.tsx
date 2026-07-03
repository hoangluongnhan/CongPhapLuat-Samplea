"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import {
  cx,
  draftStatusClass,
  draftStatusLabel,
  formatDate,
  formatDateTime,
  roleBadgeClass,
  roleLabel,
} from "@/lib/format";
import type { DraftDocument } from "@/lib/types";

export default function DraftsPage() {
  const { db } = useApp();

  return (
    <>
      <PageHeader
        title="Dự thảo văn bản quy phạm pháp luật"
        subtitle="Người dân và doanh nghiệp tham gia góp ý trực tiếp cho các dự thảo đang được lấy ý kiến."
      />
      <div className="container space-y-5 py-8">
        {db.drafts.map((d) => (
          <DraftCard key={d.id} draft={d} />
        ))}
        {db.drafts.length === 0 && (
          <div className="card p-10 text-center text-slate-400">
            Chưa có dự thảo nào.
          </div>
        )}
      </div>
    </>
  );
}

function DraftCard({ draft }: { draft: DraftDocument }) {
  const { currentUser, addDraftComment } = useApp();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const canComment = !!currentUser;
  const isOpen = draft.status === "dang-lay-y-kien";

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge bg-primary-50 text-primary-700">{draft.category}</span>
        <span className={cx("badge", draftStatusClass[draft.status])}>
          {draftStatusLabel[draft.status]}
        </span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-slate-800">{draft.title}</h3>
      <p className="mt-1 text-slate-600">{draft.summary}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        <span>Cơ quan: {draft.agency}</span>
        <span>Bắt đầu: {formatDate(draft.openDate)}</span>
        <span>Kết thúc: {formatDate(draft.closeDate)}</span>
        <span>{draft.comments.length} góp ý</span>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-outline mt-4 text-sm"
      >
        {open ? "Ẩn góp ý" : `Xem & góp ý (${draft.comments.length})`}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {draft.comments.map((c) => (
            <div key={c.id} className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-xs">
                <span className={cx("badge", roleBadgeClass[c.authorRole])}>
                  {roleLabel[c.authorRole]}
                </span>
                <span className="font-medium text-slate-700">{c.authorName}</span>
                <span className="text-slate-400">· {formatDateTime(c.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-700">{c.content}</p>
            </div>
          ))}
          {draft.comments.length === 0 && (
            <p className="text-sm text-slate-400">Chưa có góp ý nào.</p>
          )}

          {isOpen && canComment && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                addDraftComment(draft.id, comment.trim());
                setComment("");
              }}
              className="space-y-2"
            >
              <textarea
                className="input"
                rows={3}
                placeholder="Nhập ý kiến góp ý của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn-primary text-sm">
                Gửi góp ý
              </button>
            </form>
          )}
          {isOpen && !canComment && (
            <Link href="/dang-nhap" className="btn-outline text-sm">
              Đăng nhập để góp ý
            </Link>
          )}
          {!isOpen && (
            <p className="text-sm text-slate-400">
              Dự thảo đã đóng lấy ý kiến.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
