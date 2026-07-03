"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import { cx, docStatusClass, docStatusLabel, formatDate } from "@/lib/format";

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { db, ready, incrementDocViews } = useApp();
  const doc = db.documents.find((d) => d.id === id);
  const counted = useRef(false);

  // Tăng lượt xem một lần khi mở văn bản
  useEffect(() => {
    if (ready && doc && !counted.current) {
      counted.current = true;
      incrementDocViews(doc.id);
    }
  }, [ready, doc, incrementDocViews]);

  if (ready && !doc) {
    return (
      <div className="container py-16 text-center">
        <p className="text-slate-500">Không tìm thấy văn bản.</p>
        <Link href="/van-ban-phap-luat" className="btn-primary mt-4">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!doc) return <div className="container py-16">Đang tải...</div>;

  return (
    <>
      <PageHeader title={doc.title} subtitle={`Số hiệu: ${doc.soHieu}`} />
      <div className="container grid gap-8 py-8 lg:grid-cols-3">
        <article className="card p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="badge bg-primary-50 text-primary-700">{doc.category}</span>
            <span className={cx("badge", docStatusClass[doc.status])}>
              {docStatusLabel[doc.status]}
            </span>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">Tóm tắt</h2>
          <p className="mb-6 text-slate-600">{doc.summary}</p>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">Nội dung</h2>
          <div className="whitespace-pre-line leading-relaxed text-slate-700">
            {doc.content}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-slate-800">Thông tin văn bản</h3>
            <dl className="space-y-2 text-sm">
              <Row k="Số hiệu" v={doc.soHieu} />
              <Row k="Loại" v={doc.category} />
              <Row k="Cơ quan" v={doc.agency} />
              <Row k="Ngày ban hành" v={formatDate(doc.issuedDate)} />
              <Row k="Ngày hiệu lực" v={formatDate(doc.effectiveDate)} />
              <Row k="Trạng thái" v={docStatusLabel[doc.status]} />
              <Row k="Lượt xem" v={String(doc.views)} />
            </dl>
          </div>
          <Link href="/van-ban-phap-luat" className="btn-outline w-full">
            ← Quay lại danh sách
          </Link>
        </aside>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-right font-medium text-slate-800">{v}</dd>
    </div>
  );
}
