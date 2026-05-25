import { ApplicationAddButton } from '@/features/create-application/ui/ApplicationAddButton';
import { CountApplication } from '@/features/count-application';
import { Card, Col,  Row, Typography } from 'antd';

const { Title, Text } = Typography;

export const ApplicationHeader = () => {
  return (
    <Row style={{ marginBottom: 24 }} gutter={16}>
      <Col span={12}>
       <Card>
         <Title level={1} style={{ marginBottom: 8 }}>
          Управление заявками
        </Title>
        <Text  style={{ margin: '8px 0 0 0' }}>
          Здесь вы можете просматривать, фильтровать и редактировать все
          входящие заявки. Используйте поиск и фильтры для быстрого
          нахождения нужных записей.
        </Text>
       </Card>
      </Col>

      <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 8 }}>
        <CountApplication />
        <ApplicationAddButton />
      </Col>
    </Row>
  );
};
