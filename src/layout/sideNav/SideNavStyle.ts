import { CSSProperties } from "react";

// `overlay` = mobile/tablet (<lg) with the Sider open: it leaves the flex
// row (position:fixed) and floats over the content with a backdrop behind
// it, instead of taking 250px out of an already-narrow screen and squashing
// the page next to it. See the mask in Layout.tsx.
export const siderStyle = (overlay = false): CSSProperties => ({
  // minHeight: "100vh",
  boxShadow: "var(--ant-box-shadow)",
  zIndex: overlay ? 1200 : 1000,
  // relative to the flex row's own height (bound by .rp-shell-viewport),
  // not the raw viewport — stays correct regardless of Header height or
  // mobile toolbar quirks (was `calc(100vh - 16px)`).
  height: overlay ? '100%' : 'calc(100% - 16px)',
  margin: overlay ? 0 : '8px 0 8px 8px',
  borderRadius: overlay ? 0 : 'var(--ant-border-radius)',
  marginTop: overlay ? 0 : "16px",
  display: 'flex',
  flexDirection: 'column',
  // clips to `height` so the menu's own SimpleBar scrolls internally
  // instead of the whole Sider growing/scrolling past the screen.
  overflow: 'hidden',
  ...(overlay
    ? { position: 'fixed' as const, top: 0, left: 0, bottom: 0 }
    : {}),
});

// Backdrop behind the mobile overlay Sider; tapping it closes the menu.
// Stays mounted and fades instead of unmounting, so it doesn't pop out
// ahead of the Sider's own 0.2s slide-out.
export const siderMaskStyle = (visible: boolean): CSSProperties => ({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.45)',
  zIndex: 1150,
  opacity: visible ? 1 : 0,
  pointerEvents: visible ? 'auto' : 'none',
  transition: 'opacity 0.2s ease',
});

export const siderLogoWrapperStyle = (
  siderWidth: number,
  collapsed: boolean
): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  // position: "fixed",
  // top: 0,
  flexDirection: collapsed ? "column-reverse" : 'unset',
  width: `${siderWidth}px`,
  // height: "4rem",
  overflow: "hidden",
  // padding: '3rem',
  padding: collapsed ? '0' : '0 1rem 0 1rem',
  margin: '1rem 0',
  gap: '12px',
  flexShrink: 0,
});

export const logoStyle = (_collapsed: boolean): CSSProperties => ({
  height: "4rem",
  width: "auto",
  // marginLeft: collapsed ? "-1rem" : "",
  // marginRight: '1.5rem',
  // marginTop: '-1rem',
  cursor: "pointer",
});

// Fills whatever vertical space is left in the (flex-column) Sider after
// the logo/avatar/stat blocks above it, instead of guessing their combined
// height via magic-number vh subtraction (525px/312px/4rem — went negative
// on short mobile viewports and left the menu with ~0 height).
export const menuWrapperStyle: CSSProperties = {
  marginTop: "2rem",
  flex: 1,
  minHeight: 0,
};

// Fixed-size blocks above the menu keep their natural height instead of
// being squeezed by the sider's flex layout.
export const siderFixedBlockStyle: CSSProperties = {
  flexShrink: 0,
};
