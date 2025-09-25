import { Layout } from "antd";

export const EmptyChat = () => {
  return (
    <Layout className="flex h-full items-center justify-center bg-white text-gray-400 dark:bg-[#1f1f1f]">
      <div className="text-center">
        <div className="text-xl font-semibold">中央内容区</div>
        <p className="mt-2 text-sm">在这里放置你的地图或其他主要内容。</p>
      </div>
    </Layout>
  );
};
