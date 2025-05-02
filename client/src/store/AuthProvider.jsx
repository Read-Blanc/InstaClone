import { useEffect, useState, useCallback } from "react";
import { AuthContext } from ".";
import useLocalStorage from "../hooks/useLocalStorage";
import { authenticateUser, logout } from "../api/auth";
import { toast } from "sonner";
import handleError from "../utils/handleError";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useLocalStorage("instashotToken", null);
  const [user, setUser] = useState(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      const res = await logout();
      if (res.status === 200) {
        setAccessToken(null);
        setUser(null);
        window.location.reload();
        toast.success(res.data.message, { id: "logout" });
      }
    } catch (error) {
      toast.error("There was an error trying to log you out");
      console.error(error);
    }
  }, [setAccessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const getUser = async () => {
      try {
        setIsCheckingAuth(true);

        const res = await authenticateUser(accessToken);

        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (error) {
        handleLogout();
        toast.error("There was an error trying to authenticate you");
        console.error(error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    getUser();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        isCheckingAuth,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
