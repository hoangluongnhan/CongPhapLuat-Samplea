import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const subPages = [
  { href: "/tam-nhin", title: "Tầm nhìn & định hướng", desc: "Chiến lược phát triển dài hạn", icon: "🎯" },
  { href: "/thu-ngo", title: "Thư ngỏ", desc: "Thư chào mừng từ lãnh đạo", icon: "✉️" },
  { href: "/can-bo", title: "Danh sách cán bộ", desc: "Đội ngũ vận hành Cổng", icon: "👥" },
];

const roles = [
  {
    title: "Người dân",
    icon: "👥",
    items: [
      "Tra cứu văn bản pháp luật miễn phí",
      "Gửi phản ánh, kiến nghị về chính sách",
      "Góp ý cho dự thảo văn bản",
      "Đặt câu hỏi và nhận trợ giúp pháp lý",
    ],
  },
  {
    title: "Doanh nghiệp",
    icon: "🏢",
    items: [
      "Cập nhật quy định pháp luật liên quan",
      "Phản ánh vướng mắc về thủ tục hành chính",
      "Đề xuất, góp ý xây dựng chính sách",
      "Theo dõi tiến độ xử lý phản ánh",
    ],
  },
  {
    title: "Chính quyền",
    icon: "🏛️",
    items: [
      "Đăng tải và quản lý văn bản pháp luật",
      "Tiếp nhận và phản hồi phản ánh công khai",
      "Công bố dự thảo, tổng hợp góp ý",
      "Trả lời câu hỏi trợ giúp pháp lý",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Giới thiệu"
        subtitle="Cổng Pháp Luật Quốc Gia - nền tảng kết nối và tương tác ba bên: người dân, doanh nghiệp và chính quyền."
      />
      <div className="container py-10">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-slate-800">Tầm nhìn</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Xây dựng một không gian pháp lý số minh bạch, nơi thông tin pháp luật
            được cập nhật liên tục và mọi người dân, doanh nghiệp đều có thể tham
            gia đóng góp, phản ánh và tương tác trực tiếp với chính quyền. Hướng
            tới mục tiêu đến năm 2035, mọi giao dịch giữa người dân, doanh nghiệp
            và chính quyền được thực hiện trên môi trường số.
          </p>
        </div>

        <h2 className="mb-5 mt-10 text-xl font-bold text-slate-800">
          Ba nhóm đối tượng tương tác
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="card p-6">
              <div className="text-4xl">{r.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-800">
                {r.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {r.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mb-5 mt-10 text-xl font-bold text-slate-800">
          Khám phá thêm
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {subPages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="card flex items-center gap-4 p-5 transition hover:shadow-md"
            >
              <span className="text-3xl">{p.icon}</span>
              <span>
                <span className="block font-semibold text-slate-800">
                  {p.title}
                </span>
                <span className="block text-sm text-slate-500">{p.desc}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="card mt-10 bg-primary-50 p-6">
          <h2 className="text-lg font-bold text-primary-800">Về dự án mẫu này</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Đây là dự án mẫu xây dựng bằng Next.js và Tailwind CSS. Toàn bộ dữ
            liệu (tài khoản, văn bản, phản ánh, dự thảo, tin tức, trợ giúp pháp
            lý) được lưu trong <b>localStorage</b> của trình duyệt - không cần
            máy chủ hay cơ sở dữ liệu. Dữ liệu tồn tại trên chính thiết bị của
            bạn và có thể đặt lại về mặc định trong trang Quản trị.
          </p>
        </div>
      </div>
    </>
  );
}
