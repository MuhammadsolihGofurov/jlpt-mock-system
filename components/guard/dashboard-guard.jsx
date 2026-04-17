import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getMe } from "@/redux/slice/auth";
import { useDispatch, useSelector } from "react-redux";

export default function withAuthGuard(WrappedComponent, allowedRoles = []) {
  return function GuardedPage(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const { user, loading: reduxLoading } = useSelector(state => state.auth);

    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const accessToken = localStorage.getItem("access");

        if (!accessToken) {
          router.replace("/login");
          return;
        }

        if (!user) {
          try {
            await dispatch(getMe()).unwrap();
          } catch (error) {
            router.replace("/login");
            return;
          }
        }

        setIsChecking(false);
      };

      checkAuth();
    }, [dispatch, router, user]);

    useEffect(() => {
      if (!isChecking && user) {
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          router.replace("/dashboard");
        }
      }
    }, [isChecking, user, allowedRoles, router]);

    const customLoading = isChecking || reduxLoading;

    // Muhim: Agar hali tekshiruv tugamagan bo'lsa, WrappedComponent ichida 
    // user.role kabilarni ishlatishda xato bermasligi uchun 
    // birinchi marta null yoki bo'sh div qaytarish xavfsizroq.
    // if (isChecking && !user) {
    //   return null; // Yoki <GlobalSpinner />
    // }

    return (
      <WrappedComponent
        {...props}
        customLoading={customLoading}
      />
    );
  };
}