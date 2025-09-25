import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export const Chat = () => {
  return (
    <Layout className="h-full">
      <Content className="flex h-full items-center justify-center !bg-[var(--chat-bg,#f7f7f7)]">
        <div className="h-full w-full max-w-5xl rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1f1f1f]">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};
