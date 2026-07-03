"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import { formatDateTime } from "@/lib/format";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { db, ready } = useApp();
  const article = db.news.find((n) => n.id === id);

  if (ready && !article) {
    return (
      <div className="container py-16 text-center">
        <p className="text-slate-500">Không tìm thấy bài viết.</p>
        <Link href="/tin-tuc" className="btn-primary mt-4">
          ← Quay lại tin tức
        </Link>
      </div>
    );
  }

  if (!article) return <div className="container py-16">Đang tải...</div>;

  const related = db.news.filter((n) => n.id !== article.id).slice(0, 3);

  return (
    <>
      <PageHeader title={article.title} subtitle={article.category} />
      <div className="container grid gap-8 py-8 lg:grid-cols-3">
        <article className="card p-6 lg:col-span-2">
          <div className="mb-4 text-sm text-slate-400">
            {article.author} · {formatDateTime(article.publishedAt)} ·{" "}
            {article.views} lượt xem
          </div>
          <p className="mb-4 text-lg font-medium text-slate-700">
            {article.excerpt}
          </p>
          <div className="whitespace-pre-line leading-relaxed text-slate-700">
            {article.content}
          </div>
        </article>

        <aside>
          <h3 className="mb-3 font-semibold text-slate-800">Tin liên quan</h3>
          <div className="card divide-y divide-slate-100">
            {related.map((n) => (
              <Link
                key={n.id}
                href={`/tin-tuc/${n.id}`}
                className="block p-4 text-sm transition hover:bg-slate-50"
              >
                <span className="font-medium text-slate-800">{n.title}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
