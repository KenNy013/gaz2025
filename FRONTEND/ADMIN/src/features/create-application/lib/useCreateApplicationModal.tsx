import { Form, message } from "antd";
import { uiStore } from "@/shares/store/modal-store/model";
import { applicationStore } from "@/entities/application/modal/store";
import type { UploadFile } from "antd";

interface ApplicationFormValues {
  carModel: string;
  plate: string;
  vin: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photos?: UploadFile[];
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      field?: 'plate' | 'vin';
      details?: string;
      error?: string;
    };
  };
}

export const useCreateApplicationModal = () => {
  const [form] = Form.useForm<ApplicationFormValues>();

  const handleSubmit = async (values: ApplicationFormValues) => {
    try {
      const formData = new FormData();

      (Object.keys(values) as Array<keyof ApplicationFormValues>).forEach((key) => {
        if (key !== "photos" && values[key] !== undefined && values[key] !== null) {
          const value = values[key];
          if (typeof value === "string") {
            formData.append(key, value);
          }
        }
      });

      if (values.photos && values.photos.length > 0) {
        values.photos.forEach((fileItem: UploadFile) => {
          if (fileItem.originFileObj) {
            formData.append("photos", fileItem.originFileObj);
          }
        });
      }

      const success = await applicationStore.createApplication(formData);

      if (success) {
        form.resetFields();
        uiStore.closeModal();
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      const status = err.response?.status;
      const serverData = err.response?.data;

      if (status === 409 && serverData?.field) {
        form.setFields([
          {
            name: serverData.field,
            errors: [serverData.details || 'Это значение уже используется'],
          },
        ]);
      } else {
        const errorMessage = serverData?.details || serverData?.error || "Произошла ошибка при отправке заявки";
        message.error(errorMessage);
      }

      console.error("Submission Error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    uiStore.closeModal();
  };

  return {
    form,
    handleSubmit,
    handleCancel,
  };
};
