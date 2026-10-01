import { getCategoriesApi } from "@/api/stream-community/get";
import { Select } from "antd";

export default function MatchTypeSelect({ value, onChange }: any) {
  const { swr } = getCategoriesApi();
  const options = swr?.data?.data.filter((item)=> item.is_visible).map((item)=>({
    label:item.display_name,
    value:item.category
  }))

  return (
    <Select
      allowClear
      value={value}
      onChange={onChange}
      size="small"
      options={options}
    />
  );
}
