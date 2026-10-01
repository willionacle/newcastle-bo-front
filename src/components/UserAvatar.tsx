// import { agentBalanceAPI } from "@/api/agent/get";
import useUserStore from "@/store/user.store";
import { logoutAPI } from "@/api/custom/login";
import { KeyOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Tooltip } from "antd";
import { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import MyPasswordModal from "./MyPasswordModal";
import { useTranslation } from "react-i18next";
// import CommaNumber from "./CommaNumber";

const AvatarStyle: CSSProperties = {
  width: "2rem",
  height: "2rem",
  marginRight: "0.625rem",
  backgroundColor: "#fde3cf",
  color: "#f56a00",
  minWidth: "2rem",
  // marginLeft: "auto",
};

const userInfoWrapper: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

// const balanceStyle: React.CSSProperties = {
//   padding: '1rem 1rem 0 1rem',
//   textAlign: 'center',
//   fontWeight: 'bold',
//   display: 'flex',
//   gap: '4px',
//   justifyContent: 'center'
// }

const UserAvator = () => {
  // const { swr } = agentBalanceAPI();
  const { t } = useTranslation();
  const displayName = useUserStore((state) => state.userRealName);
  const userName = useUserStore((state) => state.username);
  const name = displayName || userName || "Unknown";
  const operator = useUserStore((state) => state.operator);
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.resetUser);
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogOut = async () => {
    setLoggingOut(true);
    try {
      // Multi-session backend (2026-08): this ends only the calling session
      // server-side. Best-effort — if the token is already expired/revoked
      // this 401s, and we still proceed with the local logout regardless.
      if (token) {
        await logoutAPI(token);
      }
    } catch {
      // ignore — local logout below still clears the session
    } finally {
      logout();
      navigate("/login");
    }
  };

  // const userOptions: MenuProps["items"] = [
  //   {
  //     key: "userName",
  //     label: (
  //       <p className="m-0 cursor-default relative">
  //         {name}
  //         <span className="absolute bottom-0 right-0 text-xs">#{name}</span>
  //       </p>
  //     ),
  //     icon: <span>icon</span>,
  //   },
  //   {
  //     type: "divider",
  //   },
  //   {
  //     key: "logOut",
  //     label: (
  //       <p className="m-0" onClick={handleLogOut}>
  //         {"Log Out"}
  //       </p>
  //     ),
  //     icon: <div>icon</div>,
  //   },
  // ];

  return (
    // <Dropdown menu={{ items: userOptions }}>
    //   <Avatar style={AvatarStyle}>{name.charAt(0).toUpperCase()}</Avatar>
    // </Dropdown>
    <>
    <div className="" style={userInfoWrapper}>
      <LanguageSwitcher />
      <Divider type="vertical" />
      <Avatar style={AvatarStyle}>{name.charAt(0).toUpperCase()}</Avatar>
      <span style={{marginRight: '1.5rem'}}>{name}{operator ? ` (${operator})` : ""}</span>
      <Divider type="vertical" />
      {/* Self-service password change — every admin, not just the super tier. */}
      <Tooltip title={t("adminAccounts.myPassword")}>
        <Button type="text" icon={<KeyOutlined />} onClick={() => setChangingPassword(true)} />
      </Tooltip>
      <Button type="text" icon={<LogoutOutlined />} loading={loggingOut} onClick={handleLogOut} />
    </div>

    <MyPasswordModal open={changingPassword} onClose={() => setChangingPassword(false)} />
    {/* <div className="" style={balanceStyle}>
      <div style={{color: 'var(--ant-color-text-secondary)'}}>총보유알:</div>
      <CommaNumber value={swr.data?.data?.balance} />
    </div> */}
    </>
  );
};

export default UserAvator;
