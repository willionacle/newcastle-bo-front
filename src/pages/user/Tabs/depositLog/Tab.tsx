import i18next from "@/i18n/i18n";
import { Tabs } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
const tabConfig = [
  {
    key: "total",
    label: i18next.t("col.all"),
    list_type: null,
    transaction_type: null,
  },
  {
    key: "Deposit",
    label: i18next.t("col.deposit"),
    list_type: "deposit",
    transaction_type: "bank",
  },
  {
    key: "withdraw",
    label: i18next.t("topNavi.tn016"),
    list_type: "withdraw",
    transaction_type: "bank",
  },
  {
    key: "usdt-deposit",
    label: i18next.t("user.usdtDeposit"),
    list_type: "deposit",
    transaction_type: "usdt",
  },
  {
    key: "usdt-withdraw",
    label: i18next.t("user.usdtWithdraw"),
    list_type: "withdraw",
    transaction_type: "usdt",
  },
];

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

const Tab = ({ setFilters }: Props) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();

  const currentListType = searchParams.get("list_type");
  const currentTransactionType = searchParams.get("transaction_type");

  const activeTab =
    tabConfig.find(
      (item) =>
        item.list_type === currentListType &&
        item.transaction_type === currentTransactionType
    )?.key || "total";

  const handleTabChange = (key: string) => {
    const tab = tabConfig.find((item) => item.key === key);
    if (!tab) return;

    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("tab", "deposit-log");

    if (tab.list_type) {
      newSearchParams.set("list_type", tab.list_type);
    } else {
      newSearchParams.delete("list_type");
    }

    if (tab.transaction_type) {
      newSearchParams.set("transaction_type", tab.transaction_type);
    } else {
      newSearchParams.delete("transaction_type");
    }

    navigate(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    setFilters((prevData: any) => ({
      ...prevData,
      list_type: currentListType,
      transaction_type: currentTransactionType,
    }));
  }, [search]);

  return (
    <Tabs
      type="card"
      items={tabConfig}
      onChange={handleTabChange}
      activeKey={activeTab}
    />
  );
};

export default Tab;
