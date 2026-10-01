import { api } from "@/api/axios"
import { ItemAPIEndpoints, PostAPERes, PostGetBannerRes, PostGetDepBonusRes, PostGetHeroRes, PostGetLevelDepRes, PostGetLevelRes,PostGetMessageTemplate, PostGetNoticeRes, PostGetRegulationRes, ResUser } from "@/api/types";
import useUserStore from "@/store/user.store";
import { useState } from "react"


type ResponseType<T extends ItemAPIEndpoints> = 
    T extends 'getEvent' ? PostAPERes['data'] :
    T extends 'getUser' ? ResUser['data']:
    T extends 'getBanner' ? PostGetBannerRes['data'] :
    T extends 'getHero' ? PostGetHeroRes['data'] :
    T extends 'getNotice' ? PostGetNoticeRes['data'] :
    T extends 'getLevel' ? PostGetLevelRes['data'] :
    T extends 'getLevelDeposit' ? PostGetLevelDepRes['data'] :
    T extends 'getDepositBonus' ? PostGetDepBonusRes['data'] :
    T extends 'getRegulation' ? PostGetRegulationRes['data'] :
    T extends 'getMessageTemplate' ? PostGetMessageTemplate['data'] :
    unknown;

const useGetItemData = <T extends ItemAPIEndpoints>(params: any, endpoint: T) => {
    const {token, userid} = useUserStore.getState();
    const [body, setBody] = useState({...params, userid: userid})
    const [data, setData] = useState<ResponseType<T>>()
    const [isLoading, setLoading] = useState(false);

    const getItem = async (id?: number | undefined) => {
        setLoading(true)
        try {
            const res = await api[endpoint](id ? {...body, id: id} : body, token)
            const { data: {code, data } } = res

            if (code == 0) {
                setData(data as ResponseType<T>)
            } else {
                setData(undefined)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return {
        body,
        setBody,
        data,
        setData,
        isLoading,
        setLoading,
        getItem,
    }
}

export default useGetItemData