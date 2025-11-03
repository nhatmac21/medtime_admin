import { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Button } from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import apiClient from '../utils/axios';
import { STATISTICS_ENDPOINTS } from '../config/api';
import { DashboardStatistics, ApiResponse } from '../types';

// Cache duration: 2 minutes
const CACHE_DURATION = 2 * 60 * 1000;
let cachedData: { data: DashboardStatistics; timestamp: number } | null = null;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && cachedData) {
      const now = Date.now();
      if (now - cachedData.timestamp < CACHE_DURATION) {
        console.log('📊 Using cached dashboard data');
        setStats(cachedData.data);
        setLastUpdated(new Date(cachedData.timestamp));
        return;
      }
    }

    setLoading(true);
    try {
      console.log('🔄 Fetching fresh dashboard data from API...');
      const startTime = Date.now();
      
      const response = await apiClient.get<ApiResponse<DashboardStatistics>>(
        STATISTICS_ENDPOINTS.DASHBOARD
      );
      
      const endTime = Date.now();
      console.log(`⏱️ API response time: ${endTime - startTime}ms`);
      
      const data = response.data.data;
      const timestamp = Date.now();
      
      // Update cache
      cachedData = { data, timestamp };
      
      setStats(data);
      setLastUpdated(new Date(timestamp));
    } catch (error: any) {
      message.error('Không thể tải dữ liệu dashboard');
      console.error('❌ Dashboard API error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize chart data để tránh re-render không cần thiết
  const intakeData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Đã uống', value: stats.completedIntakesToday, color: '#52c41a' },
      { name: 'Bỏ lỡ', value: stats.missedIntakesToday, color: '#ff4d4f' },
      { name: 'Sắp tới', value: stats.upcomingIntakesToday, color: '#faad14' },
    ];
  }, [stats]);

  const barData = useMemo(() => {
    if (!stats) return [];
    return [
      {
        name: 'Tổng quan',
        'Đơn thuốc': stats.totalPrescriptions,
        'Thuốc': stats.totalMedicines,
        'Liều hôm nay': stats.totalIntakesToday,
      },
    ];
  }, [stats]);

  if (loading && !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải dữ liệu dashboard..." />
        <p style={{ marginTop: 16, color: '#888' }}>
          Đang tải thống kê từ server...
        </p>
      </div>
    );
  }

  if (!stats && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Không có dữ liệu</p>
        <Button onClick={() => fetchDashboardData(true)}>Thử lại</Button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Dashboard - Tổng quan hệ thống</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {lastUpdated && (
            <span style={{ color: '#888', fontSize: '14px' }}>
              Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
          )}
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={() => fetchDashboardData(true)}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>
      </div>

      {loading && stats && (
        <div style={{ marginBottom: 16, padding: '8px 16px', background: '#e6f7ff', borderRadius: 4 }}>
          <Spin size="small" style={{ marginRight: 8 }} />
          Đang cập nhật dữ liệu...
        </div>
      )}

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn thuốc"
              value={stats.totalPrescriptions}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn thuốc đang hoạt động"
              value={stats.activePrescriptions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số thuốc"
              value={stats.totalMedicines}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ tuân thủ"
              value={stats.overallAdherenceRate.toFixed(1)}
              suffix="%"
              prefix={<UserOutlined />}
              valueStyle={{ color: stats.overallAdherenceRate >= 80 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Today's Intake Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã uống hôm nay"
              value={stats.completedIntakesToday}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Bỏ lỡ hôm nay"
              value={stats.missedIntakesToday}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sắp tới hôm nay"
              value={stats.upcomingIntakesToday}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê tổng quan">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Đơn thuốc" fill="#8884d8" />
                <Bar dataKey="Thuốc" fill="#82ca9d" />
                <Bar dataKey="Liều hôm nay" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tình trạng uống thuốc hôm nay">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={intakeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {intakeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      {stats.recentActivity && (
        <Card title="Hoạt động gần đây" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic
                title="Lần uống thuốc gần nhất"
                value={stats.recentActivity.lastIntakeTime ? new Date(stats.recentActivity.lastIntakeTime).toLocaleString('vi-VN') : 'Chưa có'}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Thuốc đã uống"
                value={stats.recentActivity.lastMedicineTaken || 'Chưa có'}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Số ngày tuân thủ liên tục"
                value={stats.recentActivity.consecutiveDaysCompliant}
                suffix="ngày"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
