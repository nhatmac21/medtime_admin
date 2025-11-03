import { useState, useEffect } from 'react';
import { Table, Card, Tag, Input, Button, Space, message, Modal, Form, DatePicker, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import apiClient from '../utils/axios';
import { USER_ENDPOINTS } from '../config/api';
import { User, PaginatedResult, ApiResponse } from '../types';
import dayjs from 'dayjs';

const { Option } = Select;

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, [pageNumber, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResult<User>>>(
        USER_ENDPOINTS.GET_ALL,
        {
          params: {
            pageNumber,
            pageSize,
          },
        }
      );
      setUsers(response.data.data.items);
      setTotal(response.data.data.totalCount);
    } catch (error: any) {
      message.error('Không thể tải danh sách người dùng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullname: user.fullname,
      dateofbirth: user.dateofbirth ? dayjs(user.dateofbirth) : null,
      gender: user.gender,
      phonenumber: user.phonenumber,
      timezone: user.timezone,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateUser = async (values: any) => {
    if (!editingUser) return;

    try {
      const updateData = {
        fullname: values.fullname,
        dateofbirth: values.dateofbirth ? values.dateofbirth.format('YYYY-MM-DD') : null,
        gender: values.gender,
        phonenumber: values.phonenumber,
        timezone: values.timezone,
      };

      await apiClient.put(
        USER_ENDPOINTS.UPDATE(editingUser.userid),
        updateData
      );

      message.success('Cập nhật thông tin người dùng thành công');
      setIsEditModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error: any) {
      message.error('Không thể cập nhật thông tin người dùng');
      console.error(error);
    }
  };

  const handleViewDetails = (user: User) => {
    Modal.info({
      title: 'Chi tiết người dùng',
      width: 600,
      content: (
        <div>
          <p><strong>ID:</strong> {user.userid}</p>
          <p><strong>Họ tên:</strong> {user.fullname}</p>
          <p><strong>Username:</strong> {user.userName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số điện thoại:</strong> {user.phonenumber || 'Chưa cập nhật'}</p>
          <p><strong>Giới tính:</strong> {user.gender || 'Chưa cập nhật'}</p>
          <p><strong>Ngày sinh:</strong> {user.dateofbirth || 'Chưa cập nhật'}</p>
          <p><strong>Vai trò:</strong> <Tag color={user.role === 'ADMIN' ? 'red' : 'blue'}>{user.role}</Tag></p>
          <p><strong>Timezone:</strong> {user.timezone || 'Chưa cập nhật'}</p>
          <p><strong>Unique Code:</strong> {user.uniquecode || 'Chưa có'}</p>
          <p>
            <strong>Trạng thái Premium:</strong>{' '}
            {user.ispremium ? (
              <Tag color="gold" icon={<CheckCircleOutlined />}>
                Premium
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />}>
                Free
              </Tag>
            )}
          </p>
          {user.ispremium && (
            <>
              <p><strong>Bắt đầu Premium:</strong> {user.premiumstart ? dayjs(user.premiumstart).format('DD/MM/YYYY HH:mm') : 'N/A'}</p>
              <p><strong>Kết thúc Premium:</strong> {user.premiumend ? dayjs(user.premiumend).format('DD/MM/YYYY HH:mm') : 'N/A'}</p>
            </>
          )}
        </div>
      ),
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'userid',
      key: 'userid',
      width: 80,
      sorter: (a, b) => a.userid - b.userid,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      key: 'fullname',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.fullname.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.email.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.userName.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>{role}</Tag>
      ),
      filters: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Premium',
      dataIndex: 'ispremium',
      key: 'ispremium',
      width: 120,
      render: (isPremium: boolean, record: User) => (
        isPremium ? (
          <Tag color="gold" icon={<CheckCircleOutlined />}>
            Premium
            {record.premiumend && (
              <div style={{ fontSize: '11px', marginTop: 4 }}>
                Đến: {dayjs(record.premiumend).format('DD/MM/YYYY')}
              </div>
            )}
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />}>
            Free
          </Tag>
        )
      ),
      filters: [
        { text: 'Premium', value: true },
        { text: 'Free', value: false },
      ],
      onFilter: (value, record) => record.ispremium === value,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Quản lý người dùng</h1>
      
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên, email, username..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
          >
            Làm mới
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="userid"
          loading={loading}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Edit User Modal */}
      <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateUser}
        >
          <Form.Item
            name="fullname"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            name="dateofbirth"
            label="Ngày sinh"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
          >
            <Select placeholder="Chọn giới tính" allowClear>
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
              <Option value="OTHER">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phonenumber"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^[0-9]{10,11}$/,
                message: 'Số điện thoại không hợp lệ!',
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="timezone"
            label="Múi giờ"
          >
            <Select placeholder="Chọn múi giờ" allowClear>
              <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</Option>
              <Option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</Option>
              <Option value="Asia/Singapore">Asia/Singapore (GMT+8)</Option>
              <Option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</Option>
              <Option value="America/New_York">America/New_York (GMT-5)</Option>
              <Option value="Europe/London">Europe/London (GMT+0)</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
