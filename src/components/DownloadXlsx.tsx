import i18next from "@/i18n/i18n";
import { Button } from "antd";
import * as converter from "json-2-csv";

const DownloadXlsx = ({ data, fileName }: { data: any; fileName: string }) => {
  const handleDownload = async () => {
    const csv = converter.json2csv(data, { excelBOM: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // 다운로드를 위한 링크 생성
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // 링크 클릭하여 다운로드
    link.click();

    // 메모리 해제
    URL.revokeObjectURL(link.href);
  };

  return <Button onClick={() => handleDownload()}>{i18next.t("deposit.de011")}</Button>;
};

export default DownloadXlsx;
