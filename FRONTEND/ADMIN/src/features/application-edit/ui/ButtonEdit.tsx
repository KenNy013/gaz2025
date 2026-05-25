import { uiStore } from "@/shares/store/modal-store/model";
import { EditOutlined } from "@ant-design/icons";
import { Button} from "antd";
import { observer } from "mobx-react-lite";


export const ButtonEdit = observer(() => {

  const handleClick = () => {
    uiStore.openModal("CREATE_APPLICATION");
  }

  return (
     <Button size="small" type="dashed" icon={<EditOutlined />} onClick={handleClick}>
      Добавить заявку
    </Button>
  );
});
