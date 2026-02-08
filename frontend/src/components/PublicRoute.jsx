import { useSelector } from "react-redux"
import { Navigate, replace } from "react-router-dom";

const PublicRoute = ({children}) => {
    const isAuthenticated = useSelector(state=>state.auth.isAuthenticated);

    if(isAuthenticated){
        return <Navigate to="/" replace/>
    }

    return children;
}
export default PublicRoute;