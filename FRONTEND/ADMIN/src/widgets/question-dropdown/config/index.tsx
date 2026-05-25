import type { InquiryEntity } from "@/entities/question/type";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, type MenuProps } from "antd";


interface MenuActions {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}


export const getQuestionMenuItems = (
  record: InquiryEntity,
  actions: MenuActions
): MenuProps['items'] => [
  {
    key: 'edit',
    label: 'Прочитать',
    icon: <EditOutlined />,
    onClick: () => actions.onEdit(record.id),
  },
  {
    key: 'delete',
    label: 'Удалить вопрос',
    icon: <DeleteOutlined />,
    danger: true,
    onClick: () => {
     Modal.confirm({
        title: 'Удаление заявки',
        content: `Вы уверены, что хотите удалить заявку? Это действие нельзя отменить.`,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        centered: true,
        onOk: () => {
          actions.onDelete(record.id);
        },
      });
    },
  },
];
