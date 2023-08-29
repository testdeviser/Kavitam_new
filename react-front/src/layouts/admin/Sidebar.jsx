import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSave, FaWallet } from "react-icons/fa";
import { FaGamepad, FaTag, FaCreditCard, FaAngleDown, FaQrcode, FaMoneyBillAlt, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { AiTwotoneLock } from "react-icons/ai";
import { MdEmojiEvents } from "react-icons/md";

function Sidebar(props) {
    const [activeLink, setActiveLink] = useState("/admin/dashboard"); // Set the default active link here

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const isLinkActive = (link) => {
        return link === activeLink ? "active-class" : "";
    };

    return (
        <React.Fragment>
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <ul className="nav">
                        <li>
                            <Link className={`nav-link  ${isLinkActive("/admin/dashboard")}`} to="/admin/dashboard" onClick={() => handleLinkClick("/admin/dashboard")}>
                                <div className="sb-nav-link-icon"><MdOutlineDashboardCustomize size={25} /></div>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/user")}`} to="/admin/user" onClick={() => handleLinkClick("/admin/user")}>
                                <div className="sb-nav-link-icon"><FaGamepad size={25} /></div>
                                Users
                            </Link>
                        </li>
                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/game")}`} to="/admin/game" onClick={() => handleLinkClick("/admin/game")}>
                                <div className="sb-nav-link-icon"><FaGamepad size={25} /></div>
                                Game
                            </Link>
                        </li>
                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/wallet")}`} to="/admin/wallet" onClick={() => handleLinkClick("/admin/wallet")}>
                                <div className="sb-nav-link-icon"><FaWallet size={25} /></div>
                                Wallet
                            </Link>
                        </li>
                        {/* <li>
                            <Link className={`nav-link ${isLinkActive("/admin/events")}`} to="/admin/events" onClick={() => handleLinkClick("/admin/events")}>
                                <div className="sb-nav-link-icon"><FaCalendarAlt size={25} /></div>
                                Events
                            </Link>
                        </li> */}
                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/payments")}`} to="/admin/payments" onClick={() => handleLinkClick("/admin/payments")}>
                                <div className="sb-nav-link-icon"><FaCreditCard size={25} /></div>
                                Payments
                            </Link>
                        </li>
                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/PriceMultiplyBy")}`} to="/admin/PriceMultiplyBy" onClick={() => handleLinkClick("/admin/PriceMultiplyBy")}>
                                <div className="sb-nav-link-icon"><FaTag size={25} /></div>
                                Price Multiply By
                            </Link>
                        </li>

                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/UpiQR")}`} to="/admin/UpiQR" onClick={() => handleLinkClick("/admin/UpiQR")}>
                                <div className="sb-nav-link-icon"><FaQrcode size={25} /></div>
                                UPI & QR Code
                            </Link>
                        </li>

                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/Withdrawal")}`} to="/admin/Withdrawal" onClick={() => handleLinkClick("/admin/Withdrawal")}>
                                <div className="sb-nav-link-icon"><FaMoneyBillAlt size={25} /></div>
                                Withdrawal
                                <div className="submenu-icon"><FaAngleDown /></div>
                            </Link>

                            <ul className="submenu_bkend"> {/* Submenu starts here */}
                                <li>
                                    <Link className={`nav-link ${isLinkActive("/admin/WithdrawalHistory")}`} to="/admin/WithdrawalHistory" onClick={() => handleLinkClick("/admin/WithdrawalHistory")}>
                                        Withdrawal History
                                    </Link>
                                </li>
                                <li>
                                    <Link className={`nav-link ${isLinkActive("/admin/PendingWithdrawal")}`} to="/admin/PendingWithdrawal" onClick={() => handleLinkClick("/admin/PendingWithdrawal")}>
                                        Pending Withdrawal
                                    </Link>
                                </li>
                            </ul>

                        </li>

                        <li>
                            <Link className={`nav-link ${isLinkActive("/admin/ChangePassword")}`} to="/admin/ChangePassword" onClick={() => handleLinkClick("/admin/ChangePassword")}>
                                <div className="sb-nav-link-icon"><AiTwotoneLock size={25} /></div>
                                Change Password
                            </Link>
                        </li>

                    </ul>
                </div>
            </nav>
        </React.Fragment>
    );
}

export default Sidebar;
