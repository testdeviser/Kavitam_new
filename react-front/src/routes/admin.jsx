import React from 'react';
import Dashboard from '../Component/admin/dashboard/dashboard';
import Main from '../Component/admin/Main/Main';
import Game from '../Component/admin/Game/Game';
import Internal from '../Component/admin/Internal/Index';
import Outer from '../Component/admin/outer/Outer';
import Wallet from '../Component/admin/wallet/Wallet';
import Events from '../Component/admin/Events/Events';
import CreateEvent from '../Component/admin/Events/CreateEvent';
import EditEvent from '../Component/admin/Events/EditEvent';
import Result from '../Component/admin/Events/Result';
import Payments from '../Component/admin/Payments/Payments';
import EditPayment from '../Component/admin/Payments/Editpayment';
import PriceMultiplyBy from '../Component/admin/PriceMultiplyBy';
import UpiQR from '../Component/admin/UpiQR';
import User from '../Component/admin/User';
import Withdrawal from '../Component/admin/Withdrawal';
import WithdrawalHistory from '../Component/admin/WithdrawalHistory';
import PendingWithdrawal from '../Component/admin/PendingWithdrawal';
import ChangePassword from '../Component/admin/ChangePassword';

const AdminRoutes = [
    { path: '/admin', exact: true, name: 'Admin' },
    { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/admin/main', exact: true, name: 'Main', component: Main },
    { path: '/admin/game', exact: true, name: 'Game', component: Game },
    { path: '/admin/internal', exact: true, name: 'Internal', component: Internal },
    { path: '/admin/Outer', exact: true, name: 'Outer', component: Outer },
    // { path: '/admin/wallet', exact: true, name: 'Wallet', component: Wallet },
    { path: '/admin/wallet', exact: true, name: Wallet, component: Wallet },
    { path: '/admin/events', exact: true, name: Events, component: Events },
    { path: '/admin/events/create', exact: true, name: Events, component: CreateEvent },
    { path: '/admin/event/Edit/:id', exact: true, name: EditEvent, component: EditEvent },
    { path: '/admin/result/:id', exact: true, name: Result, component: Result },
    { path: '/admin/Payments', exact: true, name: Payments, component: Payments },
    { path: '/admin/payment/Edit/:id', exact: true, name: EditPayment, component: EditPayment },
    { path: '/admin/PriceMultiplyBy', exact: true, name: PriceMultiplyBy, component: PriceMultiplyBy },
    { path: '/admin/UpiQR', exact: true, name: UpiQR, component: UpiQR },
    { path: '/admin/User', exact: true, name: User, component: User },
    { path: '/admin/ChangePassword', exact: true, name: ChangePassword, component: ChangePassword },
    { path: '/admin/Withdrawal', exact: true, name: Withdrawal, component: Withdrawal },
    { path: '/admin/WithdrawalHistory', exact: true, name: WithdrawalHistory, component: WithdrawalHistory },
    { path: '/admin/PendingWithdrawal', exact: true, name: PendingWithdrawal, component: PendingWithdrawal },

];
export default AdminRoutes;
