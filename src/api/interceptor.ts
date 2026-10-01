import { useNavigate } from "react-router-dom"
import instance from "./axios";
import { notification } from "antd";
import useUserStore from "@/store/user.store";

const useAxiosInterceptors = () => {
    const navigate = useNavigate();
    const resetUser = useUserStore((state) => state.resetUser);

    instance.interceptors.response.use(
        (response) => {

            return response;
        },
        (error) => {

            if (error.response && error.response.status === 401) {

              console.error('Unauthorized access - redirecting to login.');
              navigate('/login');
              resetUser();

            }

            notification.error({
                message: error.code,
                description: error.message,
            });
      
            return Promise.reject(error);
        }
    )
}

export default useAxiosInterceptors;