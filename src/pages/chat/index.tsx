import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

export const Chat = () => {
  return (
    <Layout className="h-full flex-row">
      <Sider
        width={240}
        theme="light"
        className="no-mobile flex items-center justify-center border-r border-gray-200 !bg-white text-sm text-gray-500 dark:border-gray-800 dark:!bg-[#141414]"
      >
        左侧面板
      </Sider>
      <Content className="h-full !bg-[var(--chat-bg,#f7f7f7)]">
        <div className="flex h-full w-full">
          <div className="flex-1 border-r border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#1f1f1f]">
            <Outlet />
          </div>
          <aside className="no-mobile w-72 bg-white p-6 text-sm text-gray-500 dark:bg-[#1f1f1f]">
            右侧面板
          </aside>
        </div>
      </Content>
    </Layout>
  );
};
