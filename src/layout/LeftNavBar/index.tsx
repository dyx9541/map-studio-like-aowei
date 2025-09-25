import { Layout } from "antd";
import type { FC } from "react";

const { Sider } = Layout;

const LeftNavBar: FC = () => {
  return (
    <Sider
      className="no-mobile flex items-center justify-center border-r border-gray-200 !bg-[#F4F4F4] text-xs text-gray-500 dark:border-gray-800 dark:!bg-[#141414]"
      width={72}
      theme="light"
    >
      左侧占位
    </Sider>
  );
};

export default LeftNavBar;
