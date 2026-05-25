import { Table, Tag, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { InquiryEntity } from "../type";
import dayjs from "dayjs";
import { QuestionDropdown } from "@/widgets/question-dropdown";
import { inquiryStore } from "../modal/store";

const { Text, Paragraph } = Typography;

interface QuestionTableProps {
  data: InquiryEntity[];
  loading?: boolean;
}

export const QuestionTable = ({ data, loading }: QuestionTableProps) => {
  const columns: ColumnsType<InquiryEntity> = [
    {
      title: "Клиент",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "Контакты",
      key: "contacts",
      render: (_, rec) => (
        <Space direction="vertical" size={0}>
          <Text copyable>{rec.phone}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {rec.email}
          </Text>
        </Space>
      ),
    },
    {
      title: "Сообщение",
      dataIndex: "message",
      key: "message",
      width: 600,
      render: (message: string) => (
        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "еще" }}>
          {message}
        </Paragraph>
      ),
    },
    {
      title: "Статус",
      dataIndex: "isRead",
      key: "status",
      filters: [
        { text: "Новые", value: false },
        { text: "Прочитано", value: true },
      ],
      onFilter: (value, record) => record.isRead === value,
      render: (isRead: boolean) => (
        <Tag color={isRead ? "green" : "blue"}>
          {isRead ? "Прочитано" : "Новое"}
        </Tag>
      ),
    },
    {
      title: "Дата получения",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => dayjs(date).format("DD.MM.YYYY HH:mm"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}

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
                    <QuestionDropdown
                      record={record}
                      onEdit={(id)=> {
                        inquiryStore.updateReadStatus(id, true)
                      }}
                      onDelete={(id) =>{
                        inquiryStore.deleteInquiry(id)
                      }}
                    >
                      {children}
                    </QuestionDropdown>
                  );
                },
              },
            }}
    />
  );
};
