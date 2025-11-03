# Hướng dẫn sử dụng Trang Thống kê Thu nhập

## Tổng quan

Trang **Thống kê Thu nhập** (Revenue Analytics) cung cấp cái nhìn toàn diện về doanh thu từ việc bán các gói Premium của hệ thống MedTime.

## Truy cập

- **URL**: `/revenue`
- **Menu**: Click vào "Thống kê thu nhập" (biểu tượng 💰) trong sidebar
- **Quyền**: Chỉ dành cho **ADMIN**

## Các tính năng chính

### 1. Bộ lọc Thời gian
- **Date Range Picker** ở góc trên bên phải
- Chọn khoảng thời gian muốn xem thống kê
- Không chọn = xem tất cả dữ liệu
- Nút "Làm mới" để reload dữ liệu

### 2. Tổng quan Doanh thu (Summary Cards)

#### Hàng đầu tiên:
- **Tổng doanh thu**: Tổng số tiền thu được (VND)
- **Tổng giao dịch**: Số lượng giao dịch
- **Đã thanh toán**: Số giao dịch thành công / tổng số
- **Tỷ lệ chuyển đổi**: % giao dịch thành công

#### Hàng thứ hai:
- **Chờ thanh toán**: Số giao dịch đang chờ
- **Thất bại**: Số giao dịch thất bại
- **Trung bình / GD**: Doanh thu trung bình mỗi giao dịch

### 3. Biểu đồ Doanh thu theo Ngày
- **Loại**: Line Chart
- **Hiển thị**: Xu hướng doanh thu theo từng ngày
- **Tương tác**: 
  - Hover để xem chi tiết
  - Số liệu được format VND
  - Trục X: Ngày (DD/MM)
  - Trục Y: Doanh thu (k = nghìn)

### 4. Biểu đồ Phân bố Trạng thái
- **Loại**: Pie Chart (Biểu đồ tròn)
- **Hiển thị**: Tỷ lệ các trạng thái thanh toán
- **Màu sắc**:
  - 🟢 Xanh lá: Đã thanh toán (PAID)
  - 🟡 Vàng: Chờ thanh toán (PENDING)
  - 🔴 Đỏ: Thất bại (FAILED)
  - ⚪ Xám: Đã hủy (CANCELLED)

### 5. Doanh thu theo Gói Premium
- **Loại**: Bar Chart (Biểu đồ cột)
- **Hiển thị**: So sánh doanh thu các gói Premium
- **2 chỉ số**:
  - Cột xanh dương: Doanh thu
  - Cột xanh lá: Số giao dịch

### 6. Top 10 Khách hàng
- **Bảng hiển thị**:
  - Thứ hạng (1-10)
  - Tên và email khách hàng
  - Tổng chi tiêu (VND)
  - Số giao dịch
  - Ngày giao dịch gần nhất
- **Sắp xếp**: Theo tổng chi tiêu giảm dần

### 7. Giao dịch Gần đây
- **Hiển thị**: 20 giao dịch mới nhất
- **Thông tin**:
  - Mã đơn hàng
  - Thông tin người dùng (tên + email)
  - Gói Premium
  - Số tiền (VND)
  - Trạng thái với icon + badge màu
  - Ngày tạo
  - Ngày thanh toán
- **Phân trang**: 10 records/trang

## Các trạng thái Thanh toán

| Trạng thái | Icon | Màu | Ý nghĩa |
|------------|------|-----|---------|
| PAID | ✅ | Xanh lá | Đã thanh toán thành công |
| PENDING | 🕐 | Vàng | Đang chờ thanh toán |
| FAILED | ❌ | Đỏ | Thanh toán thất bại |
| CANCELLED | 🛑 | Xám | Đã hủy giao dịch |

## Format Tiền tệ

Tất cả số tiền đều được hiển thị theo định dạng Việt Nam:
- **Format**: `123.456.789 ₫`
- **Đơn vị**: VND (Đồng Việt Nam)
- **Trong biểu đồ**: Rút gọn thành `k` (nghìn) để dễ đọc

## Tương tác

### Biểu đồ:
- **Hover**: Xem chi tiết giá trị
- **Tooltip**: Hiển thị thông tin đầy đủ
- **Legend**: Click để ẩn/hiện dữ liệu

### Bảng:
- **Sort**: Click vào tiêu đề cột
- **Scroll**: Trượt ngang khi màn hình nhỏ
- **Pagination**: Chuyển trang ở dưới bảng

## Use Cases

### 1. Xem doanh thu tháng này
```
1. Click vào Date Range Picker
2. Chọn ngày đầu tháng đến hôm nay
3. Xem tất cả thống kê được cập nhật
```

### 2. So sánh doanh thu giữa các tháng
```
1. Chọn tháng 1 (01/01 - 31/01)
2. Ghi nhớ con số
3. Chọn tháng 2 (01/02 - 28/02)
4. So sánh
```

### 3. Tìm khách hàng VIP
```
1. Xem phần "Top 10 Khách hàng"
2. Sắp xếp theo "Tổng chi tiêu"
3. Xem thông tin chi tiết
```

### 4. Kiểm tra giao dịch gần đây
```
1. Cuộn xuống phần "Giao dịch gần đây"
2. Xem trạng thái các giao dịch
3. Click phân trang để xem thêm
```

## Responsive Design

- ✅ Desktop: Full layout với 2-3 cột
- ✅ Tablet: Tự động điều chỉnh thành 1-2 cột
- ✅ Mobile: Hiển thị dọc, scroll ngang cho bảng

## Performance

- ⚡ Tất cả API được gọi song song (Promise.all)
- 🔄 Hot reload khi có thay đổi
- 💾 Dữ liệu được cache trong React state
- 🎯 Chỉ reload khi thay đổi date range

## Tips & Tricks

1. **Xem tổng quan nhanh**: Không chọn date range
2. **Phân tích xu hướng**: Chọn 30-90 ngày gần đây
3. **Kiểm tra conversion**: Xem tỷ lệ chuyển đổi
4. **Tìm gói hot**: Xem biểu đồ "Doanh thu theo gói"
5. **Customer care**: Focus vào Top 10 khách hàng

## Troubleshooting

### Không có dữ liệu?
- Kiểm tra date range có hợp lệ không
- Đảm bảo có giao dịch trong khoảng thời gian đó
- Click "Làm mới" để reload

### Biểu đồ không hiển thị?
- Kiểm tra console log có lỗi không
- Refresh trình duyệt (F5)
- Đảm bảo backend API đang chạy

### Số liệu không đúng?
- Click "Làm mới" để update
- Kiểm tra timezone
- Xác nhận date range đã chọn đúng

## API Endpoints được sử dụng

```
GET /api/admin/payments/summary
GET /api/admin/payments/daily-revenue
GET /api/admin/payments/plan-breakdown
GET /api/admin/payments/status-breakdown
GET /api/admin/payments/top-customers
GET /api/admin/payments/recent-transactions
```

Tất cả endpoints đều support query params:
- `from`: Ngày bắt đầu (YYYY-MM-DD)
- `to`: Ngày kết thúc (YYYY-MM-DD)
- `limit`: Số lượng records (cho top-customers và recent-transactions)
