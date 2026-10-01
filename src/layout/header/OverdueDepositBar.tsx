import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { stringify } from "qs";
import dayjs from "dayjs";
import { Howl } from "howler";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import DepositAudio from "@/assets/audio/deposit.wav";
import soundStore from "@/store/sound.store";
import useOverdueDeposits, {
  OverdueDeposit,
  overdueKey,
} from "@/hooks/useOverdueDeposits";
import styles from "./OverdueDepositBar.module.css";

/**
 * The backend sends KST wall-clock times with a `Z` suffix (21:33 KST ->
 * "...T21:33:23.576Z"). Parsing that as UTC shifts the day, so strip the Z and
 * read it as wall clock (same idea as GF.cleanDateString).
 */
const wallClock = (iso: string) =>
  dayjs(String(iso ?? "").replace("T", " ").replace("Z", "").split(".")[0]);

const elapsedLabel = (t: TFunction, seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s
    ? t("overdueDeposit.elapsedMinSec", { m, s })
    : t("overdueDeposit.elapsedMin", { m });
};

const describe = (t: TFunction, d: OverdueDeposit) => {
  // Real name can be missing (LEFT JOIN): drop the brackets instead of "abc[]"
  const who = d.user_real_name ? `${d.username}[${d.user_real_name}]` : d.username;

  return t("overdueDeposit.label", {
    who,
    amount: Number(d.amount ?? 0).toLocaleString(),
    elapsed: elapsedLabel(t, d.ageSecondsDisplay),
  });
};

/**
 * Keys that already played the sound. Module-level because the Header mounts
 * this bar in both its open and closed layouts; toggling must not replay it.
 */
const sounded = new Set<string>();

/* Keep in step with the keyframe lengths in OverdueDepositBar.module.css */
const ENTER_MS = 220;
const EXIT_MS = 200;

/**
 * Overdue deposit-request warning shown inline in the Header (not a floating
 * toast). One item shows as-is; with more, the oldest shows with a stacked look
 * and hovering expands the full list. The list is a Popover (portalled to body)
 * because the Header card has a fixed height and would clip it.
 * Clicking an item opens 입금 관리 filtered to that member and that day.
 */
const OverdueDepositBar = () => {
  const { t } = useTranslation();
  const overdue = useOverdueDeposits();
  const navigate = useNavigate();
  /** Last list, kept for the exit animation (overdue is already empty then) */
  const lastRef = useRef<OverdueDeposit[]>([]);
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [entering, setEntering] = useState(false);

  if (overdue.length) lastRef.current = overdue;

  useEffect(() => {
    if (overdue.length) {
      setLeaving(false);
      if (mounted) return;

      setMounted(true);
      setEntering(true);
      const enterTimer = setTimeout(() => setEntering(false), ENTER_MS);
      return () => clearTimeout(enterTimer);
    }

    if (!mounted) return;

    // Last item processed: play the exit animation before removing
    setLeaving(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setLeaving(false);
    }, EXIT_MS);

    return () => clearTimeout(timer);
  }, [overdue.length, mounted]);

  useEffect(() => {
    let played = false;

    overdue.forEach((d) => {
      if (sounded.has(d.key)) return;
      sounded.add(d.key);

      // One sound even if several items cross the threshold together.
      // Respects the header SoundToggle (Howler is also muted globally by it).
      if (!played && !soundStore.getState().soundMuted) {
        new Howl({ src: [DepositAudio] }).play();
        played = true;
      }
    });
  }, [overdue]);

  // Forget processed items so a re-application sounds again. Only on a real
  // (non-empty) snapshot change, so a header open/close remount doesn't wipe it.
  useEffect(() => {
    if (!overdue.length) return;
    const alive = new Set(overdue.map((d) => d.key));
    sounded.forEach((key) => {
      if (!alive.has(key)) sounded.delete(key);
    });
  }, [overdue]);

  const list = overdue.length ? overdue : lastRef.current;
  if (!mounted || !list.length) return null;

  const goToDeposit = (d: OverdueDeposit) =>
    navigate(
      `/payment?${stringify({
        dateRange: [
          wallClock(d.created_at).startOf("day").format(),
          wallClock(d.created_at).endOf("day").format(),
        ],
        username: d.username,
      })}`
    );

  const [oldest] = list;
  const hidden = list.length - 1;

  /** truncate: only the inline header line is ellipsised; the expanded list shows everything */
  const pill = (d: OverdueDeposit, truncate = false) => {
    const text = describe(t, d);
    return (
      <button
        type="button"
        key={overdueKey(d)}
        className={styles.pill}
        title={truncate ? text : undefined}
        onClick={(e) => {
          e.stopPropagation();
          goToDeposit(d);
        }}
      >
        <ExclamationCircleFilled />
        <span className={truncate ? styles.text : undefined}>{text}</span>
      </button>
    );
  };

  // At most 3 layers behind (more is not visually distinguishable)
  const layers = Math.min(hidden, 3);

  const body = !hidden ? (
    pill(oldest, true)
  ) : (
    <Popover
      trigger="hover"
      placement="bottom"
      arrow={false}
      content={
        <div className={styles.list} onClick={(e) => e.stopPropagation()}>
          {list.map((d) => pill(d))}
        </div>
      }
    >
      <div className={styles.stack}>
        {Array.from({ length: layers }, (_, i) => (
          <span key={i} className={styles.layer} />
        ))}
        {pill(oldest, true)}
      </div>
    </Popover>
  );

  return (
    <div
      role="alert"
      className={[styles.anim, entering && styles.entering, leaving && styles.leaving]
        .filter(Boolean)
        .join(" ")}
    >
      {body}
    </div>
  );
};

export default OverdueDepositBar;
