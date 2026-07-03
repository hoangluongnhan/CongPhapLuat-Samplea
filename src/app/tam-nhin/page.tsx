"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useApp } from "@/context/AppProvider";

// UC2 - CPLQG-VI-002: Xem Tầm nhìn và định hướng phát triển (công khai)
export default function VisionPage() {
  const { db } = useApp();
  const v = db.siteContent?.vision;

  // Trường hợp lỗi tải / nội dung rỗng
  if (!v) {
    return (
      <div className="container py-20 text-center text-slate-400">
        Đang cập nhật nội dung.
      </div>
    );
  }

  return (
    <div>
      <div className="container pt-6">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giới thiệu", href: "/gioi-thieu" },
            { label: "Tầm nhìn và định hướng phát triển" },
          ]}
        />
      </div>

      {/* KHỐI TẦM NHÌN (CPLQG-VI-002.MH01) */}
      <section className="relative mt-4 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white">
        <div className="container grid items-center gap-8 py-16 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold uppercase tracking-wide drop-shadow sm:text-5xl">
              {v.title || "TẦM NHÌN"}
            </h1>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-primary-50">
              {splitParagraphs(v.visionText).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {v.visionText.trim() === "" && (
                <p className="text-primary-200">Đang cập nhật nội dung.</p>
              )}
            </div>
          </div>
          <VisionImage url={v.imageUrl} />
        </div>
      </section>

      {/* KHỐI SỨ MỆNH */}
      <section className="container py-14">
        <div className="card mx-auto max-w-4xl border-l-4 border-primary-600 p-8">
          <h2 className="text-2xl font-bold uppercase text-primary-800">
            {v.missionTitle || "SỨ MỆNH"}
          </h2>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-slate-700">
            {splitParagraphs(v.missionText).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {v.missionText.trim() === "" && (
              <p className="text-slate-400">Đang cập nhật nội dung.</p>
            )}
          </div>
        </div>
      </section>

      {/* KHỐI ĐỊNH HƯỚNG PHÁT TRIỂN (CPLQG-VI-002.MH02) */}
      <section className="bg-slate-100 py-14">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-bold uppercase text-slate-800">
            {v.directionsTitle || "ĐỊNH HƯỚNG PHÁT TRIỂN"}
          </h2>

          {v.directions.length === 0 ? (
            <p className="text-center text-slate-400">Đang cập nhật nội dung.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {v.directions.map((d, idx) => (
                <div
                  key={d.id}
                  className="card relative p-6 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="absolute right-4 top-4 text-sm font-bold text-slate-200">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="text-4xl">{d.icon || "📌"}</div>
                  <h3 className="mt-3 font-semibold text-slate-800">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {d.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** Ảnh minh họa: ẩn nếu không có hoặc lỗi tải (theo SRS) */
function VisionImage({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div className="hidden h-64 items-center justify-center rounded-2xl bg-white/5 text-8xl lg:flex">
        🌐
      </div>
    );
  }
  return (
    <div className="relative hidden h-64 overflow-hidden rounded-2xl lg:block">
      {/* Dùng img thường để dễ xử lý onError với URL bất kỳ */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Minh họa tầm nhìn"
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
