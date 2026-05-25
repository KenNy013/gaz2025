import { applicationStore } from "@/entities/application/modal/store";
import { Typography, Badge, Card, Flex} from "antd";
import { observer } from "mobx-react-lite";

export const CountApplication = observer(() => {

  const newApplicationsCount = applicationStore.newApplicationsCount;
  const acceptedApplicationsCount = applicationStore.acceptedApplicationsCount;
  const readyApplicationsCount = applicationStore.readyApplicationsCount;

  return (
    <Card>
     <Flex gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Заявки
      </Typography.Title>

        <Badge
            count={newApplicationsCount}
            showZero
            color="orange"
            style={{ width: 40, height: 40, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />

          <Badge
            count={acceptedApplicationsCount}
            showZero
            color="blue"
            style={{ width: 40, height: 40, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />

          <Badge
            count={readyApplicationsCount}
            showZero
            color="green"
            style={{width: 40, height: 40, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
     </Flex>


    </Card>
  );
});
