import { Layout } from "antd";

export const QueryChat = () => {
  return (
    <Layout className="flex h-full flex-col bg-white p-6 dark:bg-[#1f1f1f]">
      <header className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
        场景内容
      </header>
      <main className="flex flex-1 items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-400 dark:border-gray-600">
        在此区域渲染自定义的地图或功能模块。
      </main>
    </Layout>
  );
};
