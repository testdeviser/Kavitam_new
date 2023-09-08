import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import "../../../assets/front/css/LiveResultToday.css";

function LiveResultToday(props) {
    const navigate = useNavigate();

    const [data, setdata] = useState({
        event: [],
        no_of_result: 24,
        showAllButton: true,
        showLessButton: false
    });

    const [allEvents, setAllEvents] = useState([]);

    const fetch_events = () => {
        axios.get('/api/Result_today').then(res => {
            //console.log(res.data.event.event_time);
            setdata({ ...data, event: res.data.event });
        });
    }

    // const fetch_events = () => {
    //     axios.get('/api/ResultexceptLast').then(res => {
    //         //console.log(res.data.event.event_time);
    //         setdata({ ...data, event: res.data.event });
    //     });
    // }


    // const fetch_all_events = () => {
    //     axios.get('/api/fetch_all_events').then(res => {
    //         setAllEvents({ ...data, allEventResult: res.data.allEventResult });
    //     });
    // }

    useEffect(() => {
        fetch_events();

    }, []);

    // const viewAllbtn = (e) => {
    //     var length = data.event.length;
    //     var target = e.currentTarget;
    //     target.remove();
    //     setdata({ ...data, no_of_result: length });
    // }

    const viewAllbtn = () => {

        navigate('/allEventResults');
        //fetch_all_events();
        // const length = data.event.length;
        //setdata({ ...data, showAllButton: false, showLessButton: true });
    };

    const viewLessbtn = () => {
        setdata({ ...data, no_of_result: 24, showAllButton: true, showLessButton: false });
    };

    const data1 = data.event.slice(0, data.no_of_result);
    return (

        <React.Fragment>
            <div className="live_main-sec define_float">
                <div className="circle_dot-right">
                    <img src={process.env.PUBLIC_URL + '/image/circle_dot-right.png'} alt="circle_dot-right" />
                </div>
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-12">
                            <div className="live_result_sec define_float">
                                <h2>Today’s Live Result</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row show_result_seclive">
                        {data1?.map((e, i) => {
                            // var event_time = e.event_time;
                            // var event_time_parts = event_time.split(":"); // Splitting the time string into hours, minutes, and seconds
                            // var formatted_event_time = `${event_time_parts[0]}:${event_time_parts[1]}`; // Combining hours and minutes

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
                                        <h6 className="winning-numbers" >Winning numbers</h6>
                                        <div className='result_live'>
                                            <h4>{e.result}</h4>
                                        </div>
                                        {/* <p className="normal-text">Draw took place on</p> */}
                                        {/* <b className='event-text'>{event_date.toDateString() + ' ' + event_date.toLocaleTimeString()}</b> */}
                                        <b className='event-text'>{event_date.toLocaleDateString('en-IN', options)}</b>
                                        <p className='event-time'>({formatted_event_time} to {formatted_new_event_time})</p>
                                    </div>
                                </div>

                            )
                        })
                        }
                        {/* <div className="col-md-12 text-center mt-3">
                                <button className='viewAllbtn' onClick={viewAllbtn}>View All Result</button>
                                <button className='viewLessbtn'>View Less Result</button>
                            </div> */}

                        <div className="col-md-12 text-center mt-3">
                            {data.showAllButton && (
                                <button className='viewAllbtn' onClick={viewAllbtn}>
                                    View All Result
                                </button>
                            )}
                            {data.showLessButton && (
                                <button className='viewAllbtn viewLessbtn' onClick={viewLessbtn}>
                                    View Less Result
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default LiveResultToday;
