import { uiStore } from "@/shares/store/modal-store/model";
import { Modal, Form, Input, Select, Button, Flex, Upload } from "antd";
import { observer } from "mobx-react-lite";
import { GAZ_MODELS, validationRules } from "../model/constant";
import { useCreateApplicationModal } from "../lib/useCreateApplicationModal";
import { applicationStore } from "@/entities/application/modal/store";
import { normalizeFile } from "../lib/normalizeFile";
import { beforeUpload } from "../lib/beforeUpload";



export const CreateApplicationModal = observer(() => {

  const { form, handleSubmit, handleCancel } = useCreateApplicationModal();

  const isOpen = uiStore.isCreateApplicationOpen;
  const isLoading = applicationStore.isLoading;


  return (
    <Modal
      title="Новая заявка на обслуживание"
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel} loading={isLoading}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={() => form.submit()}
        >
          Создать заявку
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ carModel: undefined }}
      >
        <Form.Item
          name="carModel"
          label="Модель автомобиля"
          rules={validationRules.carModel}
        >
          <Select
            placeholder="Выберите из списка"
            options={GAZ_MODELS}
            showSearch
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item name="plate" label="Госномер" rules={validationRules.plate}>
          <Input
            placeholder="А000АА 77"
            style={{ textTransform: "uppercase" }}
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item name="vin" label="VIN номер" rules={validationRules.vin}>
          <Input
            placeholder="XTA..."
            style={{ textTransform: "uppercase" }}
            maxLength={17}
            disabled={isLoading}
          />
        </Form.Item>

        <Flex gap={16}>
          <Form.Item
            name="firstName"
            label="Имя"
            rules={validationRules.firstName}
            style={{ flex: "1 1 50%" }}
          >
            <Input placeholder="Иван" disabled={isLoading} />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Фамилия"
            rules={validationRules.lastName}
            style={{ flex: "1 1 50%" }}
          >
            <Input placeholder="Иванов" disabled={isLoading} />
          </Form.Item>
        </Flex>

        <Flex gap={16}>
          <Form.Item
            name="phone"
            label="Телефон"
            rules={validationRules.phone}
            style={{ flex: "1 1 50%" }}
          >
            <Input placeholder="+7 (999) 000-00-00" disabled={isLoading} />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={validationRules.email}
            style={{ flex: "1 1 50%" }}
          >
            <Input placeholder="mail@example.com" disabled={isLoading} />
          </Form.Item>
        </Flex>

        <Form.Item
          name="photos"
          label="Фотографии автомобиля"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
        >
          <Upload
            listType="picture-card"
            multiple
            maxCount={3}
            disabled={isLoading}
            beforeUpload={beforeUpload}
            accept="image/*"
            style={{width: "100%"}}
          >
            {form.getFieldValue("photos")?.length >= 3 ? null : (
              <div>
                <div style={{ marginTop: 8 }}>Загрузить</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
});



