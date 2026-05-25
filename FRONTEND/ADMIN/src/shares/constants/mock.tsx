
import { UserOutlined, BellOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import type { MenuItemType } from 'antd/lib/menu/interface';
import { NavLink } from 'react-router-dom';
import { ROUTERS } from '../routers';




export type MockAction = {
  disabled: boolean;
  label: React.ReactNode;
  key: string | number;
  href: string,
  icon?: React.ReactNode;
} & Omit<ItemType<MenuItemType>, 'label' | 'key' | 'icon'>;


  export const mockActions:  MockAction[] = [
    { key: "1", label: 'Заявки', icon: <BellOutlined />, disabled: false, href: ROUTERS.HOME},
    { key: "2", label: 'Вопросы', icon: <SafetyCertificateOutlined />, disabled: false, href: ROUTERS.QUESTION},
    { key: "2", label: 'Личный профиль', icon: <UserOutlined />, disabled: true, href: ROUTERS.OTHER},
  ];



  export const getMappedMenuItems = (
  actions: MockAction[],
  unreadCount: number
): ItemType<MenuItemType>[] => {
  return actions.map((item) => {


    let labelContent: React.ReactNode = item.label;

    if (item.href === ROUTERS.QUESTION) {
      labelContent = (
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <span>{item.label as React.ReactNode}</span>
          <Badge
            count={unreadCount}
            offset={[10, 0]}
            color="purple"
            style={{
              borderRadius: "1px"
            }}
          />
        </div>
      );
    }

    if (item.disabled) {
      return {
        ...item,
        label: (
          <Tooltip title="В разработке" placement="right">
            <span style={{ display: 'block', fontSize: '16px', cursor: 'not-allowed', color: 'rgba(0,0,0,0.25)' }}>
              {labelContent}
            </span>
          </Tooltip>
        ),
      };
    }

    return {
      ...item,
      label: (
        <NavLink style={{ fontSize: '16px' }} to={item.href}>
          {labelContent}
        </NavLink>
      ),
    };
  });
};
