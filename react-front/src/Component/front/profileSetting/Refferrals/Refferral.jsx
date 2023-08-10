
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Model from './Inputmodal';
import axios from 'axios';
import Datatable from 'react-data-table-component';

function Refferral(props) {

  const [show, setShow] = useState({
    model: false,
    refferralCode: '',
    referralCode: '',
  });

  const refferal_his = useRef();

  const handleClose = () => setShow({ ...show, model: false });
  const handleShow = () => setShow({ ...show, model: true });

  const fetchdata = () => {
    const user_id = localStorage.getItem('user_id');
    try {
      axios.get(`/api/fetch-userRefferalCode/` + user_id).then(res => {
        //const referralLink = 'http://localhost:3000/register?referralCode=';
        const referralLink = 'https://kavitam.com/register?referralCode=';
        const referralCode = res.data.user.user_referral_link;
        const concatenatedLink = referralLink + referralCode;
        setShow({ ...show, refferralCode: concatenatedLink, referralCode: referralCode });

      }).catch(error => {
        console.log(error.message);
      });
    }
    catch (err) {
      console.log(err);
    }

  }

  // componentDidMount(){
  //   fetchdata();
  // }

  const shareOnInstagram = () => {
    const encodedReferralCode = encodeURIComponent(show.refferralCode);
    const instagramUrl = `https://www.instagram.com/?text=${encodedReferralCode}`;
    window.open(instagramUrl, '_blank');
  };

  const [data, setdata] = useState();
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(5)

  const fetchReferral_data = () => {
    try {
      axios.get(`api/refferralCommission`).then(res => {
        setdata(res.data.payments);

      }).catch(err => {
        console.log(err);
      });

    } catch (err) {
      console.log();
    }
  }

  const columns = [
    {
      name: "Username",
      selector: (row) => row.referred_to_userid,
    },
    {
      name: "Amount",
      selector: (row) => row.total_amount
    },
    {
      name: "30% commission",
      selector: (row) => row.total_commision
    },
    // {
    //   name: "Action",
    //   cell: (row) => <button className='btn btn-primary' onClick={() => alert(row.id) }>Edit</button>
    // }
  ];

  useEffect(() => {
    fetchReferral_data();
    fetchdata();
  }, []);



  const lastIndex = currentPage * DataPerPage.current;
  const firstIndex = lastIndex - DataPerPage.current;
  const data1 = data ? data.slice(firstIndex, lastIndex) : [];

  const referralCode = show.referralCode;

  const inputRef = useRef(null);

  const [isCopied, setIsCopied] = useState(false); // Add state for tracking copied text

  // const handleCopy = () => {
  //   const inputValue = inputRef.current.value;
  //   navigator.clipboard.writeText(inputValue)
  //     .then(() => {
  //       console.log('Text copied to clipboard: ', inputValue);
  //     })
  //     .catch((error) => {
  //       console.error('Error copying text to clipboard: ', error);
  //     });
  // };

  const handleCopy = () => {
    const inputValue = inputRef.current.value;
    navigator.clipboard.writeText(inputValue)
      .then(() => {
        console.log('Text copied to clipboard: ', inputValue);
        setIsCopied(true); // Set the state to indicate that text is copied
        setTimeout(() => {
          setIsCopied(false); // Reset the state after 5 seconds
        }, 5000); // 5000 milliseconds = 5 seconds
      })
      .catch((error) => {
        console.error('Error copying text to clipboard: ', error);
      });
  };

  return (
    <div className='col-lg-8 col-md-12 col-sm-12'>
      <div className="new_refers">
        <Model setShow={setShow} show={show} refferralCode={show.refferralCode} showmodel={show.model} handleClose={handleClose} handleShow={handleShow} />

        <div className='user-wallet_info mt-2' style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
          <div className='refferal-heading'>
            <h3 >Share the referral code</h3>
            {/* <h6>Copying and sending it or sharing it on your social media.</h6> */}
            <div className='refferCode'>
              <input type="text" name="" id="" value={show.refferralCode} disabled />
              <ul>
                {/* <li onClick={handleShow}><Link to=''><GrMail /></Link></li> */}
                <li><Link to={`https://wa.me/?text=${encodeURIComponent(show.refferralCode)}`}><FaWhatsapp /></Link></li>
                {/* <li><Link to='' onClick={shareOnInstagram}><FaInstagram /></Link></li> */}
                <li><Link to={`https://www.facebook.com/?text=${encodeURIComponent(show.refferralCode)}`}><FaFacebook /></Link></li>
                <li><Link to={`https://twitter.com/?text=${encodeURIComponent(show.refferralCode)}`}><FaTwitter /></Link></li>
                <li><Link to={`https://www.linkedin.com/?text=${encodeURIComponent(show.refferralCode)}`}><FaLinkedin /></Link></li>
              </ul>
            </div>
            <div className='refer_copy-code define_float'>
              <input type='text' id='referalCode' name='referalCode' value={referralCode} ref={inputRef} disabled />
              <button type="button" onClick={handleCopy}>
                Copy
              </button>
            </div>
            {isCopied && <p>Copied!</p>} {/* Show "Copied" when isCopied is true */}
          </div>
        </div>

        <Datatable
          title="Referral"
          columns={columns}
          data={data}
          pagination
          fixedHeader
          fixedHeaderScrollHeight='400px'
          //selectableRows
          selectableRowsHighlight
          highlightOnHover
        //actions={<button className='btn btn-sm btn-info'>Export</button>}
        />
      </div>
    </div>
  );
}
export default Refferral;