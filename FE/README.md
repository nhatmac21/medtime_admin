# MedTime Admin Dashboard

Trang quản trị web cho hệ thống MedTime - Ứng dụng quản lý thuốc và nhắc nhở uống thuốc.

## Tính năng

### 1. 🏥 Dashboard
- Xem tổng quan thống kê hệ thống
- Biểu đồ trực quan về:
  - Tổng đơn thuốc và thuốc đang hoạt động
  - Tỷ lệ tuân thủ uống thuốc
  - Thống kê liều uống trong ngày (đã uống, bỏ lỡ, sắp tới)
  - Hoạt động gần đây

### 2. 👥 Quản lý người dùng
- Xem danh sách tất cả người dùng
- Tìm kiếm người dùng theo tên, email, username
- Lọc theo vai trò (Admin/User) và trạng thái Premium
- **Xem người dùng đã đăng ký Premium** với thông tin:
  - Trạng thái Premium (có badge màu vàng)
  - Ngày bắt đầu Premium
  - Ngày hết hạn Premium
- **✨ SỬA THÔNG TIN NGƯỜI DÙNG** (Tính năng mới):
  - Cập nhật họ tên
  - Thay đổi ngày sinh
  - Chọn giới tính (Nam/Nữ/Khác)
  - Cập nhật số điện thoại (có validate)
  - Thiết lập múi giờ
  - Form validation đầy đủ
- Xem chi tiết thông tin người dùng
- Phân trang và sắp xếp

### 3. 💊 Quản lý thuốc
- Xem danh sách tất cả các loại thuốc
- **Thêm thuốc mới** với thông tin đầy đủ:
  - Tên thuốc
  - Hàm lượng và đơn vị
  - Loại thuốc (viên nén, viên nang, thuốc nước, v.v.)
  - Hình ảnh thuốc
  - Ghi chú
- **Chỉnh sửa** thông tin thuốc
- **Xóa** thuốc (có xác nhận)
- Tìm kiếm thuốc theo tên
- Phân trang

### 4. 💰 Thống kê Thu nhập (Revenue Analytics)
- **Tổng quan doanh thu**:
  - Tổng doanh thu
  - Tổng số giao dịch
  - Giao dịch đã thanh toán / Chờ thanh toán / Thất bại
  - Tỷ lệ chuyển đổi (conversion rate)
  - Doanh thu trung bình mỗi giao dịch
- **Biểu đồ doanh thu theo ngày**:
  - Line chart hiển thị xu hướng doanh thu
  - Lọc theo khoảng thời gian
- **Phân bố trạng thái thanh toán**:
  - Pie chart hiển thị tỷ lệ các trạng thái
  - Màu sắc phân biệt rõ ràng
- **Doanh thu theo gói Premium**:
  - Bar chart so sánh các gói
  - Hiển thị doanh thu và số lượng giao dịch
- **Top 10 Khách hàng**:
  - Xếp hạng theo tổng chi tiêu
  - Hiển thị số giao dịch
  - Ngày giao dịch gần nhất
- **Danh sách giao dịch gần đây**:
  - Hiển thị 20 giao dịch mới nhất
  - Thông tin đầy đủ: mã đơn, người dùng, gói, số tiền, trạng thái
  - Phân trang
- **Lọc theo khoảng thời gian**:
  - Date Range Picker
  - Tự động cập nhật tất cả biểu đồ và thống kê

## Công nghệ sử dụng

- **React 18** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ant Design** - UI Component library
- **Recharts** - Biểu đồ và visualization
- **Axios** - HTTP client
- **React Router** - Routing
- **dayjs** - Date formatting

## Cài đặt và chạy

### 1. Cài đặt dependencies

\`\`\`bash
cd FE
npm install
\`\`\`

### 2. Chạy development server

\`\`\`bash
npm run dev
\`\`\`

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### 3. Build production

\`\`\`bash
npm run build
\`\`\`

### 4. Preview production build

\`\`\`bash
npm run preview
\`\`\`

## Cấu hình API

API Backend được cấu hình trong file `src/config/api.ts`:

\`\`\`typescript
export const API_BASE_URL = 'https://medtime-be.onrender.com/api';
\`\`\`

Tất cả các API endpoints đều sử dụng URL này làm base.

## Đăng nhập

Để đăng nhập vào hệ thống, bạn cần tài khoản **ADMIN**:

1. Truy cập: `http://localhost:3000/login`
2. Nhập username và password của tài khoản ADMIN
3. Hệ thống sẽ lưu token và điều hướng đến Dashboard

**Lưu ý:** Chỉ tài khoản có role ADMIN mới có thể:
- Xem tất cả người dùng
- Quản lý thuốc (thêm, sửa, xóa)

## Cấu trúc thư mục

\`\`\`
FE/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   └── Layout/      # Layout components
│   ├── contexts/        # React contexts (Auth)
│   ├── config/          # Configuration files (API endpoints)
│   ├── pages/           # Page components
│   │   ├── Login.tsx    # Login page
│   │   ├── Dashboard.tsx # Dashboard page
│   │   ├── Users.tsx    # User management page
│   │   └── Medicines.tsx # Medicine management page
│   ├── types/           # TypeScript types & interfaces
│   ├── utils/           # Utility functions (axios)
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
\`\`\`

## API Endpoints được sử dụng

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới token

### Users
- `GET /api/user?pageNumber={page}&pageSize={size}` - Lấy danh sách người dùng (Admin only)
- `GET /api/user/{id}` - Lấy thông tin chi tiết người dùng

### Medicines
- `GET /api/medicine?pageNumber={page}&pageSize={size}` - Lấy danh sách thuốc
- `GET /api/medicine/{id}` - Lấy thông tin chi tiết thuốc
- `POST /api/medicine` - Tạo thuốc mới
- `PUT /api/medicine/{id}` - Cập nhật thuốc
- `DELETE /api/medicine/{id}` - Xóa thuốc

### Statistics
- `GET /api/statistics/dashboard?userId={id}` - Lấy thống kê dashboard

### Admin Payment Analytics (Admin only)
- `GET /api/admin/payments/summary?from={date}&to={date}` - Tổng quan doanh thu
- `GET /api/admin/payments/daily-revenue?from={date}&to={date}` - Doanh thu theo ngày
- `GET /api/admin/payments/plan-breakdown?from={date}&to={date}` - Doanh thu theo gói
- `GET /api/admin/payments/status-breakdown?from={date}&to={date}` - Phân bố trạng thái
- `GET /api/admin/payments/top-customers?limit={n}&from={date}&to={date}` - Top khách hàng
- `GET /api/admin/payments/recent-transactions?limit={n}&from={date}&to={date}` - Giao dịch gần đây

## Xử lý Authentication

- Token được lưu trong `localStorage`
- Tự động refresh token khi hết hạn
- Tự động redirect về login khi unauthorized
- Protected routes chỉ cho phép user đã đăng nhập

## Features nổi bật

### 🔐 Security
- JWT Authentication với refresh token
- Protected routes
- Role-based access control (ADMIN/USER)

### 🎨 UI/UX
- Responsive design (mobile-friendly)
- Vietnamese locale
- Loading states
- Error handling với notifications
- Confirm dialogs cho actions quan trọng

### 📊 Data Visualization
- Bar charts cho tổng quan
- Pie charts cho phân bổ
- Statistics cards với icons
- Color-coded status tags

### 🔍 Search & Filter
- Search functionality
- Role-based filtering
- Premium status filtering
- Pagination với page size options

## Troubleshooting

### Lỗi kết nối API
- Kiểm tra backend đang chạy tại: `https://medtime-be.onrender.com`
- Kiểm tra network trong browser DevTools

### Lỗi đăng nhập
- Đảm bảo sử dụng tài khoản ADMIN
- Kiểm tra username/password
- Clear localStorage nếu có token cũ

### Lỗi CORS
- Backend đã cấu hình CORS
- Nếu vẫn gặp lỗi, kiểm tra cấu hình CORS trên backend

## License

MIT

## Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.
