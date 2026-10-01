import { CSSProperties, PropsWithChildren } from "react";
import { Link, To } from "react-router-dom";

interface Props {
  to: To;
  className?: string;
  style?: CSSProperties;
  // Side effects that should always run before navigating (stop a sound,
  // clear a badge count, etc.) -- these fire regardless of how the click
  // navigates, including ctrl/cmd/middle-click into a new tab.
  onBeforeNavigate?: () => void;
}

/**
 * Drop-in replacement for the `<div onClick={() => navigate(to)}>` /
 * `<Typography.Text onClick={...}>` quick-nav tiles sprinkled across the
 * header and sidebar. Renders a real `<a>` (via react-router's Link) so
 * ctrl/cmd/shift/middle-click opens the target in a new tab like any normal
 * link -- a plain left click still goes through client-side routing, same
 * as before (client request #21: staff want to Ctrl+click deposit/
 * withdrawal/etc. tiles open in a new tab instead of only ever navigating
 * the current one). Link itself already skips its internal navigate() for
 * modified/middle clicks, so we only need to run our own side effects here.
 */
const NavClickable = ({
  to,
  className,
  style,
  onBeforeNavigate,
  children,
}: PropsWithChildren<Props>) => (
  <Link
    to={to}
    className={className}
    style={{
      textDecoration: "none",
      color: "inherit",
      // Drop explicit `undefined` entries (e.g. `color: active ? "red" :
      // undefined`) instead of letting them clobber the anchor-reset
      // defaults above -- an inline style value of `undefined` still wins
      // the key when spread, it just renders as unset.
      ...Object.fromEntries(Object.entries(style ?? {}).filter(([, v]) => v !== undefined)),
    }}
    onClick={(e) => {
      e.stopPropagation();
      onBeforeNavigate?.();
    }}
  >
    {children}
  </Link>
);

export default NavClickable;
