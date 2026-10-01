import { Layout as AntLayout, Button, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { ReactNode, useEffect, useState, useRef } from "react";
import SideNav from "./sideNav/SideNav";
import Header from "./header/Header";
import SimpleBar from "simplebar-react";
import {
  contentLayoutStyle,
  contentScrollStype,
  rightLayoutStyle,
} from "./LayoutStyle";
import { siderMaskStyle } from "./sideNav/SideNavStyle";
import { heartbeatAPI } from "@/api/custom/heartbeat";
import { useSuspiciousAdminLoginAPI } from "@/api/admin-login-log/get";
import useSocket from "@/hooks/useSocket";
import { createSharedSocket } from "@/utils/sharedSocket";
import { notification } from "antd";
import useUserStore from "@/store/user.store";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { t } = useTranslation();
  const socketRef = useRef<ReturnType<typeof createSharedSocket> | null>(null);
  const [headerOpen, setHeaderOpen] = useState(false);
  const breakpoint = Grid.useBreakpoint().lg ?? false;
  // Owned here (not inside SideNav) so the floating reopen button below can
  // read/toggle it too — on <lg screens the Sider's collapsedWidth is 0, so
  // its own trigger button disappears along with it. Starts collapsed on
  // mobile/tablet (<lg) instead of hard-coded false — an expanded 250px
  // Sider was eating most of a phone screen on first paint, on top of the
  // Header, before the user ever touched anything.
  const [sideCollapsed, setSideCollapsed] = useState(!breakpoint);
  useEffect(() => {
    setSideCollapsed(!breakpoint);
  }, [breakpoint]);
  heartbeatAPI();
  useSocket();
  // Fills the ⚠ badge on the 관리자 로그인 로그 side-menu item (polls every 3 min)
  useSuspiciousAdminLoginAPI();
  const token = useUserStore.getState().token;

  useEffect(() => {
    document.title = import.meta.env.VITE_BROWSER_TITLE;

    // Shared across tabs (see sharedSocket.ts) — a second live connection
    // carrying the same session token was getting tabs kicked as a
    // "duplicate login" (client request #21).
    const sportsSocket = createSharedSocket(import.meta.env.VITE_SPORTS_SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });
    socketRef.current = sportsSocket;
    sportsSocket.connect();

    sportsSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    sportsSocket.on("sportsBettingAlert", (data: any) => {
      notification.info({
        message: t("toast.common.notification"),
        description: data,
        duration: 0,
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <AntLayout className="rp-shell-viewport">
      <Header open={headerOpen} setOpen={setHeaderOpen} />
      {!breakpoint && sideCollapsed && (
        // Only reachable path back to the menu on mobile/tablet (<992px)
        // once the Sider has collapsed to 0 width.
        <Button
          type="primary"
          shape="circle"
          icon={<MenuOutlined />}
          onClick={() => setSideCollapsed(false)}
          style={{ position: "fixed", top: 12, left: 12, zIndex: 1100 }}
        />
      )}
      {!breakpoint && (
        // Backdrop for the mobile overlay Sider (SideNavStyle `siderStyle`);
        // tap anywhere outside the menu to close it. Mounted for the whole
        // mobile lifetime and faded via opacity so it stays in step with the
        // Sider's slide-out instead of vanishing a frame in.
        <div
          style={siderMaskStyle(!sideCollapsed)}
          onClick={() => setSideCollapsed(true)}
        />
      )}
    <AntLayout style={{ flex: 1, minHeight: 0 }}>
      <SideNav collapsed={sideCollapsed} setCollapsed={setSideCollapsed} breakpoint={breakpoint} />
      <AntLayout style={rightLayoutStyle}>
        <AntLayout.Content style={contentLayoutStyle}>
          <SimpleBar style={contentScrollStype}>{children}</SimpleBar>
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
    </AntLayout>
  );
};

export default Layout;
