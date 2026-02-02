import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";

const useAuth = () => {
    const userData = useSelector((state: RootState) => state.auth.userData)
    const status = useSelector((state: RootState) => state.auth.status)

    const navigate = useNavigate();
    
    useEffect(() => {
        if(!status){
            navigate("/login")
        }
    }, [status])
    

    return {
        username: userData || "",
        isAuthenticated: status
    }
}

export default useAuth;