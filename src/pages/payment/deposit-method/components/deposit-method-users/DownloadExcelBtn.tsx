import i18next from "@/i18n/i18n";
import { downloadDepositMethodUsers } from "@/api/deposit-method/get";
import { GF } from "@/utils/GlobalFunctions";
import { Button,  notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DownloadExcelBtn = ({method,fileNameProp = i18next.t("title.userListTitle")}:{method:string,fileNameProp:string | undefined}) => {
  const { t } = useTranslation();
const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await downloadDepositMethodUsers(method);

      if (res.status !== 200) {
        throw new Error("DOWNLOAD_FAILED");
      }

      const disposition =
        res.headers["content-disposition"] ?? res.headers["Content-Disposition"];

      const fileName = GF.getFileNameFromDisposition(
        disposition,
        `${fileNameProp}.xlsx`
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

  return <Button onClick={handleDownload} loading={isDownloading} disabled={isDownloading}>{i18next.t("deposit.de011")}</Button>;
}

export default DownloadExcelBtn;