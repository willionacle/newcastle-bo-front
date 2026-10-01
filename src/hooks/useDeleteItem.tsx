import { api } from "@/api/axios"
import { DeleteAPIEndpoints, PostAPERes, PostGetBannerRes, PostGetHeroRes, PostGetNoticeRes } from "@/api/types";
import useUserStore from "@/store/user.store";
import { notification } from "antd";
import { useState } from "react"

type ResponseType<T extends DeleteAPIEndpoints> = 
    T extends 'deletescevent' ? PostAPERes['data'] :
    T extends 'deleteEvent' ? PostAPERes['data'] :
    T extends 'deleteBanner' ? PostGetBannerRes['data'] :
    T extends 'deleteHero' ? PostGetHeroRes['data'] :
    T extends 'deleteNotice' ? PostGetNoticeRes['data'] :
    T extends 'deleteScForbidWord' ? PostAPERes['data'] :
    unknown;

const useDeleteItem = <T extends DeleteAPIEndpoints>(endpoint: T) => {
    const {token, userid} = useUserStore.getState();
    const [body, setBody] = useState({userid: userid})
    const [data, setData] = useState<ResponseType<T>>()
    const [isLoading, setLoading] = useState(false);
    let t: any

    const deleteItem = async (id: number, refetchList: any,extraParams: Record<string, any> = {}) => {
        setLoading(true)
        try {
            const res = await api[endpoint]({userid: userid, id: id, ...extraParams}, token)
            const { data: {code, data: newData, message } } = res

            if (code == 0) {
                setData(newData as ResponseType<T>)
                t = setTimeout(() => {
                    console.log('delay fetch')
                    refetchList()
                    clearTimeout(t)
                }, 1000)
                notification.success({message: message})
            } else {
                notification.error({message: message})
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
        deleteItem,
    }
}

export default useDeleteItem