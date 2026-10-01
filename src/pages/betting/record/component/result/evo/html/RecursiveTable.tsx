import React from "react";
import { Table } from "antd";

export type JSONLike =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONLike[]
  | { [key: string]: JSONLike };

interface RecursiveTableProps {
  data: JSONLike;
}

const isPlainObject = (val: unknown): val is Record<string, JSONLike> =>
  typeof val === "object" && val !== null && !Array.isArray(val);

const isPrimitive = (val: unknown): boolean =>
  val === null ||
  val === undefined ||
  typeof val === "string" ||
  typeof val === "number" ||
  typeof val === "boolean";

const formatPrimitive = (v: any): string => {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
};

const formatKey = (key: string): string => {
  return (
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/^./, (c) => c.toUpperCase())
  );
};

const RecursiveTable: React.FC<RecursiveTableProps> = ({ data }) => {
  if (!isPlainObject(data)) {
    return <>{formatPrimitive(data)}</>;
  }

  const keys = Object.keys(data);

  const row = keys.reduce((acc, key) => {
    const value = (data as Record<string, JSONLike>)[key];
    if (isPrimitive(value)) {
      acc[key] = formatPrimitive(value);
    } else {
      acc[key] = <RecursiveTable data={value} />;
    }
    return acc;
  }, {} as Record<string, any>);

  const columns = keys.map((key) => ({
    title: formatKey(key), 
    dataIndex: key,
    key,
  }));

  return (
      <Table
        size="small"
        bordered
        pagination={false}
        columns={columns}
        style={{  margin:"0px", width: "100%",borderRadius:"0px" }}
        dataSource={[{ key: "row", ...row }]}
        rootClassName="no-margin-table"
      />
  );
};

export default RecursiveTable;
