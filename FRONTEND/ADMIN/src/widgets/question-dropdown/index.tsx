import { Dropdown } from "antd";
import { getQuestionMenuItems } from "./config";
import type { InquiryEntity } from "@/entities/question/type";




interface IAdminDropdown {
  record: InquiryEntity;
  onDelete: (id: string) => void;
  onEdit: (id:string) => void;
  children: React.ReactNode;
}


export function QuestionDropdown ({ onDelete, children, onEdit, record}: IAdminDropdown){

const items = getQuestionMenuItems(record, { onEdit, onDelete });

  return (
     <Dropdown menu={{ items }} trigger={['contextMenu']}>
          <tr>{children}</tr>
      </Dropdown>
  )
}
