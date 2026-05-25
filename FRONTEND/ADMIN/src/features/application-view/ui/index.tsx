import {
  Modal,
  Carousel,
  Descriptions,
  Select,
  Input,
  Button,
  message,
} from "antd";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

import type { ApplicationEntity } from "@/entities/application/types";
import { STATUS_LABELS } from "@/shares/constants/api";
import { uiStore } from "@/shares/store/modal-store/model";
import { applicationStore } from "@/entities/application/modal/store";

export const ApplicationViewModal = observer(() => {
  const isOpen = uiStore.isViewApplicationOpen;
  const application = applicationStore.selectedApplication;
  const loading = applicationStore.isLoading;

  const [status, setStatus] = useState<ApplicationEntity["status"]>("WAITING");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setComment(application.message || "");
    }
  }, [application]);

  const handleClose = () => {
    uiStore.closeModal();
    setTimeout(() => applicationStore.setSelectedApplication(null), 300);
  };

  const handleSave = async () => {
    if (!application) return;
    try {
      await applicationStore.updateStatus(application.id, status, comment);
      message.success("Статус заявки обновлен");
      handleClose();
    } catch (e) {
      message.error("Не удалось обновить статус");
    }
  };

  if (!application) return null;

  const photos = Array.isArray(application.photos)
    ? application.photos
    : JSON.parse(application.photos || "[]");

  return (
    <Modal
      title={`Заявка: ${application.plate}`}
      open={isOpen}
      onCancel={handleClose}
      width={800}
      footer={[
        <Button key="close" onClick={handleClose}>
          Закрыть
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          Сохранить изменения
        </Button>,
      ]}
    >
      <div
        style={{
          marginBottom: 24,
          background: "#f5f5f5",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {photos.length > 0 ? (
          <Carousel arrows infinite={false}>
            {photos.map((src: string, i: number) => (
              <div key={i}>
                <img
                  src={import.meta.env.VITE_API_SERVER +src}
                  alt={`Фото машины ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div
            style={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Фото отсутствуют
          </div>
        )}
      </div>

      <Descriptions title="Информации об автомобиле" bordered column={2}>
        <Descriptions.Item label="Модель">
          {application.carModel}
        </Descriptions.Item>
        <Descriptions.Item label="Госномер">
          {application.plate}
        </Descriptions.Item>
        <Descriptions.Item label="VIN" span={2}>
          {application.vin}
        </Descriptions.Item>
        <Descriptions.Item label="Клиент">{`${application.firstName} ${application.lastName}`}</Descriptions.Item>
        <Descriptions.Item label="Телефон">
          {application.phone}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="Добавить информацию" bordered column={2}>
        <Descriptions.Item label="Статус" span={2}>
          <Select
            value={status}
            onChange={(val) => setStatus(val)}
            style={{ width: 200 }}
            options={Object.entries(STATUS_LABELS).map(([key, val]) => ({
              label: typeof val === "string" ? val : val.label,
              value: key,
            }))}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Комментарий" span={2}>
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Напишите сообщение для клиента..."
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
});
