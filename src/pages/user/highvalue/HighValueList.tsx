import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import Filter from "../Filter";
import List from "../List";
import { userAPI } from "@/api/users/get";
// import CreateBtn from "@/components/CreateBtn";

const HighValueUser: React.FC = () => {
const { onHeaderCell, listSwr, setFilters, paginationProps } = userAPI();

return (
	<Card>
	<Space align="center">
		<Breadcrumb replace={i18next.t("user.highValueInfo")} />
		{/* <CreateBtn /> */}
	</Space>
	<Divider />
	<Filter setBody={setFilters} isOnlineVal={"1"} />
	<Divider />
	<List
		data={listSwr.data?.data?.items}
		loading={listSwr.isLoading}
		onHeaderCell={onHeaderCell}
		pagination={paginationProps(listSwr.data?.data?.pagination?.totalItems)}
	/>
	</Card>
);
};

export default HighValueUser;
