import { CSSProperties } from "react";

export const SideNavMenuStyle = (collapsed?: boolean): CSSProperties => ({
  // border: "none",
  listStyle: 'none',
  paddingLeft: collapsed ? '1.3rem' : '1.2rem',
});
export const SideNavMenuItemStyle = (): CSSProperties => ({
  // border: "none",
  listStyle: 'none',
  marginTop: '0.7rem',
  position: 'relative'
});

export const SideNavMenuItemChildrenWrapperStyle = (collapsed: boolean, hoverLabel: string | null, label: string): CSSProperties => (
  collapsed ? {
  // border: "none",
  listStyle: 'none',
  paddingLeft: '0rem',
  display: collapsed && !(hoverLabel === label) ? 'none' : 'block',
  position: "absolute",
  bottom: '-250%',
  left: 40,
  background: '#fff',
  borderRadius: '6px',
  boxShadow: '0 0 6px #0000001f',
  paddingBottom: '1rem'
} : {
  listStyle: 'none',
  paddingLeft: '1rem',
}
);
export const SideNavMenuItemChildrenStyle: CSSProperties = {
  // border: "none",
  listStyle: 'none',
  // marginTop: '1rem',
  paddingRight: '1rem'
};

export const SubMenuLinkStyle = (pathActive: boolean): CSSProperties => ({
  // border: "none",
  backgroundColor: pathActive ? 'var(--ant-color-primary)' : '',
  color: pathActive ? '#fff' : '',
  fontSize: 14,
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  justifyContent: 'space-between'
});

export const MenuLabelStyle = (collapsed: boolean, depth?: number,): CSSProperties => ({
  // border: "none",
    "fontWeight": depth && depth > 0 ? undefined : 800,
    "color": depth && depth > 0 ? undefined : '#7b8793',
    "fontSize": '14px',
    display: collapsed ? 'none' : "block",
    // marginBottom:"10px"
});

const MenuIconDefaultStyle = (depth?: number, pathActive?: boolean) => ({
  fontSize: "18px",
  lineHeight: 1,
  verticalAlign: "middle",
  marginRight: "6px",
  color: pathActive ? "#fff" : 'var(--ant-color-primary)',
  opacity: (depth && depth > 0 && !pathActive) ? 0.6 : 1,
})

export const MenuIconStyle = (collapsed?: boolean, depth?: number, pathActive?: boolean): CSSProperties => (
  collapsed ? {
    ...MenuIconDefaultStyle(depth, pathActive),
    fontSize: '24px'
  } : {
    ...MenuIconDefaultStyle(depth, pathActive)
  }
);

export const MenuIconLabelWrapperStyle = (_?: boolean, hover?: string): CSSProperties => ({
  padding: '6px',
  borderRadius: '6px',
  background: hover ? '#000' : '',
});

