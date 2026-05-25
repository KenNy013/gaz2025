import { Table, Tag, Space, Image, Typography} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ApplicationEntity } from '../types';
import { AdminDropdown } from '@/widgets/application-dropdown';
import { applicationStore } from '../modal/store';
import { uiStore } from '@/shares/store/modal-store/model';

const { Text } = Typography;

interface Props {
  data: ApplicationEntity[];
  onEdit: (record: ApplicationEntity) => void;
  loading?: boolean;
}

export const ApplicationTable = ({ data, loading }: Props) => {




  const columns: ColumnsType<ApplicationEntity> = [
{
      title: 'Автомобиль',
      key: 'car',
      sorter: (a, b) => a.carModel.localeCompare(b.carModel),
      render: (_, rec) => (
        <Space direction="vertical" size={0}>
          <Text strong>{rec.plate}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{rec.carModel}</Text>
        </Space>
      )
    },
    {
      title: 'VIN',
      dataIndex: 'vin',
      key: 'vin',
      render: (vin: string) => (
        <Text copyable={{ tooltips: ['Копировать', 'Скопировано!'] }} code>
          {vin}
        </Text>
      ),
    },
   {
      title: 'ФИО клиента',
      key: 'name',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      render: (_, rec) => `${rec.firstName} ${rec.lastName}`
    },
    {
      title: 'Фото',
      dataIndex: 'photos',
      key: 'photos',
      render: (photos: string[]) => {


        if(photos.length === 0) {
          return <Text type="secondary">Нет фото</Text>;
        }


        return (
          <Space size={4} wrap>
            <Image.PreviewGroup>
              {photos.map((url, index) => {
                return (
                <Image
                  key={index}
                  src={import.meta.env.VITE_API_SERVER+url}
                  alt={`Фото машины ${index + 1}`}
                  width={40}
                  height={40}
                  style={{ borderRadius: '4px', objectFit: 'cover' }}
                />
              )
              })}
            </Image.PreviewGroup>
          </Space>
        )
      },
    },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone'},
    { title: 'E-mail', dataIndex: 'email', key: 'email'},
    { title: "Модель", dataIndex: 'carModel', key: 'carModel'},
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => {
        const colors: Record<string, string> = { WAITING: 'orange', ACCEPTED: 'blue', READY: 'green' };
        const labels: Record<string, string> = { WAITING: 'Ожидание', ACCEPTED: 'В работе', READY: 'Готово' };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      }
    },
  ];



  return <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1400 }}
      onRow={() => ({
        onContextMenu: (event) => {
          event.preventDefault();
        },
      })}

    components={{
        body: {
          row: ({ children, ...props }) => {
            const record = data.find((item) => item.id === props['data-row-key']);

            if (!record) return <tr {...props}>{children}</tr>;

            return (
              <AdminDropdown
                record={record}
                onEdit={()=> {
                    applicationStore.setSelectedApplication(record);
                    uiStore.openModal("VIEW_APPLICATION");
                }}
                onDelete={(id) =>{
                 applicationStore.deleteApplication(id)
                }}
              >
                {children}
              </AdminDropdown>
            );
          },
        },
      }}
    />
};
