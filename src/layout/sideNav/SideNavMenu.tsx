import { Button, Tooltip } from "antd";
import {
  MenuIconLabelWrapperStyle,
  MenuIconStyle,
  MenuLabelStyle,
  SideNavMenuItemChildrenStyle,
  SideNavMenuItemChildrenWrapperStyle,
  SideNavMenuItemStyle,
  SideNavMenuStyle,
  SubMenuLinkStyle,
} from "./SideNavMenuStyle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMenu from "@/hooks/useMenu";
import { MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import styles from "./SideNav.module.css";
import { useSideNavStore } from "@/store/sidenav.store";

// Real <a href> / react-router Link elements so ctrl/cmd/shift/middle-click
// opens the target page in a new tab like any normal link, instead of only
// ever navigating the current tab (client request #21) -- a plain left
// click still goes through client-side routing as before.
const isPlainLeftClick = (e: MouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

type MenuNode = {
  key: string;
  label: string;
  icon?: ReactElement;
  basePath?: string;
  badge?: number;
  menuNo?: number;
  description?: React.ReactNode;
  // Optional trailing element (e.g. the admin-IP ⚠ badge) and tooltip text.
  suffix?: React.ReactNode;
  title?: string;
  children?: MenuNode[];
};

const SideNavMenu = ({ sideNavCollapsed }: { sideNavCollapsed: boolean }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const rawItems = useMenu();
  const { open, toggle, initKeys } = useSideNavStore();

  const items: MenuNode[] = useMemo(() => {
    const toNode = (x: any): MenuNode => ({
      key: x.key,
      label: x.label,
      icon: x.icon,
      basePath: x.basePath,
      badge: x.badge,
      menuNo: x.menuNo,
      description: x.description,
      suffix: x.suffix,
      title: x.title,
      ...(Array.isArray(x.children) && x.children.length > 0
        ? { children: x.children.map(toNode) }
        : {}),
    });
    return Array.isArray(rawItems) ? rawItems.map(toNode) : [];
  }, [rawItems]);

  const collectParentKeys = (nodes: MenuNode[], depth = 0, acc: { key: string; depth: number }[] = []) => {
    for (const n of nodes) {
      const hasChildren = Array.isArray(n.children) && n.children.length > 0;
      if (hasChildren) {
        acc.push({ key: n.key, depth });
        collectParentKeys(n.children!, depth + 1, acc);
      }
    }
    return acc;
  };

  useEffect(() => {
  if (items.length) {
    const keys = collectParentKeys(items, 0, []);
    if (Object.keys(open).length === 0) {
      initKeys(keys);
    }
  }
}, [items]);

  const [hover, setHover] = useState<string | null>(null);

  const pathActive = (path?: string) => {
    if (!path) return false;
    return pathname === path;
  };

  const TreeItem = ({ node, depth = 0 }: { node: MenuNode; depth?: number }) => {
    const children = Array.isArray(node.children) ? node.children : undefined;
    const isParent = !!(children && children.length > 0);

    if (!isParent) {
      const active = pathActive(node.basePath ?? node.key);
      const menuLabel = node.menuNo !== undefined
        ? `Menu #${String(node.menuNo).padStart(2, "0")}`
        : undefined;
      return (
        <Tooltip title={node.title ?? menuLabel} placement="right">
          <li
            style={SideNavMenuItemStyle()}
            onMouseOver={() => sideNavCollapsed && setHover(node.label)}
            onMouseOut={() => setHover(null)}
          >
            <Link
              to={node.key}
              className={sideNavCollapsed ? styles.MenuIconWrapper : undefined}
              style={
                sideNavCollapsed
                  ? MenuIconLabelWrapperStyle()
                  : {
                      cursor: "pointer",
                      paddingLeft: depth * 12,
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "inherit",
                    }
              }
              aria-current={active ? "page" : undefined}
            >
              {depth === 0 && node.icon && (
                <span style={MenuIconStyle(sideNavCollapsed)}>{node.icon}</span>
              )}
              <span style={MenuLabelStyle(sideNavCollapsed)}>{node.label}</span>
              {node.suffix}
            </Link>
          </li>
        </Tooltip>
      );
    }

    const isOpen = open[node.key] ?? (depth === 0);

    return (
      <li
        style={SideNavMenuItemStyle()}
        onMouseOver={() => sideNavCollapsed && setHover(node.label)}
        onMouseOut={() => setHover(null)}
      >
        <div
          className={sideNavCollapsed ? styles.MenuIconWrapper : undefined}
          style={
            sideNavCollapsed
              ? MenuIconLabelWrapperStyle()
              : { cursor: "pointer", paddingLeft: depth * 12, display: "flex" }
          }
          onClick={() => toggle(node.key)}
          aria-expanded={isOpen}
          aria-haspopup
        >
          <span style={MenuIconStyle(sideNavCollapsed, depth)}>{node.icon}</span>
          <span style={MenuLabelStyle(sideNavCollapsed, depth)}>{node.label}</span>
        </div>

        {isOpen && (
          <ul
            style={SideNavMenuItemChildrenWrapperStyle(
              sideNavCollapsed,
              hover,
              node.label
            )}
          >
            {children!.map((child) => {
              const childIsParent =
                Array.isArray(child.children) && child.children.length > 0;

              if (!childIsParent) {
                const active = pathActive(child.basePath ?? child.key);
                const childMenuLabel = child.menuNo !== undefined
                  ? `Menu #${String(child.menuNo).padStart(2, "0")}`
                  : undefined;
                return (
                  <Tooltip key={child.key} title={child.title ?? childMenuLabel} placement="right">
                    <li style={SideNavMenuItemChildrenStyle}>
                      <Button
                        type="text"
                        href={child.key}
                        className="dark-links-hover"
                        onClick={(e) => {
                          if (!isPlainLeftClick(e)) return; // let the browser open a new tab
                          e.preventDefault();
                          navigate(child.key);
                        }}
                        style={SubMenuLinkStyle(active)}
                      >
                        <span>
                          {child.icon && (
                            <span style={MenuIconStyle(sideNavCollapsed, 2, active)}>
                              {child.icon}
                            </span>
                          )}
                          {child.label}
                          {child.suffix}
                        </span>
                      </Button>
                    </li>
                  </Tooltip>
                );
              }

              return <TreeItem key={child.key} node={child} depth={depth + 1} />;
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul style={SideNavMenuStyle(sideNavCollapsed)}>
      {items.map((node) => (
        <TreeItem key={node.key} node={node} />
      ))}
    </ul>
  );
};

export default SideNavMenu;
