import { api } from "@/api/axios"
import { APIEndpoints, ResPostList } from "@/api/types";
import useUserStore from "@/store/user.store";
import { useState } from "react"

const useGetList = (params: any, endpoint: APIEndpoints) => {
    const {token, userid} = useUserStore.getState();
    const [body, setBody] = useState({...params, userid: userid})
    const [totalItems, setTotalItems] = useState(0)
    const [list, setList] = useState<ResPostList['data']>()
    const [isLoading, setLoading] = useState(false);
    const [response, setResponse] = useState({})

    const getList = async () => {
        setLoading(true)
        try {
            const res = await api[endpoint](body, token)
            const { data: {code, data, totalitems} } = res
            
            setResponse(data)
            console.log('DATA USEGETLIST', data)
            if (code == 0) {
                setList(data)
                setTotalItems(totalitems)
            } else {
                setList([])
                setTotalItems(0)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePagination = (page: number, pageSize: number) => {
        console.log('Pagination', page, pageSize)
        setBody((prevData: any) => ({
            ...prevData,
            page: page,
            limit: pageSize
        }))
    }

    return {
        response,
        userid,
        token,
        body,
        setBody,
        totalItems,
        setTotalItems,
        list,
        setList,
        isLoading,
        setLoading,
        getList,
        handlePagination
    }
}

export default useGetList