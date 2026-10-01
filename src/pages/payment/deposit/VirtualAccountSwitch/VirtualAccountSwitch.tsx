import i18next from "@/i18n/i18n";
import { api } from "@/api/axios"
import { getDepositAccountInUse, DepositAccInUse } from "@/api/deposit-account/get"
import { PostDepositInUse, SWRType } from "@/api/types"
import useUserStore from "@/store/user.store"
import { Col, Flex, notification, Switch } from "antd"
import { useState, useEffect } from "react"


const VirtualAccountSwitch = () => {
    const {token, userid} = useUserStore();
    const [depositInUseData, setDepositInUseData] = useState<SWRType<DepositAccInUse[]> | null>(null);
    const [loading, setLoading] = useState(false)

    // Fetch deposit in use data on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getDepositAccountInUse();
            setDepositInUseData(data);
            setLoading(false);
        };
        
        fetchData();
    }, []);

    const handleVirtualAccChange = async (checked: boolean, type: PostDepositInUse['type']) => {
        console.log(checked, type);
        if (loading) return;
        setLoading(true)
        try {
            const reqBody = {
                "userid"    : userid,
                "type"      :  type,
                "in_use"    : checked ? 1 : 0
            };

            const res = await api.depositSetInuse(reqBody, token);
            const { code, message }= res.data;

            if (code == 0) {
                notification.success({message: message});
                // Refresh the data
                const newData = await getDepositAccountInUse();
                setDepositInUseData(newData);
            } else {
                notification.error({message: message});
            }
            
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Col>
                <Flex style={{flexDirection: 'column'}}>
                    <label htmlFor="" style={{padding: '0 0 8px'}}>{i18next.t("payment.virtualAccount1")}</label>
                    <Switch style={{marginTop: 3}} onChange={(e) => handleVirtualAccChange(e, 'v-account1')} checked={depositInUseData?.data?.[0]?.v_account1_default === 1} loading={loading} />
                </Flex>
            </Col>
            <Col>
                <Flex style={{flexDirection: 'column'}}>
                    <label htmlFor="" style={{padding: '0 0 8px'}}>{i18next.t("payment.virtualAccount2")}</label>
                    <Switch style={{marginTop: 3}} onChange={(e) => handleVirtualAccChange(e, 'v-account2')} checked={depositInUseData?.data?.[0]?.v_account2_default === 1} loading={loading} />
                </Flex>
            </Col>
        </>
    )
}

export default VirtualAccountSwitch