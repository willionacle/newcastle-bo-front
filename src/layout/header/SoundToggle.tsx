import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import soundStore from "@/store/sound.store";

const VolumeOnIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
    <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
  </svg>
);

const SoundToggle = () => {
  const { t } = useTranslation();
  const soundMuted = soundStore((s) => s.soundMuted);
  const toggleMuted = soundStore((s) => s.toggleMuted);
  const label = soundMuted ? t("header.soundOn") : t("header.soundOff");

  return (
    <Tooltip title={label}>
      <Button
        type="text"
        size="small"
        aria-label={label}
        onClick={() => toggleMuted()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: soundMuted ? "#999" : "var(--primary)",
        }}
        icon={soundMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
      />
    </Tooltip>
  );
};

export default SoundToggle;
