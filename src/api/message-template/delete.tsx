import useUserStore from "@/store/user.store";
import instance from "../axios";
import { PostAPERes, PostDeleteItem } from "../types";
import { AxiosResponse } from "axios";
import { notification } from "antd";

export const deleteMessageTemplateAPI = async (id: number) => {
  const {token, userid} = useUserStore.getState();

  try {
    
    const res = await instance.post<PostDeleteItem, AxiosResponse<PostAPERes>>(`/deletemessagetemplate`, {
      userid: userid,
      id: id
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const {data: {code, message}} = res
  
    if (code === 0) {
      notification.success({message: message})
    } else {
      notification.error({message: message})
    }
  
    return res;
  } catch (error: any) {
    notification.error({message: error})
    console.error(error)
  }

};
