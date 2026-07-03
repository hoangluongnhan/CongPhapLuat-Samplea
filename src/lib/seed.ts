import type { AppDatabase } from "./types";

/**
 * Dữ liệu mẫu khởi tạo lần đầu. Được nạp vào localStorage khi chưa có dữ liệu.
 * Ba tài khoản demo tương ứng ba vai trò để trải nghiệm nhanh.
 */
export const seedDatabase: AppDatabase = {
  users: [
    {
      id: "u-gov",
      fullName: "Nguyễn Văn Chính",
      email: "chinhquyen@phapluat.gov.vn",
      password: "123456",
      role: "government",
      organization: "Bộ Tư pháp",
      createdAt: "2026-01-02T08:00:00.000Z",
    },
    {
      id: "u-biz",
      fullName: "Trần Thị Doanh",
      email: "doanhnghiep@congty.vn",
      password: "123456",
      role: "business",
      organization: "Công ty CP Đầu tư ABC",
      createdAt: "2026-01-03T08:00:00.000Z",
    },
    {
      id: "u-citizen",
      fullName: "Lê Văn Dân",
      email: "nguoidan@gmail.com",
      password: "123456",
      role: "citizen",
      createdAt: "2026-01-04T08:00:00.000Z",
    },
  ],
  documents: [
    {
      id: "d-1",
      soHieu: "66-NQ/TW",
      title: "Nghị quyết số 66-NQ/TW về đổi mới công tác xây dựng và thi hành pháp luật",
      category: "Nghị quyết",
      agency: "Bộ Chính trị",
      issuedDate: "2026-04-30",
      effectiveDate: "2026-04-30",
      status: "con-hieu-luc",
      summary:
        "Định hướng đột phá đổi mới công tác xây dựng và thi hành pháp luật, đáp ứng yêu cầu phát triển đất nước trong kỷ nguyên mới.",
      content:
        "Nghị quyết đề ra mục tiêu đến năm 2030 hệ thống pháp luật đồng bộ, thống nhất, khả thi, công khai, minh bạch; đến năm 2035 mọi giao dịch giữa người dân, doanh nghiệp và chính quyền được thực hiện trên môi trường số...",
      createdBy: "u-gov",
      createdAt: "2026-04-30T08:00:00.000Z",
      views: 1520,
    },
    {
      id: "d-2",
      soHieu: "13/2023/QH15",
      title: "Luật Giao dịch điện tử",
      category: "Luật",
      agency: "Quốc hội",
      issuedDate: "2023-06-22",
      effectiveDate: "2024-07-01",
      status: "con-hieu-luc",
      summary:
        "Quy định về giao dịch điện tử, chữ ký điện tử, dịch vụ tin cậy và hoạt động của cơ quan nhà nước trên môi trường điện tử.",
      content:
        "Luật gồm 8 chương, 53 điều quy định việc thực hiện giao dịch bằng phương tiện điện tử, tạo hành lang pháp lý cho chuyển đổi số quốc gia...",
      createdBy: "u-gov",
      createdAt: "2024-01-10T08:00:00.000Z",
      views: 980,
    },
    {
      id: "d-3",
      soHieu: "80/2015/QH13",
      title: "Luật Ban hành văn bản quy phạm pháp luật",
      category: "Luật",
      agency: "Quốc hội",
      issuedDate: "2015-06-22",
      effectiveDate: "2016-07-01",
      status: "con-hieu-luc",
      summary:
        "Quy định nguyên tắc, thẩm quyền, hình thức, trình tự, thủ tục xây dựng, ban hành văn bản quy phạm pháp luật.",
      content:
        "Luật quy định hệ thống văn bản quy phạm pháp luật, trách nhiệm của các cơ quan trong xây dựng và ban hành văn bản...",
      createdBy: "u-gov",
      createdAt: "2016-01-05T08:00:00.000Z",
      views: 642,
    },
  ],
  drafts: [
    {
      id: "dr-1",
      title: "Dự thảo Nghị định về định danh và xác thực điện tử",
      agency: "Bộ Công an",
      category: "Nghị định",
      summary:
        "Quy định về tài khoản định danh điện tử, mức độ xác thực và trách nhiệm của tổ chức, cá nhân liên quan.",
      openDate: "2026-06-01",
      closeDate: "2026-08-01",
      status: "dang-lay-y-kien",
      createdBy: "u-gov",
      createdAt: "2026-06-01T08:00:00.000Z",
      comments: [
        {
          id: "c-1",
          authorId: "u-biz",
          authorName: "Công ty CP Đầu tư ABC",
          authorRole: "business",
          content:
            "Đề nghị bổ sung quy định rõ ràng về API kết nối cho doanh nghiệp cung cấp dịch vụ xác thực.",
          createdAt: "2026-06-10T09:30:00.000Z",
        },
      ],
    },
    {
      id: "dr-2",
      title: "Dự thảo Thông tư hướng dẫn thủ tục hành chính trực tuyến toàn trình",
      agency: "Bộ Nội vụ",
      category: "Thông tư",
      summary:
        "Hướng dẫn quy trình tiếp nhận và giải quyết thủ tục hành chính hoàn toàn trên môi trường điện tử.",
      openDate: "2026-05-15",
      closeDate: "2026-07-15",
      status: "dang-lay-y-kien",
      createdBy: "u-gov",
      createdAt: "2026-05-15T08:00:00.000Z",
      comments: [],
    },
  ],
  feedbacks: [
    {
      id: "f-1",
      title: "Thủ tục cấp phép xây dựng còn kéo dài",
      field: "Xây dựng",
      content:
        "Doanh nghiệp chúng tôi nộp hồ sơ cấp phép xây dựng nhưng thời gian xử lý vượt quá quy định. Đề nghị cơ quan chức năng rà soát và công khai tiến độ.",
      authorId: "u-biz",
      authorName: "Công ty CP Đầu tư ABC",
      authorRole: "business",
      status: "da-phan-hoi",
      isPublic: true,
      createdAt: "2026-06-05T10:00:00.000Z",
      responses: [
        {
          id: "fr-1",
          responderId: "u-gov",
          responderName: "Nguyễn Văn Chính",
          agency: "Sở Xây dựng",
          content:
            "Cảm ơn phản ánh của doanh nghiệp. Chúng tôi đã rà soát và rút ngắn thời gian xử lý xuống còn 15 ngày làm việc, đồng thời công khai tiến độ trên cổng dịch vụ công.",
          createdAt: "2026-06-12T14:00:00.000Z",
        },
      ],
      upvotes: ["u-citizen"],
    },
    {
      id: "f-2",
      title: "Đề xuất tăng điểm hỗ trợ tư vấn pháp luật miễn phí ở xã",
      field: "Trợ giúp pháp lý",
      content:
        "Người dân ở vùng nông thôn khó tiếp cận dịch vụ tư vấn pháp luật. Mong muốn có thêm điểm hỗ trợ tại cấp xã.",
      authorId: "u-citizen",
      authorName: "Lê Văn Dân",
      authorRole: "citizen",
      status: "moi",
      isPublic: true,
      createdAt: "2026-06-20T08:30:00.000Z",
      responses: [],
      upvotes: [],
    },
  ],
  news: [
    {
      id: "n-1",
      title:
        "Đến 2035, mọi giao dịch giữa người dân và chính quyền được thực hiện trên môi trường số",
      category: "Chuyển đổi số",
      excerpt:
        "Mục tiêu quan trọng được đặt ra trong định hướng đổi mới công tác xây dựng và thi hành pháp luật.",
      content:
        "Theo định hướng mới, đến năm 2035 toàn bộ giao dịch giữa người dân, doanh nghiệp và chính quyền sẽ được thực hiện trực tuyến, minh bạch và thuận tiện...",
      author: "Ban Biên tập",
      publishedAt: "2026-06-28T07:00:00.000Z",
      featured: true,
      views: 3120,
    },
    {
      id: "n-2",
      title: "Triển khai Nghị quyết 66-NQ/TW: bước vào kỷ nguyên mới của pháp luật",
      category: "Chính sách",
      excerpt:
        "Các bộ, ngành, địa phương đồng loạt xây dựng kế hoạch hành động cụ thể.",
      content:
        "Nghị quyết 66-NQ/TW được xem là bước ngoặt trong tư duy xây dựng pháp luật, lấy người dân và doanh nghiệp làm trung tâm phục vụ...",
      author: "Ban Biên tập",
      publishedAt: "2026-06-25T07:00:00.000Z",
      featured: true,
      views: 2450,
    },
    {
      id: "n-3",
      title: "Ra mắt trợ lý AI pháp luật hỗ trợ tra cứu văn bản 24/7",
      category: "Công nghệ",
      excerpt:
        "Người dân có thể đặt câu hỏi và nhận hướng dẫn pháp lý nhanh chóng.",
      content:
        "Trợ lý AI pháp luật giúp người dân, doanh nghiệp tra cứu văn bản, tìm hiểu thủ tục và nhận gợi ý pháp lý mọi lúc mọi nơi...",
      author: "Ban Biên tập",
      publishedAt: "2026-06-22T07:00:00.000Z",
      featured: false,
      views: 1870,
    },
  ],
  legalAid: [
    {
      id: "la-1",
      fullName: "Phạm Thị Hoa",
      contact: "0900000000",
      field: "Đất đai",
      question:
        "Thủ tục tách thửa đất ở đối với hộ gia đình cần những giấy tờ gì?",
      status: "da-tra-loi",
      answer:
        "Hồ sơ tách thửa gồm: đơn đề nghị tách thửa, bản gốc Giấy chứng nhận quyền sử dụng đất và các giấy tờ liên quan. Bạn nộp tại Văn phòng đăng ký đất đai cấp huyện.",
      createdAt: "2026-06-15T09:00:00.000Z",
    },
  ],
  siteContent: {
    vision: {
      title: "TẦM NHÌN",
      visionText:
        "Trở thành nền tảng pháp luật số hàng đầu tại Việt Nam, ứng dụng công nghệ tiên tiến và trí tuệ nhân tạo để cung cấp dịch vụ pháp lý chất lượng cao, minh bạch và thuận tiện cho mọi người dân và doanh nghiệp.\n\nĐến năm 2035, mọi giao dịch pháp lý giữa người dân, doanh nghiệp và chính quyền đều được thực hiện trên môi trường số một cách an toàn, nhanh chóng và tin cậy.",
      missionTitle: "SỨ MỆNH",
      missionText:
        "Kết nối và phục vụ người dân, doanh nghiệp và chính quyền trên một nền tảng pháp luật thống nhất; bảo đảm quyền tiếp cận thông tin pháp luật công khai, chính xác và kịp thời; đồng hành cùng công cuộc xây dựng và thi hành pháp luật trong kỷ nguyên mới.",
      imageUrl: "",
      directionsTitle: "ĐỊNH HƯỚNG PHÁT TRIỂN",
      directions: [
        {
          id: "dir-1",
          title: "Chuyển đổi số toàn diện",
          description:
            "Số hóa toàn bộ quy trình tra cứu, phản ánh, góp ý và trợ giúp pháp lý trên môi trường điện tử.",
          icon: "💻",
        },
        {
          id: "dir-2",
          title: "Ứng dụng trí tuệ nhân tạo",
          description:
            "Triển khai trợ lý AI pháp luật hỗ trợ tra cứu, giải đáp và gợi ý pháp lý 24/7 cho người dân, doanh nghiệp.",
          icon: "🤖",
        },
        {
          id: "dir-3",
          title: "Minh bạch và công khai",
          description:
            "Công khai văn bản, dự thảo và phản hồi chính sách; bảo đảm mọi ý kiến của người dân được tiếp nhận và xử lý.",
          icon: "🔎",
        },
        {
          id: "dir-4",
          title: "Lấy người dân làm trung tâm",
          description:
            "Thiết kế dịch vụ hướng tới trải nghiệm người dùng, đơn giản hóa thủ tục và rút ngắn thời gian xử lý.",
          icon: "🤝",
        },
      ],
    },
    openLetter: {
      title: "Thư ngỏ",
      location: "Hà Nội, ngày 01 tháng 07 năm 2026",
      recipient:
        "Kính gửi: Toàn thể người dân, doanh nghiệp và tổ chức sử dụng Cổng Pháp luật Quốc gia",
      body:
        "Trong bối cảnh đất nước bước vào kỷ nguyên phát triển mới, việc xây dựng một nền tảng pháp luật số thống nhất, hiện đại và thân thiện với người dân là yêu cầu cấp thiết. Cổng Pháp luật Quốc gia ra đời nhằm đáp ứng yêu cầu đó.\n\nĐây là nơi người dân, doanh nghiệp có thể tra cứu văn bản quy phạm pháp luật, gửi phản ánh chính sách, tham gia góp ý dự thảo và nhận trợ giúp pháp lý một cách thuận tiện, minh bạch. Chúng tôi cam kết không ngừng hoàn thiện chất lượng dịch vụ, lắng nghe và phục vụ tốt hơn mỗi ngày.\n\nChúng tôi trân trọng kêu gọi sự tham gia, đồng hành và đóng góp ý kiến của quý vị để Cổng ngày càng hữu ích, góp phần xây dựng một xã hội thượng tôn pháp luật.",
      closing: "Trân trọng,",
      signerTitle: "Lãnh đạo Bộ Tư pháp",
      signerName: "Nguyễn Văn Chính",
      portraitUrl: "",
      signatureUrl: "",
    },
  },
};
