import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import axios from "axios";

function Wallet(props) {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("payment history");

  const [data, setdata] = useState({
    wallet: "",
  });

  axios
    .get(`/api/user/wallet/fetch`)
    .then((res) => {
      setdata({ ...data, wallet: res.data.wallet.ammount });
    })
    .catch((error) => {
      console.log(error);
    });

  useEffect(() => {});

  const handlePaymentHistoryClick = () => {
    setActiveButton("payment history");
    navigate("/Setting/wallet");
  };

  const handleReferralHistoryClick = () => {
    setActiveButton("referral history");
    navigate("/Setting/wallet/refferal-history");
  };

  const handleButtonClick = () => {
    // Redirect to the login page
    navigate("/payment");
  };

  return (
    <div className="col-lg-8 col-md-12 col-sm-12">
      <div className="user-wallet_info">
        <div className="wallet">
          <h1>
            {" "}
            <span>
              <FaRupeeSign size={32} />
              {data.wallet}
            </span>
          </h1>
          <h3>Current wallet balance</h3>
        </div>
        <div className="add-wallet-button">
          <button onClick={handleButtonClick} className="btn">
            <img
              src={process.env.PUBLIC_URL + "/image/plus_icon.svg"}
              alt="plus_icon"
            />
            <span>Add Money to wallet</span>
          </button>
        </div>
      </div>

      <div className="wallet_tabs define_float">
        <div className="wallet_wrapper d-flex justify-content-center">
          <button
            onClick={handlePaymentHistoryClick}
            className={`btn ${
              activeButton === "payment history" ? "active-btn-data" : ""
            }`}>
            Payment History
          </button>
          <button
            onClick={handleReferralHistoryClick}
            className={`btn ${
              activeButton === "referral history" ? "active-btn-data" : ""
            }`}>
            Referral History
          </button>
        </div>
      </div>

      <div className="col-md-12 define_float">
        <Outlet />
      </div>
    </div>
  );
}

export default Wallet;
