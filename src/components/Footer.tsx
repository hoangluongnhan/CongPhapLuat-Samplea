import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-primary-900 text-primary-100">
      <div className="container grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-red">
              ★
            </span>
            <span className="font-bold">CỔNG PHÁP LUẬT QUỐC GIA</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Nền tảng tương tác giữa người dân, doanh nghiệp và chính quyền -
            đồng hành cùng kỷ nguyên mới.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Liên kết nhanh</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/van-ban-phap-luat" className="hover:text-white">Văn bản pháp luật</Link></li>
            <li><Link href="/du-thao" className="hover:text-white">Dự thảo VBQPPL</Link></li>
            <li><Link href="/phan-anh-chinh-sach" className="hover:text-white">Phản ánh chính sách</Link></li>
            <li><Link href="/ho-tro" className="hover:text-white">Trợ giúp pháp lý</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Thông tin</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-white">Tin tức</Link></li>
            <li><Link href="/dang-nhap" className="hover:text-white">Đăng nhập / Đăng ký</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>Đường dây nóng: 1900 0000</li>
            <li>Email: hotro@phapluat.gov.vn</li>
            <li>Địa chỉ: Hà Nội, Việt Nam</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} Cổng Pháp Luật Quốc Gia. Dự án mẫu phục vụ
        học tập - dữ liệu lưu trên trình duyệt (localStorage).
      </div>
    </footer>
  );
}
