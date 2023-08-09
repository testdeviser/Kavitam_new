import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function AdminProtectedRoutes({ isSignedIn, children }) {
  const navigate = useNavigate();
  const [Authenticated, setAuthenticated] = useState(false);
  const [Loading, setloading] = useState(true);

  const checkAuth = async () => {
    try {
      const result = await axios.get(`/api/AuthCheck`).then((res) => {
        if (res.data.status === 200) {
          setAuthenticated(true);
        }
        setloading(false);
      });

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkAuth();

    return () => {
      setAuthenticated(false);
    };
  }, []);

  // try {

  //   axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  //     if (err.response.status === 401) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'warning',
  //         text: err.response.data.message,
  //       });
  //       navigate('/');
  //     }
  //     return Promise.reject(err);
  //   });


  //   axios.interceptors.response.use(function (response) {
  //     return response;
  //   }, function (error) {
  //     if (error.response.status === 403) // Access Denied
  //     {

  //       Swal.fire({
  //         icon: 'error',
  //         title: 'warning',
  //         text: error.response.data.message,
  //       });

  //       navigate('/');
  //     }

  //     else //Page Not Found
  //     {
  //       Swal.fire({
  //         icon: '404 Error',
  //         title: 'warning',
  //         text: 'Url/Page Not Found',
  //       });
  //       navigate('/');
  //     }

  //     // else if(error.response.status === 404) //Page Not Found
  //     // {       
  //     //     Swal.fire({
  //     //         icon:'404 Error',
  //     //         title:'warning',
  //     //         text:'Url/Page Not Found',
  //     //     });
  //     //     navigate('/');
  //     // }
  //     return Promise.reject(error);
  //   }
  //   );

  // }
  // catch (err) {
  //   console.log(err);
  // }


  if (Loading) {
    return (
      <div className="text-center" style={{ marginTop: "40vh" }}>
        <button className="btn btn-dark" type="button" disabled>
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </button>
      </div>
    );
  }
  else {
    if (!setAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  }
}
export default AdminProtectedRoutes;