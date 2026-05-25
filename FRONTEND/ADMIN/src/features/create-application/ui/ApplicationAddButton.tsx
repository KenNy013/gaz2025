import { uiStore } from "@/shares/store/modal-store/model";
import { EditOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { observer } from "mobx-react-lite";


export const ApplicationAddButton = observer(() => {

  const handleClick = () => {
    uiStore.openModal("CREATE_APPLICATION");
  }

  return (
   <Card>
     <Button size="large" type="primary" icon={<EditOutlined />} onClick={handleClick}>
      Добавить заявку
    </Button>
   </Card>
  );
});
