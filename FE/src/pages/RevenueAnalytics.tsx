import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Space,
  Spin,
  message,
  Table,
  Tag,
  Button,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DollarOutlined,
  TransactionOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import apiClient from '../utils/axios';
import { ADMIN_PAYMENT_ENDPOINTS } from '../config/api';
import {
  PaymentSummary,
  PaymentDailyRevenue,
  PaymentPlanBreakdown,
  PaymentStatusBreakdown,
  PaymentTopCustomer,
  PaymentRecentTransaction,
  ApiResponse,
} from '../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const STATUS_COLORS = {
  PAID: '#52c41a',
  PENDING: '#faad14',
  FAILED: '#ff4d4f',
  CANCELLED: '#d9d9d9',
};

const STATUS_LABELS = {
  PAID: 'Đã thanh toán',
  PENDING: 'Chờ thanh toán',
  FAILED: 'Thất bại',
  CANCELLED: 'Đã hủy',
};

const RevenueAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [dailyRevenue, setDailyRevenue] = useState<PaymentDailyRevenue[]>([]);
  const [planBreakdown, setPlanBreakdown] = useState<PaymentPlanBreakdown[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<PaymentStatusBreakdown[]>([]);
  const [topCustomers, setTopCustomers] = useState<PaymentTopCustomer[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<PaymentRecentTransaction[]>([]);

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateRange) {
        params.from = dateRange[0].format('YYYY-MM-DD');
        params.to = dateRange[1].format('YYYY-MM-DD');
      }

      const [
        summaryRes,
        dailyRes,
        planRes,
        statusRes,
        customersRes,
        transactionsRes,
      ] = await Promise.all([
        apiClient.get<ApiResponse<PaymentSummary>>(
          ADMIN_PAYMENT_ENDPOINTS.SUMMARY,
          { params }
        ),
        apiClient.get<ApiResponse<PaymentDailyRevenue[]>>(
          ADMIN_PAYMENT_ENDPOINTS.DAILY_REVENUE,
          { params }
        ),
        apiClient.get<ApiResponse<PaymentPlanBreakdown[]>>(
          ADMIN_PAYMENT_ENDPOINTS.PLAN_BREAKDOWN,
          { params }
        ),
        apiClient.get<ApiResponse<PaymentStatusBreakdown[]>>(
          ADMIN_PAYMENT_ENDPOINTS.STATUS_BREAKDOWN,
          { params }
        ),
        apiClient.get<ApiResponse<PaymentTopCustomer[]>>(
          ADMIN_PAYMENT_ENDPOINTS.TOP_CUSTOMERS,
          { params: { ...params, limit: 10 } }
        ),
        apiClient.get<ApiResponse<PaymentRecentTransaction[]>>(
          ADMIN_PAYMENT_ENDPOINTS.RECENT_TRANSACTIONS,
          { params: { ...params, limit: 20 } }
        ),
      ]);

      setSummary(summaryRes.data.data);
      setDailyRevenue(dailyRes.data.data);
      setPlanBreakdown(planRes.data.data);
      setStatusBreakdown(statusRes.data.data);
      setTopCustomers(customersRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
    } catch (error: any) {
      message.error('Không thể tải dữ liệu thống kê thu nhập');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const transactionColumns: ColumnsType<PaymentRecentTransaction> = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
      render: (orderId: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {orderId}
        </span>
      ),
    },
    {
      title: 'Người dùng',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.userFullName || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {record.userEmail}
          </div>
        </div>
      ),
    },
    {
      title: 'Gói',
      dataIndex: 'planName',
      key: 'planName',
      width: 150,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount: number) => (
        <span style={{ fontWeight: 500, color: '#52c41a' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: keyof typeof STATUS_LABELS) => {
        const icons = {
          PAID: <CheckCircleOutlined />,
          PENDING: <ClockCircleOutlined />,
          FAILED: <CloseCircleOutlined />,
          CANCELLED: <StopOutlined />,
        };
        return (
          <Tag color={STATUS_COLORS[status]} icon={icons[status]}>
            {STATUS_LABELS[status]}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) =>
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paidAt',
      key: 'paidAt',
      width: 150,
      render: (date: string) =>
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
  ];

  const customerColumns: ColumnsType<PaymentTopCustomer> = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.fullName || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      align: 'right',
      render: (amount: number) => (
        <span style={{ fontWeight: 500, color: '#52c41a' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'transactions',
      key: 'transactions',
      align: 'center',
    },
    {
      title: 'Giao dịch gần nhất',
      dataIndex: 'lastPaymentAt',
      key: 'lastPaymentAt',
      render: (date: string) =>
        date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
  ];

  if (loading && !summary) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Thống kê Thu nhập</h1>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAllData}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={summary.totalRevenue}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng giao dịch"
                value={summary.totalTransactions}
                prefix={<TransactionOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã thanh toán"
                value={summary.paidTransactions}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix={`/ ${summary.totalTransactions}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tỷ lệ chuyển đổi"
                value={summary.paidConversionRate}
                suffix="%"
                precision={2}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Additional Summary Cards */}
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Chờ thanh toán"
                value={summary.pendingTransactions}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Thất bại"
                value={summary.failedTransactions}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Trung bình / GD"
                value={summary.averageRevenuePerPaidTransaction}
                valueStyle={{ color: '#1890ff' }}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Doanh thu theo ngày" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => dayjs(value).format('DD/MM')}
                />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => dayjs(label).format('DD/MM/YYYY')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#52c41a"
                  strokeWidth={2}
                  name="Doanh thu"
                  dot={{ fill: '#52c41a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố trạng thái" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) =>
                    `${STATUS_LABELS[entry.status as keyof typeof STATUS_LABELS]}: ${entry.count}`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Plan Breakdown */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="Doanh thu theo gói Premium" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={planBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="planName" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#1890ff" name="Doanh thu" />
                <Bar dataKey="transactions" fill="#52c41a" name="Số giao dịch" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Customers */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="Top 10 Khách hàng" loading={loading}>
            <Table
              columns={customerColumns}
              dataSource={topCustomers}
              rowKey="userId"
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Giao dịch gần đây" loading={loading}>
            <Table
              columns={transactionColumns}
              dataSource={recentTransactions}
              rowKey="paymentId"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} giao dịch`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueAnalytics;
