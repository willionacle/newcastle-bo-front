import { streamcommunitylistApi } from "@/api/stream-community/get";
import i18next from "@/i18n/i18n";
import { Form, Select } from "antd";
import { SelectProps } from "antd/lib";


const MatchSelect = ({...props}:SelectProps) => {
  const { swr } = streamcommunitylistApi({limit: 1000});
  return (
    <Form.Item
      label={i18next.t("sports.matchSelect")}
      name="match_id"
      rules={[{ required: true, message: i18next.t("validation.selectMatchDot") }]}
    >
      <Select
        placeholder={i18next.t("sports.matchSelectPlaceholder")}
        showSearch
        optionFilterProp="label"
        options={swr.data?.data.map((m) => ({
          value: m.MatchID,
          label: `${m.League} — ${m.Home} vs ${m.Away}`,
        }))}
        size="small"
        style={{ width: "100%" }}
        {...props}
      />
    </Form.Item>
  );
};

export default MatchSelect;
