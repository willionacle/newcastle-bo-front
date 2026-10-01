import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import CreateRouter from "./router/router";
import "antd/dist/reset.css";
import "simplebar-react/dist/simplebar.min.css";
import "@/i18n/i18n";
import "./index.css";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// dayjs.locale("ko");
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault("Asia/Seoul");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={CreateRouter()} />
  </React.StrictMode>
);
