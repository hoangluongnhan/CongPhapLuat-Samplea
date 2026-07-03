"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/context/AppProvider";
import { formatDate } from "@/lib/format";

const quickAccess = [
  {
    href: "/van-ban-phap-luat",
    title: "Văn bản pháp luật",
    desc: "Tra cứu luật, nghị định, thông tư đang có hiệu lực.",
    icon: "📜",
  },
  {
    href: "/du-thao",
    title: "Dự thảo VBQPPL",
    desc: "Đóng góp ý kiến cho các dự thảo đang lấy ý kiến.",
    icon: "📝",
  },
  {
    href: "/phan-anh-chinh-sach",
    title: "Phản ánh chính sách",
    desc: "Gửi phản ánh, kiến nghị và theo dõi phản hồi.",
    icon: "📢",
  },
  {
    href: "/ho-tro",
    title: "Trợ giúp pháp lý",
    desc: "Đặt câu hỏi và nhận hỗ trợ pháp lý miễn phí.",
    icon: "🤝",
  },
];

export default function HomePage() {
  const { db } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");

  const featuredNews = db.news.filter((n) => n.featured).slice(0, 3);
  const latestDocs = db.documents.slice(0, 4);
  const openDrafts = db.drafts.filter((d) => d.status === "dang-lay-y-kien");
  const publicFeedback = db.feedbacks.filter((f) => f.isPublic).slice(0, 3);

  const stats = [
    { label: "Văn bản pháp luật", value: db.documents.length },
    { label: "Dự thảo đang lấy ý kiến", value: openDrafts.length },
    { label: "Phản ánh đã tiếp nhận", value: db.feedbacks.length },
    { label: "Tin tức - chính sách", value: db.news.length },
  ];

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/van-ban-phap-luat?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white">
        <div className="container relative z-10 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-lg font-medium italic text-primary-100 sm:text-xl">
              Đồng hành cùng người dân và doanh nghiệp
            </p>
            <h1 className="mt-2 text-4xl font-extrabold uppercase leading-tight drop-shadow sm:text-5xl">
              Bước vào kỷ nguyên mới
            </h1>

            <form
              onSubmit={onSearch}
              className="mt-8 flex items-center gap-2 rounded-full bg-white p-2 shadow-lg"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tra cứu nhanh văn bản quy phạm pháp luật..."
                className="flex-1 rounded-full px-4 py-2 text-slate-800 outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-primary-600 px-6 py-2 font-semibold text-white hover:bg-primary-700"
              >
                Tìm kiếm
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-primary-100">
              <span>Gợi ý:</span>
              {["Luật", "Nghị định", "Giao dịch điện tử", "66-NQ/TW"].map(
                (t) => (
                  <Link
                    key={t}
                    href={`/van-ban-phap-luat?q=${encodeURIComponent(t)}`}
                    className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20"
                  >
                    {t}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
      </section>

      {/* THỐNG KÊ */}
      <section className="container -mt-8 relative z-20 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl font-extrabold text-primary-700">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </section>

      {/* TRUY CẬP NHANH */}
      <section className="container mt-12">
        <h2 className="mb-5 text-xl font-bold text-slate-800">Dịch vụ nổi bật</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card group p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-800 group-hover:text-primary-700">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* TIN NỔI BẬT + VĂN BẢN MỚI */}
      <section className="container mt-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Tin nổi bật</h2>
            <Link href="/tin-tuc" className="text-sm font-medium text-primary-700 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredNews.map((n) => (
              <Link
                key={n.id}
                href={`/tin-tuc/${n.id}`}
                className="card overflow-hidden transition hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                  <span className="badge bg-white/20 text-white">{n.category}</span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold text-slate-800">
                    {n.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {n.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-slate-400">
                    {formatDate(n.publishedAt)} · {n.views} lượt xem
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Văn bản mới</h2>
            <Link href="/van-ban-phap-luat" className="text-sm font-medium text-primary-700 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="card divide-y divide-slate-100">
            {latestDocs.map((d) => (
              <Link
                key={d.id}
                href={`/van-ban-phap-luat/${d.id}`}
                className="block p-4 transition hover:bg-slate-50"
              >
                <div className="text-xs font-semibold text-primary-700">
                  {d.soHieu} · {d.category}
                </div>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-slate-800">
                  {d.title}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {d.agency} · {formatDate(d.issuedDate)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PHẢN ÁNH CÔNG KHAI */}
      <section className="container mt-12 mb-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Phản ánh chính sách gần đây
          </h2>
          <Link href="/phan-anh-chinh-sach" className="text-sm font-medium text-primary-700 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {publicFeedback.map((f) => (
            <Link
              key={f.id}
              href="/phan-anh-chinh-sach"
              className="card p-5 transition hover:shadow-md"
            >
              <div className="badge bg-primary-50 text-primary-700">{f.field}</div>
              <h3 className="mt-2 line-clamp-2 font-semibold text-slate-800">
                {f.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                {f.content}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{f.authorName}</span>
                <span>👍 {f.upvotes.length} · 💬 {f.responses.length}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
