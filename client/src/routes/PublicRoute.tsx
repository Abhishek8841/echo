import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth"

const PublicRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />
    if (user) return <Navigate to="/chat"></Navigate>
    return <Outlet />
}

export default PublicRoute