import { CSSProperties } from "react";

export const headerStyle = (open: boolean, isMobile = false): CSSProperties => ({
  // position: "absolute",
  // top: open ? "0px" : "calc(-1 * var(--ant-layout-header-height) + 4rem)",
  width: "100%",
  transition: "height 0.25s ease",
  zIndex: 10,
  padding: "0.5rem",
  cursor: "pointer",
  // Mobile: the stat row wraps into a tall stack instead of scrolling
  // sideways, so a fixed 260px clips it — cap by viewport height and let
  // the Card body's own overflow:auto scroll the rest instead.
  height: open ? (isMobile ? undefined : '260px') : '50px',
  maxHeight: open && isMobile ? '70vh' : undefined,
  // Card body underneath is the actual overflow:auto scroller; clip here
  // too so mobile content can't spill past the maxHeight box.
  overflow: open && isMobile ? 'hidden' : undefined,
});

export const headerCardStyle = (_open?: boolean): CSSProperties => ({
  width: "100%",
  // minHeight: "284px",
  // height: '100%',
  // minHeight: '70px',
  height: 'inherit',
  overflowY: "hidden",
});

export const headerListWrapper: CSSProperties = {
  // height:
  //   "calc( var(--ant-layout-header-height) - (var(--ant-padding-lg) * 4))",
  // display: "flex",
  height: '170px'
};

export const headerListStyle = (width: number): CSSProperties => ({
  minWidth: `${width}px`,
  // marginRight: "1rem",
  margin: '0rem !important'
});

export const headerListItemStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `solid 1px var(--ant-color-border)`,
  fontSize: "14px",
  padding: "4px",
  textAlign: "center",
  margin: 0,
  // keep each row on a single line so longer (en/fil) labels never break
  // mid-word and inflate the row height past the fixed card height
  whiteSpace: "nowrap",
};

// fixed-width, non-wrapping first column for row labels (Deposit / Withdrawal /
// Today's Bet …). A fixed width keeps the value columns aligned across rows and
// stops long translated labels from wrapping; ellipsis is a safety net.
export const headerListTitleStyle = (width = 72): CSSProperties => ({
  flex: `0 0 ${width}px`,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "left",
  paddingRight: 6,
});

export const headerListHeaderStyle: CSSProperties = {
  listStyle: "none",
  display: "flex",
  backgroundColor: "color-mix(in srgb, var(--ant-color-primary), transparent 80%)",
  borderRadius: "1rem 1rem 0 0",
  borderBottom: `solid 1px var(--ant-color-border)`,
  padding: "4px",
  margin: "0",
  color: "color-mix(in srgb, var(--ant-color-primary), black 5%)",
  fontWeight: 'bold',
  // marginRight: "1rem",
  textAlign: "center",
};

export const headerListHeaderItemStyle = (flex: number): CSSProperties => ({
  flex,
});

export const headerMoreBtn: CSSProperties = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  bottom: "0.5rem",
  lineHeight: "2rem",
  gap: "1rem",
  width: "calc(100% - 3rem)",
  // single non-wrapping row: scroll horizontally instead of wrapping/overlapping
  // when long (e.g. en/fil) labels exceed the available width
  overflowX: "auto",
  overflowY: "hidden",
};

// left group of stat tiles + member search; keeps its natural width
// (won't squish) and never wraps its label text
export const headerStatGroup: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexShrink: 0,
  whiteSpace: "nowrap",
};

// right-side controls (USDT rate + open button); pinned to the right edge
// via auto margin when there is spare room, scrolls into view otherwise
export const headerMoreControls: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexShrink: 0,
  marginLeft: "auto",
};

export const percentageWrapper: CSSProperties = {
  display: "flex",
  alignItems: 'center',
  gap: '4px',
  textWrap: 'nowrap',
  whiteSpace: 'nowrap',
  justifyContent: 'center'
};
