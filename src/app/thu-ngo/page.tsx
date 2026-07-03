"use client";

import Link from "next/link";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useApp } from "@/context/AppProvider";

// UC4 - CPLQG-VI-004: Xem Thư ngỏ (công khai)
const relatedPages = [
  { href: "/gioi-thieu", title: "Giới thiệu chung", desc: "Tổng quan về Cổng" },
  { href: "/tam-nhin", title: "Tầm nhìn & định hướng", desc: "Chiến lược phát triển" },
];

export default function OpenLetterPage() {
  const { db } = useApp();
  const l = db.siteContent?.openLetter;

  if (!l) {
    return (
      <div className="container py-20 text-center text-slate-400">
        Đang cập nhật nội dung.
      </div>
    );
  }

  return (
    <div>
      {/* Header trang */}
      <div className="bg-primary-800 text-white no-print">
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {l.title || "Thư ngỏ"}
          </h1>
        </div>
      </div>

      <div className="container py-6">
        <div className="no-print mb-4 flex items-center justify-between gap-3">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giới thiệu", href: "/gioi-thieu" },
              { label: "Thư ngỏ" },
            ]}
          />
          <PrintButton />
        </div>

        {/* Nội dung thư - căn giữa, tối đa 900px */}
        <article className="printable mx-auto max-w-[900px] rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-right italic text-slate-500">{l.location}</p>

          <p className="mt-6 font-bold text-slate-800">{l.recipient}</p>

          <div className="mt-6 space-y-4 text-[1.05rem] leading-[1.8] text-slate-700">
            {splitParagraphs(l.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Ký tên + ảnh lãnh đạo */}
          <div className="mt-10 flex flex-col items-end gap-2 text-right">
            <p className="text-slate-700">{l.closing}</p>
            <Signature url={l.signatureUrl} />
            <p className="font-semibold text-slate-800">{l.signerTitle}</p>
            <p className="text-lg font-bold text-primary-800">{l.signerName}</p>
            <Portrait url={l.portraitUrl} name={l.signerName} />
          </div>
        </article>

        {/* Điều hướng trang liên quan */}
        <div className="no-print mx-auto mt-8 grid max-w-[900px] gap-4 sm:grid-cols-2">
          {relatedPages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="card flex items-center justify-between p-5 transition hover:shadow-md"
            >
              <div>
                <div className="font-semibold text-slate-800">{p.title}</div>
                <div className="text-sm text-slate-500">{p.desc}</div>
              </div>
              <span className="text-primary-600">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-outline text-sm">
      🖨️ In thư ngỏ
    </button>
  );
}

function Signature({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt="Chữ ký"
      className="h-16 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function Portrait({ url, name }: { url?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    // Không có ảnh: hiển thị khung chữ cái đầu
    const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
    return (
      <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
        {initial}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name}
      className="mt-2 h-24 w-24 rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
