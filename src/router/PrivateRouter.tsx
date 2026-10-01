import instance from "@/api/axios";
import { meApi } from "@/api/users/me";
import useUserStore from "@/store/user.store";
import useAdminAccessStore from "@/store/admin-access.store";
import { Spin, notification } from "antd";
import { useEffect, useState, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// Global flag to prevent multiple 401 handling
let is401BeingHandled = false;
let lastHandledTime = 0;
const DEBOUNCE_TIME = 1000; // 1 second debounce

// Set up interceptor only once, outside component
let interceptorId: number | null = null;

const PrivateRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetUser = useUserStore((state) => state.resetUser);
  const [loading, setLoading] = useState(false);
  const navigationRef = useRef({ navigate, resetUser });

  // Update refs to avoid stale closures
  useEffect(() => {
    navigationRef.current = { navigate, resetUser };
  }, [navigate, resetUser]);

  useEffect(() => {
    // useAxiosInterceptors()
    async function checkPermission() {
      try {
        setLoading(true);
        const data = await meApi();

        if (data.code == 0) {
          setLoading(false);
        } else {
          navigate("/login");
          setLoading(false);

          notification.error({
            message: "Check Your Permission",
            description: "Move Login Page",
          });

          resetUser();
        }
      } catch (error) {
        navigate("/login");
        setLoading(false);

        notification.error({
          message: "Check Your Permission",
          description: "Move Login Page",
        });

        resetUser();
      }
    }

    checkPermission();

    // Set up interceptor only if not already set
    if (interceptorId === null) {
      interceptorId = instance.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          const now = Date.now();
          
          if (error.response && error.response.status === 401) {
            // Check if we're already handling a 401 or if it's within debounce time
            if (!is401BeingHandled && (now - lastHandledTime > DEBOUNCE_TIME)) {
              is401BeingHandled = true;
              lastHandledTime = now;

              console.error('Unauthorized access - redirecting to login.');
              
              // Clear all existing notifications
              notification.destroy();
              
              // Show single error notification
              notification.error({
                message: "Session Expired",
                description: "Please login again",
                duration: 3,
              });

              // Perform logout actions
              navigationRef.current.resetUser();
              navigationRef.current.navigate('/login');

              // Reset flag after a short delay
              setTimeout(() => {
                is401BeingHandled = false;
              }, DEBOUNCE_TIME);
            }
          } else if (error.response) {
            // The tier is re-read from the database on every /api/admin-accounts
            // request, so a 403 there is the answer and not a transient failure:
            // this session is not the super admin — most often because a
            // transfer demoted it while the screen was open. Drop the stored
            // tier so the two menu entries go with it, say why once, and leave.
            // Never retried.
            if (
              error.response.status === 403 &&
              String(error.config?.url ?? "").startsWith("/api/admin-accounts")
            ) {
              useAdminAccessStore.getState().setIsSuperAdmin(false);
              notification.warning({
                message: error.response.data?.message || "Forbidden",
                duration: 3,
              });
              navigationRef.current.navigate("/");
              return Promise.reject(error);
            }

            // Calls that handle their own failures opt out with `silent: true`
            // in the request config — a raw "Request failed with status code
            // 403" toast is noise, not information, on a screen that renders the
            // server's own message.
            if (error.config?.silent) return Promise.reject(error);

            // For non-401 errors, show notification
            notification.error({
              message: error.code || "Error",
              description: error.message || "An error occurred",
            });
          }

          return Promise.reject(error);
        }
      );
    }

    // Clean up interceptor on unmount
    return () => {
      if (interceptorId !== null) {
        instance.interceptors.response.eject(interceptorId);
        interceptorId = null;
      }
    };
  }, [location]);

  return (
    <Spin spinning={loading}>
      <Outlet />
    </Spin>
  );
};

export default PrivateRouter;
