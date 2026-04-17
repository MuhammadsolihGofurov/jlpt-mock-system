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
    }
    else if (!isAuthenticated && !loading) {
      dispatch(getMe());
    }
  }, [isAuthenticated, loading, dispatch, router]);

  useEffect(() => {
    if (mounted && !loading && isAuthenticated && user && roles.length > 0) {
      const hasAccess = roles.includes(user.role);
      if (!hasAccess) {
        router.push("/dashboard");
      }
    }
  }, [mounted, loading, isAuthenticated, user, roles, router]);

  // Har qanday holatda children'ni qaytaramiz
  // mounted tekshiruvi Client-side hydration xatolarini oldini olish uchun kerak
  if (!mounted) return null;

  return <>{children}</>;
};

export default AuthGuard;