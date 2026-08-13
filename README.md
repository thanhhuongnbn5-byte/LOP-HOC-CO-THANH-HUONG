# Nền Tảng Học Liệu Số & Lớp Học Tương Tác EduNBN (Cô Lê Thị Thanh Hương)

Nền tảng Giáo dục số, Bài giảng tương tác & Trò chơi Giáo dục dành cho Học sinh Tiểu học (Khối 1, 2, 3, 4, 5) tích hợp Cổng Phụ huynh (Parent Portal) và Quản lý Lớp học bằng QR Code chạy thực tế với Supabase PostgreSQL Database.

## 🚀 Tính năng Nổi bật

1. **Hệ thống 4 Vai trò (RBAC)**:
   - **Quản trị viên (Admin)**: Quản lý hệ thống, môn học, các tài khoản và phân quyền RLS.
   - **Giáo viên (Teacher - Cô Lê Thị Thanh Hương)**: Tạo lớp học tự sinh Mã QR Code & Join Code (6 ký tự), chọn game bài giảng để giao bài tập, gửi nhận xét & đánh giá sao.
   - **Học sinh (Student)**: Giao diện trực quan Khối 1-5, tham gia lớp bằng QR Code / Mã 6 ký tự, chơi 5 game tương tác (Đào vàng, Đập chuột, Giải ô chữ, Ai là triệu phú, Sắp xếp chữ cái) tích lũy **Sao Thưởng ⭐** & mở khóa **Huy hiệu 🏆**.
   - **Phụ huynh (Parent Portal)**: Liên kết với tài khoản con bằng **Student Code (8 ký tự)** để theo dõi tiến độ, điểm số và sổ liên lạc điện tử từ Giáo viên.

2. **Công nghệ Sử dụng**:
   - **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, `qrcode.react`, `html5-qrcode`.
   - **Backend & Database**: Supabase (PostgreSQL Database, Auth, Row Level Security - RLS).
   - **Deployment**: Vercel ready (`vercel.json`).

## 📞 Thông tin Liên hệ & Hỗ trợ

- **Giáo viên**: Cô Lê Thị Thanh Hương
- **Địa chỉ**: Đức Lập - Lâm Đồng
- **Email**: `thanhhuongle84@gmail.com`
- **Điện thoại**: `0932474173`

## 🛠️ Hướng dẫn Chạy cục bộ

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển (Dev server)
npm run dev

# 3. Build sản phẩm (Production build)
npm run build
```

## 📊 Cấu trúc Cơ sở Dữ liệu

File SQL Migration đầy đủ bao gồm 13 bảng RLS & Stored Functions được lưu tại [`schema.sql`](./schema.sql).
