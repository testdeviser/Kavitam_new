import { Navigate } from "react-router-dom";

const Protected = ({ isLoggedIn, children,routeName }) =>
    {  
        if(routeName=='home')
        {
            if (!isLoggedIn) {
                return <Navigate to="/login" replace />;
            }
            return children;
        }
        else if(routeName=='login')                                    //login
        {
            if (!isLoggedIn)
            {
                return children;
            }
            return <Navigate to="/home" replace />;
         }
         else if(routeName=='register')                             //register
         {
            if (!isLoggedIn)
            {
                return children;
            }
            return <Navigate to="/home" replace />;
         }
    }
    


export default Protected;