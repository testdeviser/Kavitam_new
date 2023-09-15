import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Main from "./Component/front/Main";
import Game from "./Component/front/pages/Game";
import Home from "./Component/front/pages/Home";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Register from "./Component/front/Auth/Register";
import Login from "./Component/front/Auth/Login";
import ForgotPassword from "./Component/front/Auth/ForgotPassword";
import MasterLayout from "./layouts/admin/MasterLayout";
import AdminRoutes from "./routes/admin";
import AdminProtectedRoutes from "./protected_Routes/AdminRoutes";
import Mynumbers from "./Component/front/Mynumbers/Mynumbers";
import CountDouwn from "./Component/front/CountDown/CountDouwn";
import EmailSuccess from "./Component/front/Auth/EmailSuccess";
import userRoutes from "./routes/front";
import UserProtectedRoutes from "./protected_Routes/UserProtectedRoutes";
import Setting from "./Component/front/profileSetting/ProfileSetting";
import Profile from "./Component/front/profileSetting/Profile";
import Wallet from "./Component/front/profileSetting/wallet/wallet";
import PaymentHistory from "./Component/front/profileSetting/wallet/paymentHistory";
import RefferalHistory from "./Component/front/profileSetting/wallet/RefferalHistory";
import History from "./Component/front/profileSetting/History";
import Refferral from "./Component/front/profileSetting/Refferrals/Refferral";
import Aboutus from "./Component/front/Auth/Aboutus";
import PrivacyPolicy from "./Component/front/Auth/PrivacyPolicy";
import TermsConditons from "./Component/front/Auth/TermsConditions";
import Faq from "./Component/front/Auth/Faq";
import Contactus from "./Component/front/Auth/Contactus";
import Payment from "./Component/front/Payment";
import UtrPop from "./Component/front/UtrPop";
import { WalletProvider } from "./WalletContext";
import ChangePassword from "./Component/front/profileSetting/ChangePassword";
import AddBankAccount from "./Component/front/profileSetting/AddBankAccount";
import Withdrawal from "./Component/front/profileSetting/Withdrawal";
import GoogleTranslator from "./Component/front/GoogleTranslator";
import NotFound from "./NotFound";
// import 'datatables.net-dt/css/jquery.dataTables.css';
// import 'datatables.net-dt/js/dataTables.dataTables';


axios.defaults.baseURL = 'http://localhost:8000/';
// axios.defaults.baseURL = 'https://kavitam.com/lara_beckend/public';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

function App() {
  const isLoggedIn = !!localStorage.getItem('auth_token');
  const isAdmin = localStorage.getItem('user_name') == 'admin'; // Assuming you store user role in local storage

  // const googleTranslateElementInit = () => {
  //   new window.google.translate.TranslateElement(
  //     {
  //       pageLanguage: "en",
  //       includedLanguages: "en,hi,pa", // English, Hindi, and Punjabi languages
  //       defaultLanguage: "en",
  //       autoDisplay: false,
  //     },
  //     "google_translate_element"
  //   );
  // };
  // useEffect(() => {
  //   var addScript = document.createElement("script");
  //   addScript.setAttribute(
  //     "src",
  //     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  //   );
  //   document.body.appendChild(addScript);
  //   window.googleTranslateElementInit = googleTranslateElementInit;
  // }, []);

  const location = useLocation();

  useEffect(() => {
    // Extract the current route path and format it for class names
    const routeClassName = location.pathname.replace('/', '').replace('/', '-');
    if (routeClassName === '') {
      document.body.className = 'page-main';
    } else {
      document.body.className = `page-${routeClassName}`;
    }

  }, [location]);

  if (isAdmin && isLoggedIn && location.pathname === '/') {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    // <Routes>
    // </Routes>
    <WalletProvider>
      <div id="google_translate_element"></div>
      <Routes>
        {/* <Route exact path="/"  element={<Main/>}> 
        <Route index element={<Home/>}/>   
        <Route path='/login' element={<Login/>}/> 
        <Route path='/game' element={<Game/>}/>    
        <Route path='/register' element={<Register/>}/>         
       </Route> */}

        <Route path="/" element={<Main />}>
          {/* <Route  index exact element={<Home/>}/>
        <Route path="/mynumbers" element={localStorage.getItem('auth_token')?<Mynumbers/>:<Home/>}/>
        <Route path='/login' element={localStorage.getItem('auth_token')?<Home/>:<Login/>}/>   
        <Route path='/register' exact element={localStorage.getItem('auth_token')?<Home/>:<Register/>}/>        
        <Route path='/game' element={localStorage.getItem('auth_token')?<Game/>:<Home/>}/> 
        <Route path='/EmailSent' element={ <EmailSuccess/>}/>
        <Route path='/countdown' element={<CountDouwn/>}/>
        */}

          <Route index exact element={<Home />} />

          <Route path="/googleTranslator" element={<GoogleTranslator />} />

          <Route path="/UtrPop" element={<UtrPop />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsconditions" element={<TermsConditons />} />
          <Route path="/faq" element={<Faq />} />
          <Route path='/EmailSent' element={<EmailSuccess />} />
          <Route path='/login' element={localStorage.getItem('auth_token') ? <Home /> : <Login />} />
          <Route path='/register' exact element={localStorage.getItem('auth_token') ? <Home /> : <Register />} />
          <Route path='/Setting' element={<Setting />}>
            {/* <Route
            path="/Setting"
            element={isLoggedIn ? <Setting /> : <Navigate to="/login" />}
          > */}
            <Route index element={<Profile />} />
            <Route path='/Setting/wallet' element={<Wallet />}>
              <Route index element={<PaymentHistory />} />
              <Route path='/Setting/wallet/refferal-history' element={<RefferalHistory />} />
            </Route>
            <Route path='/Setting/History' element={<History />} />
            <Route path='/Setting/changePassword' element={<ChangePassword />} />
            <Route path='/Setting/withdrawal' element={<Withdrawal />} />
            <Route path='/Setting/AddBankAccount' element={<AddBankAccount />} />
            <Route path='/Setting/Refferral' element={<Refferral />} />

          </Route>

          {userRoutes.filter(route => route.component)
            .map(({ path, name, component: Component }) => (
              <Route path={path} key={path} element={
                <UserProtectedRoutes>
                  <Component />
                </UserProtectedRoutes>
              } />
            ))}
          <Route index element={<Navigate to="/" />} />
        </Route>

        {/* ----------------------------------admin-------------------------------------------------- */}

        <Route path='/admin' element={<MasterLayout />} />
        <Route path='/admin' element={<AdminProtectedRoutes><MasterLayout /></AdminProtectedRoutes>}>
          {AdminRoutes.filter(route => route.component)
            .map(({ path, component: Component }) => (
              <Route path={path} key={path} element={<Component />} />
            ))}
          <Route index element={<Navigate to="/admin/dashboard" />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </WalletProvider>
  );
}
export default App;


