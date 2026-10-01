import useMenu from "@/hooks/useMenu";
import { Breadcrumb as AntBreadcrumb, BreadcrumbProps, Typography } from "antd";
import { useLocation } from "react-router-dom";
import {
  breadcrumbTitleStyle,
  breadcrumbTitleWrapperStyle,
} from "./BreadcrumbStyle";
import MenuDescription from "./MenuDescription";

interface Props {
  replace?: string | null;
  replaceDesc?: string | null;
  prefix?: string;
}

interface TargeMenu {
  key: string;
  label: string;
  description?: React.ReactNode;
}

const Breadcrumb = ({ replace = "", replaceDesc, prefix }: Props) => {
  const { pathname } = useLocation();
  const menuItems = useMenu();
  const splitPath = pathname.split("/");
  const subPath = splitPath[2] ? `/${splitPath[2]}` : "";

  let targetSubMenu: TargeMenu = { key: "", label: "", description: "" };

  const targetMenu = menuItems.find((item) => item.key === splitPath[1]) ?? {
    icon: "",
    key: "",
    description:"",
  };

  menuItems.forEach((item) => {
    item.children.forEach((child) => {
      if (child.key === `/${splitPath[1]}${subPath}`) {
        targetSubMenu = { ...child };
      }
    });
  });

  const title = replace || targetSubMenu.label;
  const desc = replaceDesc || targetSubMenu.description;

  const items: BreadcrumbProps["items"] = [
    {
      title: (
        <div style={breadcrumbTitleWrapperStyle}>
          {targetMenu.icon}
          {prefix}
          <Typography.Text strong style={breadcrumbTitleStyle}>
            {title}
          </Typography.Text>
          {desc && (
            <MenuDescription desc={desc ?? ""} />
          )}
        </div>
      ),
    },
  ];

  return <AntBreadcrumb items={items} />;
};

export default Breadcrumb;
