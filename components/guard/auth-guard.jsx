import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { getMe } from "@/redux/slice/auth";

const AuthGuard = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
    } else if (!isAuthenticated && !loading) {
      dispatch(getMe());
    }
  }, [isAuthenticated, loading, dispatch, router]);

  useEffect(() => {
    if (mounted && isAuthenticated && user && roles.length > 0) {
      const hasAccess = roles.includes(user.role);

      if (!hasAccess) {
        router.push("/dashboard");
      }
    }
  }, [mounted, isAuthenticated, user, roles, router]);

  if (!mounted || (loading && !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasRoleAccess =
    roles.length === 0 || (user && roles.includes(user.role));

  if (isAuthenticated && hasRoleAccess) {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;
