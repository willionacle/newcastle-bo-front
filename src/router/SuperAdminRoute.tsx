import { Navigate, Outlet } from "react-router-dom";
import useAdminAccessStore from "@/store/admin-access.store";

// 관리자 계정 관리 and its audit trail are super-admin only. The sidebar
// hides them for everyone else, but the URL still resolves — typed in,
// bookmarked, or left open in a tab whose tier moved to someone else.
//
// `false` is the server's answer (it is never null on the wire, even on a client
// whose database has not applied the migration) and sends the operator home.
// `null` is "not known here yet" — /api/auth/validate is in flight, or it failed
// for a reason that is not an answer — and renders the screen: every
// /api/admin-accounts route is gated server-side and answers 403 on its own,
// which the screen shows. Redirecting on `null` would throw out an operator who
// is the super admin because their network blinked.
const SuperAdminRoute = () => {
  const isSuperAdmin = useAdminAccessStore((state) => state.isSuperAdmin);

  if (isSuperAdmin === false) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default SuperAdminRoute;
