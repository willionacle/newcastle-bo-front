import { Button, Divider, Space } from "antd";
import useCategoryVisibility from "@/hooks/useCategoryVisibility";
import { btnCSS, btnCSSActive, GameCatBtnData } from "./GameCategoryBtn";

interface Props {
  value: string;
  onChange: (gameCategory: string) => void;
  loading?: boolean;
}

// Local-state counterpart to ./GameCategoryBtn for use inside a modal: same options and
// styling, but driven by props instead of the URL so it never rewrites the host page's query.
const ModalGameCategoryBtn = ({ value, onChange, loading }: Props) => {
  const isCategoryVisible = useCategoryVisibility();
  const buttonItems = GameCatBtnData.filter((item) => isCategoryVisible(item.value));

  return (
    <>
      <Space wrap>
        {buttonItems.map((item) => (
          <Button
            key={item.value || "all"}
            style={value === item.value ? btnCSSActive : btnCSS}
            onClick={() => {
              if (!loading) onChange(item.value);
            }}
            loading={loading && value === item.value}
          >
            {item.label}
          </Button>
        ))}
      </Space>
      <Divider />
    </>
  );
};

export default ModalGameCategoryBtn;
