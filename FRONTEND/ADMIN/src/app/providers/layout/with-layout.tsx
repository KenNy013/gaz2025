import { Layout, notification } from "antd";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/widgets/admin-sidebar";
import { useEffect, useState } from "react";
import { reaction } from "mobx";
import { inquiryStore } from "@/entities/question/modal/store";

const { Content } = Layout;

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 80 : 280;

  useEffect(() => {
    inquiryStore.fetchCounts();

    const interval = setInterval(() => {
      inquiryStore.fetchCounts();
    }, 5000);

    const disposeReaction = reaction(
      () => inquiryStore.totalCount,
      (newTotal, prevTotal) => {
        if (prevTotal !== 0 && newTotal > prevTotal) {
          notification.info({
            message: "Новое сообщение",
            description: "Поступило новое обращение от клиента.",
            placement: "topRight",
            duration: 5,
          });
        }
      }
    );

    return () => {
      clearInterval(interval);
      disposeReaction();
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.2s ease-in-out",
        }}
      >
        <Content style={{ padding: "24px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
