import { EnvironmentOutlined } from "@ant-design/icons";
import { FloatButton, Layout, Modal, Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd/es/radio";
import { useEffect, useRef, useState } from "react";

type BaseLayer = {
  id: string;
  name: string;
  tiles: string[];
  attribution?: string;
  tileSize?: number;
};

const tiandituToken = import.meta.env.VITE_TIANDITU_TOKEN ?? "";

const MAPBOX_JS_URL = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
const MAPBOX_CSS_URL = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";

const baseLayers: BaseLayer[] = [
  {
    id: "arcgis",
    name: "ArcGIS 影像",
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution:
      '&copy; <a href="https://www.esri.com/en-us/home" target="_blank" rel="noopener noreferrer">Esri</a>',
  },
  {
    id: "tianditu",
    name: "天地图影像",
    tiles: [
      `https://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`,
    ],
    attribution:
      '&copy; <a href="https://www.tianditu.gov.cn/" target="_blank" rel="noopener noreferrer">天地图</a>',
  },
  {
    id: "gaode-road",
    name: "高德路网",
    tiles: [
      "https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&scl=1&ltype=2",
    ],
    attribution:
      '&copy; <a href="https://www.amap.com/" target="_blank" rel="noopener noreferrer">高德地图</a>',
  },
  {
    id: "gaode-satellite",
    name: "高德卫星",
    tiles: ["https://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=6"],
    attribution:
      '&copy; <a href="https://www.amap.com/" target="_blank" rel="noopener noreferrer">高德地图</a>',
  },
];

const createRasterStyle = (layer: BaseLayer) => ({
  version: 8,
  sources: {
    base: {
      type: "raster",
      tiles: layer.tiles,
      tileSize: layer.tileSize ?? 256,
      attribution: layer.attribution,
    },
  },
  layers: [
    {
      id: "base-layer",
      type: "raster",
      source: "base",
    },
  ],
});

export const QueryChat = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [isSwitcherOpen, setSwitcherOpen] = useState(false);
  const [activeLayerId, setActiveLayerId] = useState(baseLayers[0].id);

  useEffect(() => {
    let isMounted = true;
    let removeResizeListener: (() => void) | null = null;

    const ensureMapboxResources = () => {
      if (typeof window === "undefined") {
        return Promise.reject(new Error("window is undefined"));
      }

      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${MAPBOX_JS_URL}"]`,
      );

      if (!document.querySelector(`link[href='${MAPBOX_CSS_URL}']`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = MAPBOX_CSS_URL;
        document.head.appendChild(link);
      }

      if (existingScript) {
        if ((window as any).mapboxgl) {
          return Promise.resolve((window as any).mapboxgl);
        }

        return new Promise((resolve, reject) => {
          existingScript.addEventListener("load", () =>
            resolve((window as any).mapboxgl),
          );
          existingScript.addEventListener("error", () =>
            reject(new Error("mapbox-gl 脚本加载失败")),
          );
        });
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = MAPBOX_JS_URL;
        script.async = true;
        script.onload = () => resolve((window as any).mapboxgl);
        script.onerror = () => reject(new Error("mapbox-gl 脚本加载失败"));
        document.head.appendChild(script);
      });
    };

    ensureMapboxResources()
      .then((mapbox) => {
        if (!isMounted || !mapContainerRef.current) {
          return;
        }

        mapbox.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? "no-token";

        const map = new mapbox.Map({
          container: mapContainerRef.current,
          style: createRasterStyle(baseLayers[0]),
          center: [116.397428, 39.90923],
          zoom: 4,
          pitch: 0,
          attributionControl: false,
        });

        mapRef.current = map;

        map.addControl(new mapbox.NavigationControl(), "top-left");
        map.addControl(new mapbox.ScaleControl({ unit: "metric" }), "bottom-left");
        map.addControl(new mapbox.AttributionControl({ compact: true }));

        const handleResize = () => {
          map.resize();
        };

        map.once("load", () => {
          map.resize();
        });

        window.addEventListener("resize", handleResize);
        removeResizeListener = () => {
          window.removeEventListener("resize", handleResize);
        };
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (removeResizeListener) {
        removeResizeListener();
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const layer = baseLayers.find((item) => item.id === activeLayerId);

    if (!layer) {
      return;
    }

    const currentStyle = map.getStyle();
    const currentTiles = currentStyle?.sources?.base?.tiles;
    if (currentTiles && currentTiles[0] === layer.tiles[0]) {
      return;
    }

    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();

    map.setStyle(createRasterStyle(layer));
    map.once("styledata", () => {
      map.jumpTo({
        center,
        zoom,
        bearing,
        pitch,
      });
      map.resize();
    });
  }, [activeLayerId]);

  return (
    <Layout className="relative h-full overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#1f1f1f]">
      <div ref={mapContainerRef} className="h-full w-full" />
      <FloatButton
        icon={<EnvironmentOutlined />}
        type="primary"
        onClick={() => setSwitcherOpen(true)}
        tooltip="切换底图"
        style={{ right: 24, bottom: 24 }}
      />
      <Modal
        title="选择底图"
        open={isSwitcherOpen}
        onCancel={() => setSwitcherOpen(false)}
        footer={null}
        centered
      >
        <Radio.Group
          className="w-full"
          value={activeLayerId}
          onChange={(event: RadioChangeEvent) => {
            const { value } = event.target;
            setActiveLayerId(String(value));
            setSwitcherOpen(false);
          }}
        >
          <Space direction="vertical" className="w-full">
            {baseLayers.map((layer) => (
              <Radio key={layer.id} value={layer.id}>
                {layer.name}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Modal>
    </Layout>
  );
};
