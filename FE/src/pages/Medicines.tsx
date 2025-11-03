import { useState, useEffect } from 'react';
import { Table, Card, Tag, Input, Button, Space, message, Modal, Form, InputNumber, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import apiClient from '../utils/axios';
import { MEDICINE_ENDPOINTS } from '../config/api';
import { Medicine, PaginatedResult, ApiResponse } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface MedicineFormData {
  name: string;
  strengthvalue?: number;
  type?: string;
  strengthUnit?: string;
  imageurl?: string;
  notes?: string;
}

const Medicines = () => {
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMedicines();
  }, [pageNumber, pageSize]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResult<Medicine>>>(
        MEDICINE_ENDPOINTS.GET_ALL,
        {
          params: {
            pageNumber,
            pageSize,
          },
        }
      );
      setMedicines(response.data.data.items);
      setTotal(response.data.data.totalCount);
    } catch (error: any) {
      message.error('Không thể tải danh sách thuốc');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMedicine(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    form.setFieldsValue(medicine);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thuốc này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await apiClient.delete(MEDICINE_ENDPOINTS.DELETE(id));
          message.success('Xóa thuốc thành công');
          fetchMedicines();
        } catch (error: any) {
          message.error('Không thể xóa thuốc');
          console.error(error);
        }
      },
    });
  };

  const handleSubmit = async (values: MedicineFormData) => {
    try {
      if (editingMedicine) {
        await apiClient.put(
          MEDICINE_ENDPOINTS.UPDATE(editingMedicine.medicineid),
          values
        );
        message.success('Cập nhật thuốc thành công');
      } else {
        await apiClient.post(MEDICINE_ENDPOINTS.CREATE, values);
        message.success('Thêm thuốc mới thành công');
      }
      setIsModalVisible(false);
      fetchMedicines();
    } catch (error: any) {
      message.error(editingMedicine ? 'Không thể cập nhật thuốc' : 'Không thể thêm thuốc mới');
      console.error(error);
    }
  };

  const columns: ColumnsType<Medicine> = [
    {
      title: 'ID',
      dataIndex: 'medicineid',
      key: 'medicineid',
      width: 80,
      sorter: (a, b) => a.medicineid - b.medicineid,
    },
    {
      title: 'Tên thuốc',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Hàm lượng',
      key: 'strength',
      width: 120,
      render: (_, record) => 
        record.strengthvalue && record.strengthUnit 
          ? `${record.strengthvalue} ${record.strengthUnit}` 
          : '-',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => type ? <Tag color="blue">{type}</Tag> : '-',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageurl',
      key: 'imageurl',
      width: 100,
      render: (url: string) => 
        url ? (
          <img src={url} alt="Medicine" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            N/A
          </div>
        ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (notes: string) => notes || '-',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.medicineid)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Quản lý thuốc</h1>
      
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên thuốc..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchMedicines}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Thêm thuốc mới
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={medicines}
          rowKey="medicineid"
          loading={loading}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} loại thuốc`,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editingMedicine ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên thuốc"
            rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}
          >
            <Input placeholder="Nhập tên thuốc" />
          </Form.Item>

          <Form.Item
            name="strengthvalue"
            label="Hàm lượng"
          >
            <InputNumber
              placeholder="Nhập hàm lượng"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="strengthUnit"
            label="Đơn vị hàm lượng"
          >
            <Select placeholder="Chọn đơn vị">
              <Option value="MG">mg</Option>
              <Option value="ML">ml</Option>
              <Option value="G">g</Option>
              <Option value="MCG">mcg</Option>
              <Option value="IU">IU</Option>
              <Option value="PERCENT">%</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại thuốc"
          >
            <Select placeholder="Chọn loại thuốc">
              <Option value="TABLET">Viên nén</Option>
              <Option value="CAPSULE">Viên nang</Option>
              <Option value="LIQUID">Thuốc nước</Option>
              <Option value="INJECTION">Thuốc tiêm</Option>
              <Option value="TOPICAL">Thuốc bôi ngoài da</Option>
              <Option value="INHALER">Thuốc xịt/hít</Option>
              <Option value="DROPS">Thuốc nhỏ</Option>
              <Option value="POWDER">Thuốc bột</Option>
              <Option value="OTHER">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="imageurl"
            label="URL hình ảnh"
          >
            <Input placeholder="Nhập URL hình ảnh thuốc" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú về thuốc"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMedicine ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Medicines;
