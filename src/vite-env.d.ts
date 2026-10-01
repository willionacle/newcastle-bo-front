/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_DEFALUT_PAGESIZE: string;
  readonly VITE_DEFALUT_TABLE_SCROLL: string;
  readonly VITE_AGENT_TOP: string;
  readonly VITE_AGENT_URL: string;
  /** "false" disables the Google Authenticator step on the login page. */
  readonly VITE_BO_OTP_LOGIN: string;
  readonly VITE_UPLOAD_URL: string;
  /** media-api `X-Upload-Key`; sent when set, required once ops enables UPLOAD_KEY. */
  readonly VITE_UPLOAD_KEY?: string;
  /** Player site origin, e.g. https://godirectplay.com — "Login as member" opens `<origin>/impersonate#token=…` there. */
  readonly VITE_PLAYER_URL?: string;
}
