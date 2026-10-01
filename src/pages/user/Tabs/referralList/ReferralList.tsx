import { referralLogAPI2 } from "@/api/referral-logs/get";
import List from "./List";
// import Filter from "./Filter";
import { Divider } from "antd";
import { ResUser } from "@/api/types";

interface Props {
  data: ResUser['data'] | undefined;
}


const ReferralList = ({ data }: Props) => {
  const { swr } = referralLogAPI2(data?.username);

  return (
    <>
      {/* <Filter setFilters={setFilters} user={data} /> */}
      <Divider />
      <List
        data={swr.data?.referrals}
        loading={swr.isLoading}
        pagination={false}
        onHeaderCell={() => ({ onClick: () => {} })}
        mutate={swr.mutate}
        referralUsername={data?.username}
      />
    </>
  );
};

export default ReferralList;
