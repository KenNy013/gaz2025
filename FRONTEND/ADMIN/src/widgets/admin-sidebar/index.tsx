import {
  Layout,
  Avatar,
  Typography,
  Menu,
  Flex,
  Popconfirm,
  type PopconfirmProps,
} from "antd";
import { observer } from "mobx-react-lite";
import { userStore } from "@/entities/user/model/store";
import { useMemo } from "react";
import { UserOutlined} from "@ant-design/icons";
import { getMappedMenuItems, mockActions } from "@/shares/constants/mock";
import { LogoutButton } from "@/features/auth-logout/ui/LogoutButton";
import { inquiryStore } from "@/entities/question/modal/store";

const { Sider } = Layout;
const { Text } = Typography;

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export const AdminSidebar = observer(({ collapsed, setCollapsed }: AdminSidebarProps) => {
  const { user } = userStore;
  const { totalCount, unreadCount} = inquiryStore

  const confirm: PopconfirmProps["onConfirm"] = () => {
    userStore.setAuth(false);
  };


  const menuItems = useMemo(() => getMappedMenuItems(mockActions, unreadCount), [totalCount, unreadCount]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
      width={280}
      collapsedWidth={80}
    >
      <Flex
        justify="center"
        align="center"
        vertical
        style={{
          padding: collapsed ? "24px 0" : "40px 24px",
          transition: "all 0.3s",
        }}
      >
        <Avatar
          size={collapsed ? 48 : 96}
          icon={<UserOutlined />}
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            fontSize: collapsed ? "24px" : "48px",
          }}
        />
        {!collapsed && (
          <Flex vertical align="center">
            <Text
              style={{
                color: "#fff",
                marginTop: 2,
                display: "block",
                maxWidth: 200,
                fontSize: "20px",
                fontWeight: 500,
              }}
              ellipsis
            >
              {user?.firstName + " " + user?.lastName || "Администратор"}
            </Text>

            <Text
              style={{
                color: "#fff",
                opacity: 0.75,
                display: "block",
                fontSize: "12px",
                fontWeight: 400,
              }}
              ellipsis
            >
              Администратор
            </Text>
          </Flex>
        )}
      </Flex>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems}
      />

      <div
        style={{
          marginTop: "auto",
          padding: collapsed ? "16px 8px" : "24px",
          transition: "all 0.3s",
        }}
      >
        <Popconfirm
          placement="right"
          title="Выйти из системы?"
          onConfirm={confirm}
          okText="Да"
          cancelText="Нет"
        >
        <LogoutButton collapsed={collapsed}/>
        </Popconfirm>
      </div>
    </Sider>
  );
});
