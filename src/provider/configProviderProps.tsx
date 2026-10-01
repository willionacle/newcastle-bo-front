import { ConfigProvider as Provider, ThemeConfig } from "antd";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import ko from "antd/locale/ko_KR";
import en from "antd/locale/en_US";

const token: ThemeConfig["token"] = {
  // font
  fontFamily: "'Noto Sans KR', sans-serif",
  fontSize: 12,

  // color
  colorPrimary: "#4f46e5",
  colorBgLayout: "#f1f5f9",
  colorPrimaryHover: "#6366f1",
  colorPrimaryText: "#4338ca",

  // border
  borderRadius: 12,

  // Background Color
  colorPrimaryBg: "#4f46e5",
  colorFillSecondary: "#eef2ff",
  colorBgContainer: "#ffffff",

  // Text Color
  colorTextHeading: "#3730a3",
  colorTextBase: "#0f172a",
  colorTextSecondary: "#475569",
  colorWhite: "#ffffff",

  // Border Color
  colorBorder: "rgba(15,23,42,0.10)",
  colorBorderSecondary: "#e0e7ff",

  // Box Shadow
  boxShadow: "1px 0 20px rgba(99,102,241,0.22)",
  boxShadowSecondary: "0 4px 20px rgba(79,70,229,0.15)",
  // boxShadowTertiary: "0px 1px 1px 0px #E2E8F0",

  // etc
};

const components: ThemeConfig["components"] = {
  Layout: {
    siderBg: token.colorBgContainer,

    triggerBg: token.colorBgContainer,
    triggerColor: token.colorPrimary,

    headerBg: "transparent",
    headerPadding: "1rem",
    headerHeight: 300,
  },

  Menu: {
    itemColor: token.colorTextSecondary,
    itemSelectedBg: token.colorPrimaryBg,
    itemSelectedColor: token.colorTextSecondary,
    itemHoverBg: token.colorBgLayout,

    itemHeight: 40,
    fontSize: 14,
    iconSize: 30,
    collapsedIconSize: 30,
  },

  Form: {
    labelColor: token.colorTextBase,
  },

  Button: {
    defaultBg: token.colorPrimary,
    defaultColor: token.colorWhite,
    defaultHoverBg: token.colorPrimaryHover,
    defaultHoverColor: token.colorWhite,
  },

  Tag: {
    borderRadiusSM: 9999,
    colorFillSecondary: token.colorBgLayout,
    defaultColor: token.colorTextSecondary,
  },

  Table: {
    headerBg: token.colorFillSecondary,
    headerColor: token.colorTextBase,
    cellPaddingBlock: 4,
    cellPaddingInline: 4,
  },
};

const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();

  const getLocale = (lng: string) => {
    switch (lng) {
      case "ko":
        return ko;

      // antd ships no Filipino locale, so fall back to en_US for "fil".
      case "fil":
        return en;

      default:
        return en;
    }
  };

  return (
    <Provider
      locale={getLocale(i18n.language)}
      theme={{ cssVar: true, token: token, components: components }}
      card={{
        style: {
          boxShadow: token?.boxShadowSecondary,
        },
        styles: {},
      }}
      tag={{
        style: {
          borderColor: token.colorBorderSecondary,
        },
      }}
    >
      {children}
    </Provider>
  );
};

export default ConfigProvider;
