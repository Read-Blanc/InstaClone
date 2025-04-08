import { AuthContext } from ".";
import { useState, useEffect as useEfffect, useCallback } from "react";
import  useLocalStorage  from "../hooks/useLocalStorage";
import { authenticateUser } from "../api/auth";
import { toast } from "sonner";
import { useAuth } from ".";

export default function AuthProvider({children}) {
    const [accessToken, setAccessToken] = useLocalStorage("instashotsToken", null);

    const [user, setUser] = useState({
        isError: null,
        data: null,
        isAuthenticated: false,
    });
    const [isCheckingAuth, setIsCheckingAuth] = useState(false);
    const handleLogout = useCallback(() => {
        setAccessToken(null);
        setUser({
            isError: null,
            data: null,
            isAuthenticated: false,
        });
        toast.success("You are logged out", { id : "logout" });
    }, [setAccessToken]);
    

    useEfffect(() => {
        if (accessToken) return
        const getUser = async () => {
            try {
                setIsCheckingAuth(true);
                const res = await authenticateUser(accessToken);
                if (res.status == 200) {
                  setUser(res.data);
                }
            } catch (error){
                console.log(error);
                handleLogout()
            } finally {
                setIsCheckingAuth(false);
            }
        }
        getUser();
    }, [accessToken, handleLogout]);
    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, user, isCheckingAuth, handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
}
