import { message, Upload } from "antd";


export const beforeUpload = (file: { type: string; size: number }) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("Можно загружать только изображения!");
    return Upload.LIST_IGNORE;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("Изображение не должно превышать 5 МБ!");
    return Upload.LIST_IGNORE;
  }
  return false;
};
