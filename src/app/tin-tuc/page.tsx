"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import { formatDate } from "@/lib/format";

export default function NewsPage() {
  const { db } = useApp();
  const [q, setQ] = useState("");

  const kw = q.trim().toLowerCase();
  const list = db.news.filter(
    (n) =>
      !kw ||
      n.title.toLowerCase().includes(kw) ||
      n.excerpt.toLowerCase().includes(kw) ||
      n.category.toLowerCase().includes(kw)
  );

  return (
    <>
      <PageHeader
        title="Tin tức - Chính sách"
        subtitle="Cập nhật liên tục tin tức, chính sách mới và hoạt động xây dựng, thi hành pháp luật."
      />
      <div className="container py-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm tin tức..."
          className="input mb-6 md:w-96"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((n) => (
            <Link
              key={n.id}
              href={`/tin-tuc/${n.id}`}
              className="card overflow-hidden transition hover:shadow-md"
            >
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <span className="badge bg-white/20 text-white">{n.category}</span>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 font-semibold text-slate-800">
                  {n.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                  {n.excerpt}
                </p>
                <div className="mt-3 text-xs text-slate-400">
                  {formatDate(n.publishedAt)} · {n.views} lượt xem
                </div>
              </div>
            </Link>
          ))}
          {list.length === 0 && (
            <div className="card col-span-full p-10 text-center text-slate-400">
              Không tìm thấy tin tức.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
