import { InboxOutlined } from "@ant-design/icons";
import { Upload, notification } from "antd";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Papa from "papaparse";
import dayjs, { Dayjs } from "dayjs";

const { Dragger } = Upload;

interface StringOutputOptions {
  column?: string;        
  headerless?: boolean;   
  trim?: boolean;
  ignoreEmpty?: boolean;
  unique?: boolean;
}

interface Props {
  data: any[];
  setData: Dispatch<SetStateAction<any | undefined>>;
  stringOutput?: StringOutputOptions;
}

const UploadCSVFile = ({ data, setData, stringOutput }: Props) => {
  const [isParsing, setIsParsing] = useState(false);

  const handleBeforeUpload = (file: File) => {
    if (file.type !== "text/csv") {
      notification.error({ message: `${file.name} is not a CSV File.` });
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleCustomRequest: UploadProps["customRequest"] = async (option) => {
    const { onSuccess, onError, file, filename } = option;
    if (!file) return;
    setIsParsing(true);
    const csvFile = file as RcFile;

    const useHeader = !stringOutput?.headerless;

    Papa.parse(csvFile, {
      header: useHeader,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        const raw = result.data as any[];

        let output: any;

        if (!stringOutput) {
          const rows = raw.map((item: any, index: number) => {
            const formattedDates: Record<string, any> = {};
            for (const [key, value] of Object.entries(item)) {
              if (String(key).toLowerCase().includes("date")) {
                formattedDates[key] = dayjs(value as Dayjs);
              }
            }
            return { ...item, ...formattedDates, key: index };
          });
          output = rows;
        } else {
          let list: string[] = [];

          if (stringOutput.headerless) {
            list = raw.map((r) => String(r?.[0] ?? ""));
          } else {
            const col =
              stringOutput.column ??
              (raw.length ? Object.keys(raw[0] ?? {})[0] : "");
            list = raw.map((r) => String(r?.[col] ?? ""));
          }

          if (stringOutput.trim) list = list.map((s) => s.trim());
          if (stringOutput.ignoreEmpty) list = list.filter((s) => s.length > 0);
          if (stringOutput.unique) list = Array.from(new Set(list));

          output = list;
        }

        try {
          setData(output);
          onSuccess?.(output);
        } finally {
          setIsParsing(false);
        }
      },
      error: (error) => {
        onError?.(error as any);
        notification.error({
          message: `Error uploading ${filename} - ${String(error)}`,
        });
        setIsParsing(false);
      },
    });
  };

  useEffect(() => {
    if (data) console.log("DATA", data);
  }, [data]);

  return (
    <Dragger
      name="csv_file"
      customRequest={handleCustomRequest}
      beforeUpload={handleBeforeUpload}
      disabled={isParsing}
      className="mb-3"
      accept=".csv"
      showUploadList={false}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">Only CSV files are supported.</p>
    </Dragger>
  );
};

export default UploadCSVFile;
