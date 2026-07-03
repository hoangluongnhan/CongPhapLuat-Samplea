# Cổng Pháp Luật Quốc Gia (dự án mẫu)

Nền tảng tương tác giữa **người dân**, **doanh nghiệp** và **chính quyền**: tra
cứu văn bản pháp luật, phản ánh chính sách, góp ý dự thảo và trợ giúp pháp lý.

Xây dựng bằng **Next.js 14 (App Router)** + **Tailwind CSS**. Toàn bộ dữ liệu
được lưu trong **localStorage** của trình duyệt — không cần máy chủ hay cơ sở dữ
liệu.

## Yêu cầu

- Node.js >= 18.18 (kèm npm)

> Máy hiện tại **chưa cài Node.js**, nên dự án được tạo sẵn mã nguồn nhưng chưa
> chạy thử được. Sau khi cài Node.js, chạy các lệnh bên dưới.

## Cài đặt & chạy

```bash
npm install
npm run dev
```

Mở http://localhost:3000

Build production:

```bash
npm run build
npm start
```

## Tài khoản dùng thử

Mật khẩu chung cho cả ba: `123456`

| Vai trò     | Email                          |
| ----------- | ------------------------------ |
| Chính quyền | chinhquyen@phapluat.gov.vn     |
| Doanh nghiệp| doanhnghiep@congty.vn          |
| Người dân   | nguoidan@gmail.com             |

Trang **Đăng nhập** có nút điền nhanh từng tài khoản.

## Tính năng theo vai trò

| Chức năng                        | Người dân | Doanh nghiệp | Chính quyền |
| -------------------------------- | :-------: | :----------: | :---------: |
| Tra cứu văn bản pháp luật        |     ✓     |      ✓       |      ✓      |
| Đăng văn bản pháp luật           |           |              |      ✓      |
| Gửi phản ánh chính sách          |     ✓     |      ✓       |             |
| Phản hồi / xử lý phản ánh        |           |              |      ✓      |
| Đồng tình (upvote) phản ánh      |     ✓     |      ✓       |      ✓      |
| Góp ý dự thảo VBQPPL             |     ✓     |      ✓       |      ✓      |
| Công bố / quản lý dự thảo        |           |              |      ✓      |
| Đặt câu hỏi trợ giúp pháp lý     |     ✓     |      ✓       |      ✓      |
| Trả lời trợ giúp pháp lý         |           |              |      ✓      |
| Đăng tin tức, trang Quản trị     |           |              |      ✓      |

## Cấu trúc thư mục

```
src/
  app/
    layout.tsx                 # Bố cục gốc (Header, Footer, AppProvider)
    page.tsx                   # Trang chủ
    gioi-thieu/                # Giới thiệu
    tin-tuc/                   # Tin tức (danh sách + chi tiết)
    van-ban-phap-luat/         # Văn bản pháp luật (danh sách + chi tiết)
    du-thao/                   # Dự thảo VBQPPL + góp ý
    phan-anh-chinh-sach/       # Phản ánh chính sách
    ho-tro/                    # Trợ giúp pháp lý
    dang-nhap/                 # Đăng nhập / Đăng ký
    quan-tri/                  # Trang quản trị (chỉ chính quyền)
  components/                  # Header, Footer, PageHeader
  context/
    AppProvider.tsx            # State + hành động toàn cục (auth + dữ liệu)
  lib/
    types.ts                   # Kiểu dữ liệu
    seed.ts                    # Dữ liệu mẫu ban đầu
    storage.ts                 # Đọc/ghi localStorage
    format.ts                  # Định dạng & nhãn tiếng Việt
```

## Lưu trữ dữ liệu

- Khóa chính: `cpl-database-v1` (toàn bộ CSDL), `cpl-current-user` (phiên đăng nhập).
- Lần đầu mở, dữ liệu mẫu trong `src/lib/seed.ts` được nạp tự động.
- Có thể **đặt lại dữ liệu mẫu** trong trang Quản trị → tab *Hệ thống*.
- Dữ liệu chỉ nằm trên trình duyệt hiện tại; xóa dữ liệu trình duyệt sẽ mất.

## Lưu ý bảo mật

Đây là dự án mẫu phục vụ học tập. Mật khẩu được lưu ở dạng thô trong
localStorage và **không** có cơ chế bảo mật thực sự — không dùng cho môi trường
sản xuất.
