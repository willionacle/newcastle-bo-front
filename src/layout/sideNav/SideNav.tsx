import { Button, Layout } from "antd";
import RPLogo from "@/components/RPLogo";

import {
  menuWrapperStyle,
  siderFixedBlockStyle,
  siderLogoWrapperStyle,
  siderStyle,
} from "./SideNavStyle";
import UserAvator from "@/components/UserAvatar";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import SideNavMenu from "./SideNavMenu";
import { MenuOutlined } from "@ant-design/icons";
import { totalStaticsAPI } from "@/api/cs-statics/totalStatics";
import { useSiteProfileAPI } from "@/api/site-profile/get";
import { useAuthValidateAPI } from "@/api/custom/login";
import HeaderItem1 from "../header/HeaderItem1";

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  // >=lg (992px): icon rail stays reachable when collapsed (collapsedWidth 80).
  // <lg (mobile/tablet): collapsedWidth is 0 — Sider (and the toggle button
  // inside it) vanishes entirely, so re-opening needs an external trigger;
  // see the floating button in Layout.tsx.
  breakpoint: boolean;
}

const SideNav = ({ collapsed, setCollapsed, breakpoint }: Props) => {
  const { data, isLoading } = totalStaticsAPI();
  const _data = data ? data.data : null;
  // Mirrors hideSportsMenus into site-profile.store.ts so useMenu can read
  // it synchronously on each build — same shape as totalStaticsAPI above.
  useSiteProfileAPI();
  // Same shape again: reads `isSuperAdmin` off /api/auth/validate and mirrors it
  // into admin-access.store.ts, so useMenu can decide synchronously whether to
  // show 관리자 계정 관리. Asked again on every route change, because the
  // tier can move to another account without this session logging out.
  // Cosmetic only — the routes are gated server-side and fail closed.
  useAuthValidateAPI();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const siderWidth = collapsed ? 80 : 250;
  // <lg: float over the page instead of shrinking it. Kept on for the whole
  // mobile lifetime, not just while open — tying it to `!collapsed` dropped
  // the Sider back into the flex row the moment close was tapped, so the
  // remaining width 250->0 animation played out as the page being pushed
  // back open. Collapsed width is 0 here, so a fixed Sider costs nothing.
  const overlay = !breakpoint;

  const handleClickLogo = () => {
    navigate("/");
  };

  // Picking a menu entry in the overlay should get the menu out of the way,
  // otherwise it stays parked over the page the user just navigated to.
  useEffect(() => {
    if (overlay && !collapsed) setCollapsed(true);
  }, [pathname]);

  return (
    <Layout.Sider
      width={siderWidth}
      style={siderStyle(overlay)}
      breakpoint="lg"
      collapsedWidth={breakpoint ? 80 : 0}
      collapsible
      collapsed={collapsed}
      onCollapse={(e) => {
        setCollapsed(e);
      }}
      trigger={null}
    >
      {/* <div style={triggetStyle(collapsed)}>
        
      </div> */}
      <div style={siderLogoWrapperStyle(siderWidth, collapsed)}>
        {!(collapsed && !breakpoint) && (
          <RPLogo
            size={collapsed ? "md" : "lg"}
            collapsed={collapsed}
            onClick={handleClickLogo}
          />
        )}
        <Button type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} />
      </div>
        {!collapsed && (
          <>
            <div style={siderFixedBlockStyle}>
              <UserAvator />
              <div style={{padding:"10px 30px 0px",marginBottom:"-10px"}}>
                <HeaderItem1 data={_data} loading={isLoading} />
              </div>
            </div>
            <SimpleBar style={menuWrapperStyle} autoHide={true}>
              <SideNavMenu sideNavCollapsed={collapsed} />
            </SimpleBar>
          </>
        )}
        { collapsed && (
          <SideNavMenu sideNavCollapsed={collapsed} />
        )}
    </Layout.Sider>
  );
};

export default SideNav;
