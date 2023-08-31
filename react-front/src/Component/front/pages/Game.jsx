

import React, { useState, useRef, useEffect, useContext } from "react";
import Navbar from "../../../layouts/front/navbar";
import "bootstrap/dist/css/bootstrap.css";
import "./../../../assets/front/css/home.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { WalletContext } from "../../../WalletContext";

function Game(props) {
  const auth_token = localStorage.getItem('auth_token');
  const navigate = useNavigate();
  const [dataa, setdataa] = useState({
    event: [],
    no_of_result: 17,
    showAllButton: true,
    showLessButton: false
  });

  const fetch_events = () => {
    axios.get('/api/Result_today').then(res => {
      //console.log(res.data.event.length);
      setdataa({ ...dataa, event: res.data.event });
    });
  }

  useEffect(() => {
    fetch_events();
  }, []);
  const viewAllbtn = () => {
    const length = dataa.event.length;
    setdataa({ ...dataa, no_of_result: length, showAllButton: false, showLessButton: true });
  };

  const viewLessbtn = () => {
    setdataa({ ...dataa, no_of_result: 17, showAllButton: true, showLessButton: false });
  };

  const data11 = dataa.event.slice(0, dataa.no_of_result);

  // console.log(data11);


  // useEffect(() => {
  //   const refreshInterval = 60000; // Refresh interval in milliseconds (e.g., 30 seconds)
  //   const intervalId = setInterval(() => {
  //     window.location.reload();
  //   }, refreshInterval);

  //   return () => {
  //     clearInterval(intervalId); // Clean up the interval when the component unmounts
  //   };
  // }, []);

  const { setWalletAmount } = useContext(WalletContext);

  const [paymentStatus, setpaymentStatus] = useState({
    status: false,
    price: 0,
  });
  const [checkNumber_loading, setcheckNumber_loading] = useState(0);

  const [events, setEvents] = useState();
  const [walletBalance, setWalletBalance] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(10);

  // const [selectedMainNumbers, setSelectedMainNumbers] = useState([]);

  // const [selectedOuterNumbers, setSelectedOuterNumbers] = useState([]);
  const [currentTime1, setCurrentTime] = useState([]);
  const [eventsTime, setEventTime] = useState([]);
  const [timeDifference, setTimeDifference] = useState([]);
  const [updatedEventsTime, setUpdatedEventTime] = useState([]);
  const [updatedEventsTime1, setUpdatedEventTime1] = useState([]);
  const [updatedEventsTime2, setUpdatedEventTime2] = useState([]);

  const [selectedMainNumbers, setSelectedMainNumbers] = useState([]);
  const [selectedMainNumbersAmounts, setSelectedMainNumbersAmounts] = useState(
    []
  );
  const [selectedInnerNumbers, setSelectedInnerNumbers] = useState([]);
  const [selectedInnerNumbersAmounts, setSelectedInnerNumbersAmounts] =
    useState([]);
  const [selectedOuterNumbers, setSelectedOuterNumbers] = useState([]);
  const [selectedOuterNumbersAmounts, setSelectedOuterNumbersAmounts] =
    useState([]);

  useEffect(() => {
    // Load selected numbers and their amounts from localStorage on component mount
    const storedSelectedMainNumbers = localStorage.getItem(
      "selectedMainNumbers"
    );
    const storedSelectedMainNumbersAmounts = localStorage.getItem(
      "selectedMainNumbersAmounts"
    );
    const storedSelectedInnerNumbers = localStorage.getItem(
      "selectedInnerNumbers"
    );
    const storedSelectedInnerNumbersAmounts = localStorage.getItem(
      "selectedInnerNumbersAmounts"
    );
    const storedSelectedOuterNumbers = localStorage.getItem(
      "selectedOuterNumbers"
    );
    const storedSelectedOuterNumbersAmounts = localStorage.getItem(
      "selectedOuterNumbersAmounts"
    );

    if (
      storedSelectedMainNumbers &&
      storedSelectedMainNumbersAmounts &&
      storedSelectedInnerNumbers &&
      storedSelectedInnerNumbersAmounts &&
      storedSelectedOuterNumbers &&
      storedSelectedOuterNumbersAmounts
    ) {
      setSelectedMainNumbers(JSON.parse(storedSelectedMainNumbers));
      setSelectedMainNumbersAmounts(
        JSON.parse(storedSelectedMainNumbersAmounts)
      );
      setSelectedInnerNumbers(JSON.parse(storedSelectedInnerNumbers));
      setSelectedInnerNumbersAmounts(
        JSON.parse(storedSelectedInnerNumbersAmounts)
      );
      setSelectedOuterNumbers(JSON.parse(storedSelectedOuterNumbers));
      setSelectedOuterNumbersAmounts(
        JSON.parse(storedSelectedOuterNumbersAmounts)
      );
    }
  }, []);

  useEffect(() => {
    // Save selected numbers and their amounts to localStorage whenever they change
    localStorage.setItem(
      "selectedMainNumbers",
      JSON.stringify(selectedMainNumbers)
    );
    localStorage.setItem(
      "selectedMainNumbersAmounts",
      JSON.stringify(selectedMainNumbersAmounts)
    );
    localStorage.setItem(
      "selectedInnerNumbers",
      JSON.stringify(selectedInnerNumbers)
    );
    localStorage.setItem(
      "selectedInnerNumbersAmounts",
      JSON.stringify(selectedInnerNumbersAmounts)
    );
    localStorage.setItem(
      "selectedOuterNumbers",
      JSON.stringify(selectedOuterNumbers)
    );
    localStorage.setItem(
      "selectedOuterNumbersAmounts",
      JSON.stringify(selectedOuterNumbersAmounts)
    );
  }, [
    selectedMainNumbers,
    selectedMainNumbersAmounts,
    selectedInnerNumbers,
    selectedInnerNumbersAmounts,
    selectedOuterNumbers,
    selectedOuterNumbersAmounts,
  ]);

  const handleMainNumbers = (e, number) => {
    if (auth_token) {
      const isSelected = selectedMainNumbers.includes(number);
      const numberIndex = selectedMainNumbers.indexOf(number);

      if (isSelected) {
        setSelectedMainNumbers(selectedMainNumbers.filter((n) => n !== number));
        setSelectedMainNumbersAmounts(
          selectedMainNumbersAmounts.filter((_, index) => index !== numberIndex)
        );
      } else {
        setSelectedMainNumbers([...selectedMainNumbers, number]);
        setSelectedMainNumbersAmounts([...selectedMainNumbersAmounts, ""]);
      }
    }
    else {
      navigate('/login');
    }

  };

  const handleInnerNumbers = (e, number) => {
    if (auth_token) {
      const isSelected = selectedInnerNumbers.includes(number);
      const numberIndex = selectedInnerNumbers.indexOf(number);

      if (isSelected) {
        setSelectedInnerNumbers(selectedInnerNumbers.filter((n) => n !== number));
        setSelectedInnerNumbersAmounts(
          selectedInnerNumbersAmounts.filter((_, index) => index !== numberIndex)
        );
      } else {
        setSelectedInnerNumbers([...selectedInnerNumbers, number]);
        setSelectedInnerNumbersAmounts([...selectedInnerNumbersAmounts, ""]);
      }
    }
    else {
      navigate('/login');
    }
  };

  const handleOuterNumbers = (e, number) => {
    if (auth_token) {
      const isSelected = selectedOuterNumbers.includes(number);
      const numberIndex = selectedInnerNumbers.indexOf(number);

      if (isSelected) {
        setSelectedOuterNumbers(selectedOuterNumbers.filter((n) => n !== number));
        setSelectedOuterNumbersAmounts(
          selectedOuterNumbersAmounts.filter((_, index) => index !== numberIndex)
        );
      } else {
        setSelectedOuterNumbers([...selectedOuterNumbers, number]);
        setSelectedOuterNumbersAmounts([...selectedOuterNumbersAmounts, ""]);
      }
    }
    else {
      navigate('/login');
    }
  };

  const handleAmountChange = (e, index) => {
    const amounts = [...selectedMainNumbersAmounts];
    amounts[index] = e.target.value;
    setSelectedMainNumbersAmounts(amounts);
  };

  const handleInnerAmountChange = (e, index) => {
    const amounts = [...selectedInnerNumbersAmounts];
    amounts[index] = e.target.value;
    setSelectedInnerNumbersAmounts(amounts);
  };

  const handleOuterAmountChange = (e, index) => {
    const amounts = [...selectedOuterNumbersAmounts];
    amounts[index] = e.target.value;
    setSelectedOuterNumbersAmounts(amounts);
  };

  // useEffect(() => {
  //   axios.get("api/todayActiveEvents").then((res) => {
  //     if (res.data.status === 200) {
  //       setEvents(res.data.event_id);
  //       setCurrentTime(res.data.currentTime1);
  //       setEventTime(res.data.time);

  //       var currentTime = new Date("2000-01-01T" + res.data.currentTime1 + "Z");
  //       var eventTime = new Date("2000-01-01T" + res.data.time + "Z");
  //       var timeDifference = new Date(currentTime - eventTime);
  //       // Calculate the total number of minutes and seconds in the time difference
  //       var totalMinutes = timeDifference.getUTCMinutes();
  //       var totalSeconds = timeDifference.getUTCSeconds();
  //       var difference =
  //         totalMinutes + ":" + totalSeconds.toString().padStart(2, "0");

  //       var time1 = "60:00";
  //       var time2 = difference;
  //       var [hours1, minutes1] = time1.split(":").map(Number);
  //       var [hours2, minutes2] = time2.split(":").map(Number);
  //       var totalMinutes1 = hours1 * 60 + minutes1;
  //       var totalMinutes2 = hours2 * 60 + minutes2;
  //       var differenceMinutes = totalMinutes1 - totalMinutes2;
  //       var differenceHours = Math.floor(differenceMinutes / 60);
  //       var differenceRemainingMinutes = differenceMinutes % 60;
  //       var difference1 =
  //         differenceHours.toString().padStart(2, "0") +
  //         ":" +
  //         differenceRemainingMinutes.toString().padStart(2, "0");
  //       // console.log("kuch bhi");
  //       // console.log(difference1);
  //       setTimeDifference(difference1);

  //       const timeString = difference1;
  //       const [minutes, seconds] = timeString.split(":").map(Number);
  //       const totalSeconds1 = minutes * 60 + seconds;
  //       setUpdatedEventTime2(totalSeconds1);
  //     } else {
  //       console.log("Events not found");
  //     }
  //   });
  // }, [events]);

  const autoRefreshTimer = useRef(null);
  const fetchActiveEvents = () => {
    try {
      axios.get("api/todayActiveEvents").then((res) => {
        if (res.data.status === 200) {
          setEvents(res.data.event_id);
          setCurrentTime(res.data.currentTime1);
          setEventTime(res.data.time);

          var currentTime = new Date("2000-01-01T" + res.data.currentTime1 + "Z");
          var eventTime = new Date("2000-01-01T" + res.data.time + "Z");
          var timeDifference = new Date(currentTime - eventTime);
          // Calculate the total number of minutes and seconds in the time difference
          var totalMinutes = timeDifference.getUTCMinutes();
          var totalSeconds = timeDifference.getUTCSeconds();
          var difference =
            totalMinutes + ":" + totalSeconds.toString().padStart(2, "0");

          var time1 = "60:00";
          var time2 = difference;
          var [hours1, minutes1] = time1.split(":").map(Number);
          var [hours2, minutes2] = time2.split(":").map(Number);
          var totalMinutes1 = hours1 * 60 + minutes1;
          var totalMinutes2 = hours2 * 60 + minutes2;
          var differenceMinutes = totalMinutes1 - totalMinutes2;
          var differenceHours = Math.floor(differenceMinutes / 60);
          var differenceRemainingMinutes = differenceMinutes % 60;
          var difference1 =
            differenceHours.toString().padStart(2, "0") +
            ":" +
            differenceRemainingMinutes.toString().padStart(2, "0");

          // console.log("kuch bhi");
          // console.log(difference1);
          setTimeDifference(difference1);

          const timeString = difference1;
          const [minutes, seconds] = timeString.split(":").map(Number);
          const totalSeconds1 = minutes * 60 + seconds;
          setUpdatedEventTime2(totalSeconds1);
        } else {
          console.log("Events not found");
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  const [indianTime, setIndianTime] = useState("");

  const fetchCurrentIndianTime = () => {
    try {
      axios.get("api/current-indian-time").then((res) => {
        if (res.data.status === 200) {
          setIndianTime(res.data.current_indian_time);
        } else {
          console.log("time not found");
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }


  //Function to start auto-refresh
  // const startAutoRefresh = () => {
  //   autoRefreshTimer.current = setInterval(fetchActiveEvents, 3000); // 5 seconds
  // }

  // // Function to stop auto-refresh
  // const stopAutoRefresh = () => {
  //   clearInterval(autoRefreshTimer.current);
  // }

  // useEffect(() => {
  //   // Initial fetch
  //   //fetchActiveEvents();
  //   // Start auto-refresh when the component mounts
  //   startAutoRefresh();
  //   // Clean up the interval when the component unmounts
  //   return () => stopAutoRefresh();
  // }, []);



  //Function to handle the auto-refresh
  const handleAutoRefresh = () => {
    fetchActiveEvents();
    fetchCurrentIndianTime();
    //fetchPreviousNumbers();
  };

  //Set up the auto-refresh effect using useEffect
  useEffect(() => {
    // Call the fetchData function immediately when the component mounts
    fetchActiveEvents();
    fetchCurrentIndianTime();
    // fetchPreviousNumbers();

    // Set up the interval for auto-refresh (e.g., every 5 seconds)
    const intervalId = setInterval(handleAutoRefresh, 5000);

    // Clean up the interval when the component unmounts to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [events]);

  const handleAmountKeyPress = (e) => {
    const allowedCharacters = /^[0-9\b]+$/; // Regular expression to allow only digits (0-9) and backspace (\b)
    if (!allowedCharacters.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputValidation = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    e.target.value = sanitizedValue;

    const minValue = 0; // Define your desired minimum value
    const maxValue = Number.MAX_SAFE_INTEGER; // Define your desired maximum value
    const currentValue = parseFloat(sanitizedValue);

    if (currentValue < minValue || currentValue > maxValue) {
      e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
    }
  };

  // const handleInputValidation = (e) => {
  //   const minValue = 0; // Define your desired minimum value
  //   const maxValue = Number.MAX_SAFE_INTEGER; // Define your desired maximum value
  //   const currentValue = parseFloat(e.target.value);

  //   //if (currentValue < minValue || currentValue > maxValue) {
  //   if (currentValue < minValue) {
  //     e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
  //   }
  // };

  useEffect(() => {
    // fetch_all_data();
    setloading(false);
  }, []);

  const [main, setMainList] = useState([]);
  const [inner, setInnerList] = useState([]);
  const [outer, setOuterList] = useState([]);

  // const fetchPreviousNumbers = () => {
  //   try {
  //     const user_id = localStorage.getItem("user_id");

  //     //axios.get(`api/mainNumber/fetch/${event_id}/${user_name}`)
  //     axios
  //       .get("api/mainNumber/fetch/" + events + "/" + user_id)
  //       .then((res) => {
  //         if (res.data.status === 200) {
  //           setMainList(res.data.main);
  //           setInnerList(res.data.inner);
  //           setOuterList(res.data.outer);
  //         } else {
  //           console.log("no numbers");
  //         }
  //       })
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }


  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    //axios.get(`api/mainNumber/fetch/${event_id}/${user_name}`)
    axios
      .get("api/mainNumber/fetch/" + events + "/" + user_id)
      .then((res) => {
        if (res.data.status === 200) {
          setMainList(res.data.main);
          setInnerList(res.data.inner);
          setOuterList(res.data.outer);
        } else {
          console.log("no numbers");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [events]);

  const [payment, setPayment] = useState(
    localStorage.getItem("payment") || null
  );

  const payNow = async (e, grandtotal) => {

    // Check if any amount field is empty
    if (
      selectedMainNumbersAmounts.some((amount) => amount === "") ||
      selectedInnerNumbersAmounts.some((amount) => amount === "") ||
      selectedOuterNumbersAmounts.some((amount) => amount === "")
    ) {
      // Show alert message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in the amount for all selected numbers.",
      });
      return; // Prevent further execution of the payNow function
    }

    var total = calculateTotalSum();
    const data = {
      mainNumbers: selectedMainNumbers,
      mainAmount: selectedMainNumbersAmounts,
      innerNumbers: selectedInnerNumbers,
      innerAmount: selectedInnerNumbersAmounts,
      outerNumbers: selectedOuterNumbers,
      outerAmount: selectedOuterNumbersAmounts,
      event_id: events,
      timeDifference: timeDifference,
      active_event_time: eventsTime,
      user_id: localStorage.getItem("user_id"),
      grandtotal: total,
    };

    try {
      await axios.post(`/api/user/wallet/decrease`, data).then(async (res) => {
        if (res.data.status === 200) {
          await axios.get("api/fetchWalletBalance").then((res) => {
            if (res.data.status === 200) {
              //console.log(res.data.amount);
              setWalletAmount(res.data.amount);
              //setWalletBalance(res.data.amount);
              localStorage.setItem("wallet", res.data.amount);

              // Hide the div with id "sel_num_pay"
              const selNumPayDiv = document.getElementById("sel_num_pay");
              if (selNumPayDiv) {
                selNumPayDiv.style.visibility = "hidden";
              }
            } else {
              console.log("Wallet balance not found");
            }
          });

          setPayment(res.data.payment);
          localStorage.setItem("selectedMainNumbers", []);
          localStorage.setItem("selectedMainNumbersAmounts", []);
          localStorage.setItem("selectedInnerNumbers", []);
          localStorage.setItem("selectedInnerNumbersAmounts", []);
          localStorage.setItem("selectedOuterNumbers", []);
          localStorage.setItem("selectedOuterNumbersAmounts", []);
          // localStorage.setItem('selectedMainNumbers', []);
          Swal.fire({
            position: "center",
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          })
          // .then(() => {
          //   // Refresh the page after the Swal success message is shown
          //   window.location.reload();
          // });

          const selectedElements = document.querySelectorAll(".card.btn.selected");
          selectedElements.forEach((element) => {
            element.classList.remove("selected");
          });

          // Refresh the page after a short delay (100ms)
          setTimeout(() => {
            window.location.reload();
          }, 100);


          // Update main array values to 0
          // const updatedMain = main.map(item => ({ ...item, number: 0, prize: 0 }));

          // // Update the state or variable containing main array with the updated values
          // setMainList(updatedMain);

          // forceUpdate();

          //  callback({ ...paymentStatus, status: true, price: grandtotal });
          // return true;
        }
        else {
          const topMessageElement = document.getElementById("topMessage");
          const messageTextElement = document.getElementById("messageText");
          const navigateButton = document.getElementById("navigateButton");

          if (topMessageElement && messageTextElement && navigateButton) {
            messageTextElement.textContent = res.data.message; // Set the message content
            navigateButton.style.display = "block"; // Show the button

            navigateButton.addEventListener("click", () => {
              // Add navigation logic here
              navigate('/payment'); // Replace with the actual URL of the payment page
            });

            topMessageElement.style.display = "block"; // Show the message element

            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' }); // You can adjust the behavior as needed

          }
        }

        // else {
        //   const topMessageElement = document.getElementById("topMessage");
        //   if (topMessageElement) {
        //     topMessageElement.textContent = res.data.message; // Set the message content
        //     topMessageElement.style.display = "block"; // Show the message element
        //   }
        // }

        // else {y
        //   Swal.fire({
        //     // icon: "error",
        //     // title: "Oops...",
        //     text: res.data.message,
        //   });
        // }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [time, setTime] = useState(60 * 60);

  useEffect(() => {
    if (updatedEventsTime2) {
      setTime(updatedEventsTime2);
    }
  }, [updatedEventsTime2]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);



  // useEffect(() => {
  //   if (formatTime(time) <= "44:00") {
  //     localStorage.setItem("selectedMainNumbers", []);
  //     localStorage.setItem("selectedMainNumbersAmounts", []);
  //     localStorage.setItem("selectedInnerNumbers", []);
  //     localStorage.setItem("selectedInnerNumbersAmounts", []);
  //     localStorage.setItem("selectedOuterNumbers", []);
  //     localStorage.setItem("selectedOuterNumbersAmounts", []);
  //   } else {

  //   }

  // }, [time]);


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (formatTime(time) == "00:01") {
      window.location.reload();
      localStorage.setItem("selectedMainNumbers", []);
      localStorage.setItem("selectedMainNumbersAmounts", []);
      localStorage.setItem("selectedInnerNumbers", []);
      localStorage.setItem("selectedInnerNumbersAmounts", []);
      localStorage.setItem("selectedOuterNumbers", []);
      localStorage.setItem("selectedOuterNumbersAmounts", []);
    }
  }, [time]);


  useEffect(() => {
    const divElement = document.getElementById("countdownDiv");
    const divElement2 = document.getElementById("timerBlock");
    const divElement3 = document.getElementById("countdownDiv1");
    const divElement4 = document.getElementById("timerBlock1");
    const divElement5 = document.getElementById("countdownDiv2");
    const divElement6 = document.getElementById("timerBlock2");
    const divElement7 = document.getElementById("sel_num_pay");
    const divElement8 = document.getElementById("block1");
    const divElement9 = document.getElementById("block2");
    const divElement10 = document.getElementById("block3");
    if (divElement) {
      if (formatTime(time) <= "10:00") {
        divElement.classList.add("disabledd");
        divElement2.style.display = "block";
        divElement3.classList.add("disabledd");
        divElement4.style.display = "block";
        divElement5.classList.add("disabledd");
        divElement6.style.display = "block";
        divElement7.style.display = "none";
        divElement8.style.display = "block";
        divElement9.style.display = "block";
        divElement10.style.display = "block";
      } else {
        divElement.classList.remove("disabledd");
        divElement2.style.display = "none";
        divElement3.classList.remove("disabledd");
        divElement4.style.display = "none";
        divElement5.classList.remove("disabledd");
        divElement6.style.display = "none";
        divElement7.style.display = "block";
        divElement8.style.display = "none";
        divElement9.style.display = "none";
        divElement10.style.display = "none";
      }
    }
  }, [time]);


  const [currentTime, setCrrentTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCrrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const timee = new Date(currentTime);
  const hours = timee.getHours() > 12 ? timee.getHours() - 12 : timee.getHours();
  const minutes = timee.getMinutes();
  const seconds = timee.getSeconds();
  const ampm = timee.getHours() >= 12 ? 'PM' : 'AM';



  // const [currentTime, setCrrentTime] = useState(Date.now());

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCrrentTime(Date.now());
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  // const hours = new Date(currentTime).getHours();
  // const minutes = new Date(currentTime).getMinutes();
  // const seconds = new Date(currentTime).getSeconds();

  //end countdown clock

  //reset countdown
  const handleReset = () => {
    setTime(50 * 60);
  };

  //end reset countdown

  //return <div>{formatTime(time)}</div>;

  //show Selected numbers
  const [data, setdata] = useState({
    main: [],
    inner: [],
    outer: [],
    event: [],
  });
  const fetchdata = async () => {
    try {
      axios.get(`/api/mynumber/fetch`).then((res) => {
        //console.log(res);
        setdata({
          ...data,
          main: res.data.main,
          inner: res.data.inner,
          outer: res.data.outer,
          event: res.data.event,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   fetchdata();
  // }, []);

  //end selected numbers

  const [date, setdate] = useState(new Date());
  const SingleMainkey = useRef(0);
  const del = useRef(0);
  const [loading, setloading] = useState(true);
  const gameName = useRef(null);
  const innerTarget = useRef(null);
  const outerTarget = useRef(null);
  const [state, setState] = React.useState({ value: 10 });
  // preselect
  const maindb_data = useRef([]);
  const innerdb_data = useRef([]);
  const outerdb_data = useRef([]);

  // const { paymentStatus } = useOutletContext();
  // const { setcheckNumber_loading } = useOutletContext();
  const { paymentPrice } = useOutletContext();

  const EventsStatus = useRef(false);
  const eventId = useRef(0);
  const eventHours = useRef(0);
  const eventMinutes = useRef(0);
  const eventSeconds = useRef(0);
  const eventYear = useRef(0);
  const eventMonths = useRef(0);
  const eventDate = useRef(0);
  // const useSelected_Event=useRef(0);

  //--------------------------- model box start------------------------------------

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mainTarget, setmainTarget] = useState();

  //----------------------------model box end---------------------------------------

  // forcefully re render
  function forceUpdate() {
    setState((prev) => {
      return { ...prev };
    });
  }

  // Calculate the total sum of the entered amounts
  const calculateTotalSum = () => {
    let totalSum = 0;

    // Calculate sum for selectedMainNumbers
    for (const number of selectedMainNumbers) {
      const inputField = document.getElementById(`main-amount-${number}`);
      if (inputField) {
        const amount = parseFloat(inputField.value);
        if (!isNaN(amount)) {
          totalSum += amount;
        }
      }
    }

    // Calculate sum for selectedInnerNumbers
    for (const number of selectedInnerNumbers) {
      const inputField = document.getElementById(`inner-amount-${number}`);
      if (inputField) {
        const amount = parseFloat(inputField.value);
        if (!isNaN(amount)) {
          totalSum += amount;
        }
      }
    }

    // Calculate sum for selectedOuterNumbers
    for (const number of selectedOuterNumbers) {
      const inputField = document.getElementById(`outer-amount-${number}`);
      if (inputField) {
        const amount = parseFloat(inputField.value);
        if (!isNaN(amount)) {
          totalSum += amount;
        }
      }
    }

    return totalSum;
  };

  var Grandtotal = 0;

  const lastIndex = currentPage * DataPerPage.current;
  const firstIndex = lastIndex - DataPerPage.current;

  const data1 = main.slice(firstIndex, lastIndex);
  const data2 = inner.slice(firstIndex, lastIndex);
  const data3 = outer.slice(firstIndex, lastIndex);

  function format12HourTime() {
    // const lastResultTime = data11[0].event_time;
    const lastResultTime = data11[data11.length - 1].event_time;

    const [lasthours, lastminutes] = lastResultTime.split(':');

    // Convert hours to a number
    const hoursNum = parseInt(lasthours);

    // Determine whether it's AM or PM
    const period = hoursNum >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hoursNum % 12 || 12;

    // Create the formatted time string
    const formattedTime = `${hours12}:${lastminutes} ${period}`;
    return formattedTime;
  }

  function addOneHour(time) {
    const [hours, minutes] = time.split(':');
    const hoursNum = parseInt(hours);
    const newHoursNum = (hoursNum + 1) % 24; // Adding 1 hour and accounting for rollover
    const period = newHoursNum >= 12 ? 'PM' : 'AM';
    const hours12 = newHoursNum % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  }

  function chekNegativeValue(time) {
    const containsSubstring = time.includes("-");
    if (containsSubstring) {
      // return "00:00";
      return <div className="loader">Loading...</div>;
    } else {
      return time;
    }
  }

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "40vh" }}>
        <button className="btn btn-dark" type="button" disabled>
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"></span>
          Loading...
        </button>
      </div>
    );
  } else {
    return (
      <div className="timer-sec game-timer-sec">
        <div className="circle_dot-left">
          <img
            src={process.env.PUBLIC_URL + "/image/circle_dot-left.png"}
            alt="circle_dot-left"
          />
        </div>
        <div className="circle_dot-right">
          <img
            src={process.env.PUBLIC_URL + "/image/circle_dot-right.png"}
            alt="circle_dot-right"
          />
        </div>
        <div className="login-right-bttom">
          <img
            src={process.env.PUBLIC_URL + "/image/login-right-bttom.png"}
            alt="login-right-bttom"
          />
        </div>
        {/* <Header callback={setpaymentStatus} paymentStatus={paymentStatus} setcheckNumber_loading={checkNumber_loading} walletBalance={walletBalance} /> */}

        {/* <div className="navigation-links" style={{display: "none"}}>
                    <button className='figmabtn wallet-btn'><img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />Rs. {walletBalance}</button>
                </div> */}
        {/* <Prize_Model_box show={show} handleClose={handleClose} handle_outerkey={handle_outerkey} handleShow={handleShow} handle_innerkey={handle_innerkey} SingleMainkey={SingleMainkey.current} gameName={gameName.current} hangle_main_key={hangle_main_key} eventId={eventId.current} /> */}
        {/* <Prize_Model_box show={show} handleClose={handleClose} handle_outerkey={handle_outerkey} handleShow={handleShow} handle_innerkey={handle_innerkey} SingleMainkey={SingleMainkey.current} gameName={gameName.current} hangle_main_key={hangle_main_key} eventId={events} /> */}

        {/* {events ==  ? 'loading' : events == false ? */}
        {events == "" ? (
          <div>No Event Found</div>
        ) : (
          <div className="container">
            <div id="topMessage" className="top-message">
              <p id="messageText"></p>
              <button id="navigateButton" style={{ 'display': 'none' }}>Add Money</button>
            </div>
            <div className="timer">
              <input type="hidden" name="active_event" value={events} />
              {/* <input type="hidden" name="active_event" value={fetchedDataRef.current.eventID || ""} /> */}
              <input type="hidden" name="currentTime" value={currentTime1} />
              {/* <input type="hidden" name="currentTime" value={fetchedDataRef.current.currentTime || ""} /> */}
              {/* <input type="hidden" name="timeDifference" value={fetchedDataRef.current.setTimeDifference || ""} /> */}
              <input type="hidden" name="timeDifference" value={timeDifference} />
              {/* <input type="hidden" name="active_event_time" value={fetchedDataRef.current.eventTime || ""} /> */}
              <input
                type="hidden"
                name="active_event_time"
                value={eventsTime}
              />
              <input type="hidden" name="updated_event_time" value={updatedEventsTime} />
              <input type="hidden" name="updated_event_time1" value={updatedEventsTime1} />

              <h3 className="mobile-hide">Last Result is:</h3>


              {/* <h3 className="mobile-hide">Last Result is:
                {
                  data11?.length > 0 && (
                    <div>
                      <h4>{data11[0].result}</h4>
                      <p className='event-time'>
                        {format12HourTime(data11[0].event_time)}
                      </p>
                    </div>
                  )
                }
              </h3> */}
              <h3 className="mobile-show">Choose your lucky number</h3>
              {
                data11?.length > 0 && (
                  <div className="winner_result-time">
                    <h4>{data11[data11.length - 1].result}</h4>
                    <p className='event-time'>
                      {format12HourTime(data11[data11.length - 1].event_time)} to {addOneHour(data11[data11.length - 1].event_time)}
                    </p>
                  </div>
                )
              }

              <div className="time_flex-right">
                {/* <button className="figmabtn wallet-btn">
                  {" "}
                  Pick any numbers
                </button> */}
                <div className="timer_heading-time">
                  <h2>Time</h2>

                  {time < 0 ? (
                    <button className="figmabtn wallet-btn">00:00</button>
                  ) : (
                    <button className="figmabtn wallet-btn" style={{ 'display': 'none' }}>
                      {formatTime(time)}
                    </button>
                  )}
                </div>

                <div>
                  <button className="figmabtn wallet-btn">{indianTime}
                    {/* {`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`} */}
                  </button>
                </div>

                {/* <div>
                  <button className="figmabtn wallet-btn">
                    {`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
                  </button>
                </div> */}

              </div>
              <div className="dice_img-center">
                <img
                  src={process.env.PUBLIC_URL + "/image/pngwing.png"}
                  alt="pngwing"
                />
              </div>
              {/* <button className='figmabtn wallet-btn'>{formatTime(time)}</button> */}
              {/* <button onClick={handleReset}>Reset</button> */}
            </div>

            <div className="row show_result_seclive">
              {/* <marquee behavior="scroll" direction="left" scrollamount="5"> */}
              <div className="scroll-container">
                {data11?.map((e, i) => {
                  var event_time = e.event_time;
                  var event_time_parts = event_time.split(":");
                  var hours = parseInt(event_time_parts[0]);
                  var minutes = parseInt(event_time_parts[1]);

                  var period = hours >= 12 ? "PM" : "AM";

                  if (hours > 12) {
                    hours -= 12;
                  } else if (hours === 0) {
                    hours = 12;
                  }

                  var formatted_event_time = `${hours}:${event_time_parts[1]} ${period}`;

                  var hours1 = hours + 1;
                  var period1 = period;

                  if (hours1 === 12) {
                    if (period1 === "AM") {
                      period1 = "PM";
                    } else {
                      period1 = "AM";
                    }
                  }

                  if (hours1 === 13) {
                    hours1 = 1;
                  }

                  var formatted_new_event_time = `${hours1.toString().padStart(2, "0")}:${event_time_parts[1]} ${period1}`;
                  var event_date = new Date(e.current_date);
                  const options = {
                    timeZone: 'Asia/Kolkata',
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  };
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 live-resultToday-container" key={i}>
                      <div className="card_live-result ">
                        <div className='result_live'>
                          <h4>{e.result}</h4>
                        </div>
                        <div className="scroll-inner-content">
                          {/* <h6 className="winning-numbers" >Winning numbers</h6>
                          <p className="normal-text">Draw took place on</p> */}
                          {/* <b className='event-text'>{event_date.toDateString() + ' ' + event_date.toLocaleTimeString()}</b> */}
                          <b className='event-text'>{event_date.toLocaleDateString('en-IN', options)}</b>
                          <p className='event-time'>({formatted_event_time} to {formatted_new_event_time})</p>
                        </div>
                      </div>
                    </div>

                  )
                })
                }
              </div>
              {/* </marquee> */}
              {/* <div className="col-md-12 text-center mt-3">
                {dataa.showAllButton && (
                  <button className='viewAllbtn' onClick={viewAllbtn}>
                    View All Result
                  </button>
                )}
                {dataa.showLessButton && (
                  <button className='viewAllbtn viewLessbtn' onClick={viewLessbtn}>
                    View Less Result
                  </button>
                )}
              </div> */}
            </div>

            <div className="row">
              <div className="col-lg-9 col-md-12">
                <div className="game-left-sec">
                  <div className="counter_disable-num" id="block1">

                    <button className="clockdownTimer" id="timerBlock" style={{ 'display': 'none' }}>
                      {chekNegativeValue(formatTime(time))}
                    </button>
                  </div>
                  <div id="countdownDiv" className="main_num">

                    {[...Array(100)].map((n, i) => {
                      i += 0;
                      return (
                        <div
                          key={i}
                          data-main={`${i}`}
                          className={`card btn payment_check zoom pointer ${selectedMainNumbers.includes(i) ? "selected" : ""
                            }`}
                          // style={{
                          //     width: "7rem",
                          //     textAlign: "center",
                          //     backgroundColor:
                          //         payment === 1 ? "white" : selectedMainNumbers.includes(i) ? "green" : "",
                          // }}

                          // style={{
                          //     width: '7rem',
                          //     textAlign: 'center',
                          //     backgroundColor: selectedMainNumbers.includes(i) ? 'green' : ''
                          // }}
                          onClick={(e) => handleMainNumbers(e, i)}>
                          <h5 className="card-title">{i < 10 ? `0${i}` : i}</h5>
                        </div>

                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="game-left-sec">
                    <div className="counter_disable-num" id="block2">
                      <button className="clockdownTimer" id="timerBlock1" style={{ 'display': 'none' }}>
                        {/* {formatTime(time)} */}
                        {chekNegativeValue(formatTime(time))}
                      </button>
                    </div>
                    <div id="countdownDiv1" className="main_num">
                      <h3 className="underline text-center mb-3">Andar</h3>
                      {[...Array(10)].map((n, i) => {
                        i += 0;
                        return (
                          <div
                            key={i}
                            data-inner={`${i}`}
                            className={`card btn payment_check zoom pointer ${selectedInnerNumbers.includes(i) ? "selected" : ""
                              }`}
                            // style={{
                            //     width: "7rem",
                            //     textAlign: "center",
                            //     backgroundColor:
                            //         payment === 1 ? "white" : selectedInnerNumbers.includes(i) ? "green" : "",
                            // }}
                            // style={{
                            //     width: '7rem',
                            //     textAlign: 'center',
                            //     backgroundColor: selectedInnerNumbers.includes(i) ? 'green' : ''
                            // }}
                            onClick={(e) => handleInnerNumbers(e, i)}>
                            <h5 className="card-title ">{i}</h5>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="game-left-sec">
                    {/* <div className={isTimeUp ? "main_num disabled" : "main_num"}> */}

                    <div className="counter_disable-num" id="block3">
                      <button className="clockdownTimer" id="timerBlock2" style={{ 'display': 'none' }}>
                        {/* {formatTime(time)} */}
                        {chekNegativeValue(formatTime(time))}
                      </button>
                    </div>

                    <div id="countdownDiv2" className="main_num">
                      <h3 className="underline text-center mb-3">Bahar</h3>
                      {[...Array(10)].map((n, i) => {
                        i += 0;
                        return (
                          <div
                            key={i}
                            data-outer={`${i}`}
                            className={`card btn payment_check zoom pointer ${selectedOuterNumbers.includes(i) ? "selected" : ""
                              }`}
                            style={{
                              width: "7rem",
                              textAlign: "center",
                              backgroundColor:
                                payment === 1
                                  ? "white"
                                  : selectedOuterNumbers.includes(i)
                                    ? "green"
                                    : "",
                            }}
                            onClick={(e) => handleOuterNumbers(e, i)}>
                            <h5 className="card-title">{i}</h5>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="game-right-sec">
                  <div className="game-right-sec-inner horizontal_table_new container">
                    <div className="row">
                      <h5>Selected Numbers</h5>
                      <div className="horizontal_table-col col-lg-4 col-md-4 col-sm-12">
                        <div className="table_border-horizontal">
                          <table>
                            <thead>
                              <tr>
                                <td className="sub-menu" colSpan={2}>
                                  Main Numbers
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Numbers</td>
                                <td>Amount</td>
                              </tr>

                              {data1.map((main, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{main.number}</td>
                                    <td>{main.total_price}</td>
                                  </tr>
                                )
                              })}


                              {/* {main?.map((main, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{main.number}</td>
                                    <td>{main.prize}</td>
                                  </tr>
                                );
                              })} */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="horizontal_table-col col-lg-4 col-md-4 col-sm-12">
                        <div className="table_border-horizontal">
                          <table>
                            <thead>
                              <tr>
                                <td className="sub-menu" colSpan={2}>
                                  Andar
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Numbers</td>
                                <td>Amount</td>
                              </tr>

                              {data2.map((main, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{main.number}</td>
                                    <td>{main.total_price}</td>
                                  </tr>
                                )
                              })}


                              {/* {inner?.map((inner, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{inner.number}</td>
                                    <td>{inner.price}</td>
                                  </tr>
                                );
                              })} */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="horizontal_table-col col-lg-4 col-md-4 col-sm-12">
                        <div className="table_border-horizontal">
                          <table>
                            <thead>
                              <tr>
                                <td className="sub-menu" colSpan={2}>
                                  Bahar
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Numbers</td>
                                <td>Amount</td>
                              </tr>

                              {data3.map((main, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{main.number}</td>
                                    <td>{main.total_price}</td>
                                  </tr>
                                )
                              })}

                              {/* {outer?.map((outer, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{outer.number}</td>
                                    <td>{outer.price}</td>
                                  </tr>
                                );
                              })} */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-12 game-right-sec" id="sel_num_pay">
                <div className="game-right-sec-inner">
                  {selectedMainNumbers.length > 0 && (
                    <div className="game-result_out" id="test1">
                      <table>
                        <thead>
                          <tr>
                            <td className="sub-menu" colSpan={2}>
                              Selected numbers
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="table_sub-title">Numbers</td>
                            <td className="table_sub-title">Amount</td>
                          </tr>

                          {payment !== 1 &&
                            selectedMainNumbers.map((number, index) => (
                              <tr key={number}>
                                <td>{number}</td>
                                <td>
                                  <span>
                                    Rs.
                                    <input
                                      type="tel"
                                      // pattern="[0-9]*"
                                      name={`main-amount-${number}`}
                                      id={`main-amount-${number}`}
                                      value={
                                        selectedMainNumbersAmounts[index] || ""
                                      }
                                      onChange={(e) =>
                                        handleAmountChange(e, index)
                                      }
                                      onKeyPress={(e) => handleAmountKeyPress(e)}
                                      onInput={(e) => handleInputValidation(e)}
                                    />
                                  </span>

                                  {/* Show error message if amount field is empty */}
                                  {/* {selectedMainNumbersAmounts[index] === "" && (
                                    <span style={{ color: "red" }}>Fill in the amount</span>
                                  )} */}

                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedInnerNumbers.length > 0 && (
                    <div className="game-result_out" id="test2">
                      <table>
                        <thead>
                          <tr>
                            <td className="sub-menu" colSpan={2}>
                              Andar
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="table_sub-title">Numbers</td>
                            <td className="table_sub-title">Amount</td>
                          </tr>

                          {payment !== 1 &&
                            selectedInnerNumbers.map((number, index) => (
                              <tr key={number}>
                                <td>{number}</td>
                                <td>
                                  <span>
                                    Rs.
                                    <input
                                      type="tel"
                                      // type="number"
                                      name={`inner-amount-${number}`}
                                      id={`inner-amount-${number}`}
                                      value={
                                        selectedInnerNumbersAmounts[index] || ""
                                      }
                                      onChange={(e) =>
                                        handleInnerAmountChange(e, index)
                                      }
                                      onKeyPress={(e) => handleAmountKeyPress(e)}
                                      onInput={(e) => handleInputValidation(e)}
                                    />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedOuterNumbers.length > 0 && (
                    <div className="game-result_out" id="test3">
                      <table>
                        <thead>
                          <tr>
                            <td className="sub-menu" colSpan={2}>
                              Bahar
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="table_sub-title">Numbers</td>
                            <td className="table_sub-title">Amount</td>
                          </tr>

                          {payment !== 1 &&
                            selectedOuterNumbers.map((number, index) => (
                              <tr key={number}>
                                <td>{number}</td>
                                <td>
                                  <span>
                                    Rs.
                                    <input
                                      type="tel"
                                      // type="number"
                                      name={`outer-amount-${number}`}
                                      id={`outer-amount-${number}`}
                                      value={
                                        selectedOuterNumbersAmounts[index] || ""
                                      }
                                      onChange={(e) =>
                                        handleOuterAmountChange(e, index)
                                      }
                                      onKeyPress={(e) => handleAmountKeyPress(e)}
                                      onInput={(e) => handleInputValidation(e)}
                                    />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {(selectedMainNumbers.length > 0 ||
                    selectedInnerNumbers.length > 0 ||
                    selectedOuterNumbers.length > 0) && (
                      <div className="game-result_out" id="test4">
                        <table className="total-prize-table">
                          <thead>
                            <tr>
                              <td className="sub-menu" colSpan={2}>
                                Total
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="total_prize-td">Total Amount</td>
                              {/* <td>{calculateTotalSum()}</td> */}
                              <td className="total_prize-td">
                                {Math.abs(calculateTotalSum())}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>

                {(selectedMainNumbers.length > 0 ||
                  selectedInnerNumbers.length > 0 ||
                  selectedOuterNumbers.length > 0) && (
                    <div className="game-right-btn" id="test5">
                      <input
                        type="hidden"
                        value={(Grandtotal = calculateTotalSum())}
                      />
                      <div className="navigation-links">
                        <button
                          id="payNowButton"
                          className={
                            Grandtotal != 0
                              ? "figmabtn wallet-btn btn btn-success"
                              : "btn btn-success"
                            //: "btn btn-success disabled"
                          }
                          onClick={payNow}>
                          <img
                            src={process.env.PUBLIC_URL + "/image/wallet-icon.svg"}
                            alt=""
                          />
                          Pay now
                        </button>
                      </div>
                    </div>
                  )}
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }
}
export default Game;

