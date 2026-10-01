import { cloneElement, isValidElement, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Boundary that re-renders its routed element **in place** when the app language
 * changes — without remounting it.
 *
 * Why: the i18n migration emitted the i18next *singleton* `i18next.t()` in many
 * components (table column builders, charts, `api/*` message helpers) that never
 * subscribe to `languageChanged`. Those render the right language on reload but
 * go stale on a live toggle. Rather than remounting the router (which refetches
 * data and flickers), this subscribes once and returns a *new element reference*
 * only when the language changes — which defeats React's "same element" bail-out
 * and forces the subtree to re-render while keeping component state, in-flight
 * data and scroll position. (antd labels still relabel via ConfigProvider.)
 */
const LangReactive = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  return useMemo(
    () => (isValidElement(children) ? cloneElement(children) : <>{children}</>),
    [children, i18n.language]
  );
};

export default LangReactive;
