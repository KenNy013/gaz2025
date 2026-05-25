import { Card, Col,  Row, Typography } from 'antd';

const { Title, Text } = Typography;

export const QuestionManager = () => {
  return (
    <Row style={{ marginBottom: 24 }} gutter={16}>
      <Col span={12}>
       <Card>
         <Title level={1} style={{ marginBottom: 8 }}>
          Вопросы пользователей
        </Title>
        <Text  style={{ margin: '8px 0 0 0' }}>
          Здесь вы можете просматривать, фильтровать и редактировать все
          входящие заявки. Используйте поиск и фильтры для быстрого
          нахождения нужных записей.
        </Text>
       </Card>
      </Col>
    </Row>
  );
};
