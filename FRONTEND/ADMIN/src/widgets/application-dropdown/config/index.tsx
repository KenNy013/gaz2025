import type { ApplicationEntity } from "@/entities/application/types";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, type MenuProps } from "antd";


interface MenuActions {
  onEdit: (record: ApplicationEntity) => void;
  onDelete: (id: string) => void;
  onView?: (record: ApplicationEntity) => void;
}


export const getApplicationMenuItems = (
  record: ApplicationEntity,
  actions: MenuActions
): MenuProps['items'] => [
  {
    key: 'edit',
    label: 'Редактировать',
    icon: <EditOutlined />,
    onClick: () => actions.onEdit(record),
  },
  {
    key: 'view',
    label: 'Посмотреть детали',
    icon: <EyeOutlined />,
    disabled: true,
    onClick: () => actions.onView?.(record),
  },
  {
    type: 'divider',
  },
  {
    key: 'delete',
    label: 'Удалить заявку',
    icon: <DeleteOutlined />,
    danger: true,
    onClick: () => {
     Modal.confirm({
        title: 'Удаление заявки',
        content: `Вы уверены, что хотите удалить заявку ${record.plate}? Это действие нельзя отменить.`,
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
