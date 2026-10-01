import { useState } from "react";
import { ConfigProvider, Menu, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { US, KR, PH } from "country-flag-icons/react/3x2";

type Lng = "ko" | "en" | "fil";

const SUPPORTED: Lng[] = ["ko", "en", "fil"];

// Each UI language → the flag that best represents it.
const FLAG: Record<Lng, typeof US> = {
  ko: KR,
  en: US,
  fil: PH,
};

/**
 * Language selector for the back-office header.
 *
 * A compact circular button showing the current language's flag; clicking it
 * opens a popover with the full list. Calls i18n.changeLanguage(), which the
 * browser-language-detector persists to localStorage ("i18nextLng"). The whole
 * app (including antd components, via ConfigProvider) relabels reactively — no
 * remount or manual storage write.
 */
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  // i18n.language may be a region variant (e.g. "en-US"); normalize to the base.
  const current = (i18n.language?.split("-")[0] as Lng) ?? "en";
  const active = SUPPORTED.includes(current) ? current : "en";
  const ActiveFlag = FLAG[active];

  const select = (lng: Lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const menu = (
    // The global Menu theme renders the selected item as slate-gray text on a
    // solid-indigo bg (low contrast). Override locally to white-on-primary, the
    // same active style the sidebar nav uses.
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: "var(--ant-color-primary)",
            itemSelectedColor: "#ffffff",
          },
        },
      }}
    >
      <Menu
        selectable
        selectedKeys={[active]}
        onClick={({ key }) => select(key as Lng)}
        style={{ border: "none", minWidth: 140 }}
        items={SUPPORTED.map((lng) => {
          const Flag = FLAG[lng];
          return {
            key: lng,
            icon: (
              <Flag style={{ width: 20, borderRadius: 2, verticalAlign: "middle" }} />
            ),
            label: t(`language.${lng}`),
          };
        })}
      />
    </ConfigProvider>
  );

  return (
    <Popover
      content={menu}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow={false}
      overlayInnerStyle={{ padding: 4 }}
    >
      <button
        type="button"
        title={t("language.label")}
        aria-label={t("language.label")}
        style={{
          position: "relative",
          width: 28,
          height: 28,
          padding: 0,
          borderRadius: "50%",
          overflow: "hidden",
          border: "1px solid var(--ant-color-border)",
          cursor: "pointer",
          display: "inline-flex",
          background: "transparent",
          lineHeight: 0,
        }}
      >
        {/* 3:2 flag fills the height and is cropped to the circle */}
        <ActiveFlag
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            height: "100%",
            width: "auto",
            transform: "translateX(-50%)",
          }}
        />
      </button>
    </Popover>
  );
};

export default LanguageSwitcher;
