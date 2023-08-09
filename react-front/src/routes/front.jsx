import React from 'react';
import Main from '../Component/front/Main';
import Home from '../Component/front/pages/Home';
import Login from '../Component/front/Auth/Login';
import Register from '../Component/front/Auth/Register';
import Mynumbers from '../Component/front/Mynumbers/Mynumbers';
import Game from '../Component/front/pages/Game';
import AllEventResults from '../Component/front/pages/AllEventResults';
import EmailSuccess from '../Component/front/Auth/EmailSuccess';
import CountDouwn from '../Component/front/CountDown/CountDouwn';
// import ProfileSetting from "./Component/front/profileSetting/ProfileSetting";


const userRoutes = [

    { path: '/login', exact: true, name: 'Login', component: Login },
    { path: '/register', exact: true, name: 'Register', component: Register },
    { path: '/game', exact: true, name: 'Game', component: Game },
    { path: '/allEventResults', exact: true, name: 'AllEventResults', component: AllEventResults },
    { path: '/mynumbers', exact: true, name: 'Mynumbers', component: Mynumbers },
    { path: '/EmailSent', exact: true, name: 'EmailSuccess', component: EmailSuccess },
    { path: '/countdown', exact: true, name: 'CountDouwn', component: CountDouwn },
    // {path: '/profile', exact: true, name: 'ProfileSetting', component:ProfileSetting}, 
    { path: '/', exact: true, name: 'Home', component: Home },

];

export default userRoutes;


