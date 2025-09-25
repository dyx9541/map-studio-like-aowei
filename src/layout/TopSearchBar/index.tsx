import { FC } from "react";

const TopSearchBar: FC = () => {
  return (
    <div className="no-mobile flex h-12 items-center justify-between bg-[var(--top-search-bar)] px-6 dark:bg-[#141414]">
      <span className="text-base font-semibold text-[#D2E3F8]">Map Studio</span>
      <span className="text-sm text-[#D2E3F8] opacity-80">Top Toolbar Placeholder</span>
    </div>
  );
};

export default TopSearchBar;
