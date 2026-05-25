import type { ApplicationEntity } from "@/entities/application/types";
import { Dropdown } from "antd";
import { getApplicationMenuItems } from "./config";



interface IAdminDropdown {
  record: ApplicationEntity;
  children: React.ReactNode;
  onEdit: (record: ApplicationEntity) => void;
  onDelete: (id: string) => void;
}


export function AdminDropdown ({ record, children, onEdit, onDelete }: IAdminDropdown){

const items = getApplicationMenuItems(record, { onEdit, onDelete });

  return (
     <Dropdown menu={{ items }} trigger={['contextMenu']}>
          <tr>{children}</tr>
      </Dropdown>
  )
}
