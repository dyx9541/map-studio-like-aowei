import { getSDK } from "@openim/wasm-client-sdk";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useUserStore } from "@/store";
import emitter from "@/utils/events";

const isElectronProd = import.meta.env.MODE !== "development" && window.electronAPI;

export const IMSDK = getSDK({
  coreWasmPath: "./openIM.wasm",
  sqlWasmPath: `${isElectronProd ? ".." : ""}/sql-wasm.wasm`,
});

export const MainContentWrap = () => {
  const updateAppSettings = useUserStore((state) => state.updateAppSettings);

  useEffect(() => {
    window.userClick = (userID?: string) => {
      emitter.emit("OPEN_USER_CARD", {
        userID,
        isSelf: userID === useUserStore.getState().selfInfo.userID,
      });
    };
  }, []);

  useEffect(() => {
    const initSettingStore = async () => {
      if (!window.electronAPI) return;
      updateAppSettings({
        closeAction:
          (await window.electronAPI?.ipcInvoke("getKeyStore", {
            key: "closeAction",
          })) || "quit",
      });
      window.electronAPI?.ipcInvoke("main-win-ready");
    };

    initSettingStore();
  }, []);

  return <Outlet />;
};
