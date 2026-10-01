import i18next from "@/i18n/i18n";
import { userDownloadBalanceLogAPI } from "@/api/balance-logs/get";
import { GF } from "@/utils/GlobalFunctions";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, notification, Space } from "antd";
import { MenuProps } from "antd/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DownloadExcelBtn = () => {
  const { t } = useTranslation();
const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (dateRange: "1D" | "1W" | "1M") => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await userDownloadBalanceLogAPI(dateRange);

      if (res.status !== 200) {
        throw new Error("DOWNLOAD_FAILED");
      }

      const disposition =
        res.headers["content-disposition"] ?? res.headers["Content-Disposition"];

      const fileName = GF.getFileNameFromDisposition(
        disposition,
        i18next.t("user.moneyLogXlsx")
      );

      const url = window.URL.createObjectURL(res.data);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      notification.error({
        message: t("toast.common.downloadFailed"),
        description: t("toast.common.downloadFailedDesc"),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const items: MenuProps['items'] = [
    {
      label: i18next.t("user.oneDay"),
      key: '1',
      onClick: () => handleDownload("1D")
    },
    {
      label: i18next.t("agent.al032"),
      key: '2',
      onClick: () => handleDownload("1W")
    },
    {
      label: i18next.t("user.oneMonth"),
      key: '3',
      onClick: () => handleDownload("1M")
    },
  ];

  return (
    // <Button onClick={handleDownload} loading={isDownloading} disabled={isDownloading}>
    //   엑셀 다운로드
    // </Button>
    <Space>
      <Space.Compact>
        <Button onClick={() => handleDownload("1D")} loading={isDownloading} disabled={isDownloading}>{i18next.t("deposit.de011")}</Button>
        <Dropdown menu={{items}} placement="bottomRight" disabled={isDownloading}>
          <Button icon={<DownOutlined />} disabled={isDownloading} />
        </Dropdown>
      </Space.Compact>
    </Space>
  );
}

export default DownloadExcelBtn;