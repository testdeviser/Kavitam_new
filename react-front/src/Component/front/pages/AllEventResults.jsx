import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

function AllEventResults(props) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [resultByDate, setResultByDate] = useState({
        eventResult: [],
    });
    const [data, setdata] = useState({
        event: [],
        no_of_result: 17,
    });

    const fetch_events = () => {
        axios.get('/api/Result_today').then(res => {
            setdata({ ...data, event: res.data.event });
        });
    }

    const fetchResultByDate = (selectedDate) => {
        axios.get(`/api/Result_by_date/${selectedDate}`).then(res => {
            setResultByDate({ ...resultByDate, eventResult: res.data.event });
        });
    }

    useEffect(() => {
        fetch_events();
        const formattedDate = selectedDate.toISOString().substr(0, 10);
        fetchResultByDate(formattedDate);
    }, [selectedDate]);

    const data1 = data.event.slice(0, data.no_of_result);
    const eventResults = selectedDate.toISOString().substr(0, 10) === new Date().toISOString().substr(0, 10) ? data1 : resultByDate.eventResult;

    return (
        <React.Fragment>
            <div className="live_main-sec define_float">
                <div className="circle_dot-right">
                    <img src={process.env.PUBLIC_URL + '/image/circle_dot-right.png'} alt="circle_dot-right" />
                </div>
                <div className="container">
                    {/* <div className="row ">
                        <div className="col-lg-12">
                            <div className="live_result_sec define_float">
                                <h5 className='heading '>Numbers</h5>
                                <img className='white_dot_img' src={process.env.PUBLIC_URL + '/image/white-dot-lines.png'} alt="" width={218} height={18} />
                                <h2>Today’s Live Result</h2>
                            </div>
                        </div>
                    </div> */}
                <div className="fdg">
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        maxDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        //customInput={<CustomDatePickerInput />}
                    />
                    { <FaCalendarAlt className="calendar-icon" />}
</div>
                    <div className="row show_result_seclive">
                        {eventResults.map((e, i) => {
                            // var event_time = e.event_time;
                            // var event_time_parts = event_time.split(":");
                            // var formatted_event_time = `${event_time_parts[0]}:${event_time_parts[1]}`;

                            var event_time = e.event_time;
                            var event_time_parts = event_time.split(":"); // Splitting the time string into hours, minutes, and seconds
                            var hours = parseInt(event_time_parts[0]);
                            var minutes = parseInt(event_time_parts[1]);
                            // Determine AM or PM
                            var period = hours >= 12 ? "PM" : "AM";

                            // Convert to 12-hour format
                            if (hours > 12) {
                                hours -= 12;
                            } else if (hours === 0) {
                                hours = 12;
                            }

                            var formatted_event_time = `${hours}:${event_time_parts[1]} ${period}`; // Combining hours, minutes, and period

                            var hours1 = parseInt(formatted_event_time.split(':')[0]);
                            var period1 = formatted_event_time.split(' ')[1];

                            // Adding one hour
                            hours1 += 1;

                            // Handling the case where adding an hour results in 12 (noon)
                            if (hours1 === 12) {
                                if (period1 === 'AM') {
                                    period1 = 'PM'; // Change period from AM to PM
                                } else {
                                    period1 = 'AM'; // Change period from PM to AM
                                }
                            }

                            // Formatting the hours back into the "hh:mm AM/PM" format
                            if (hours1 === 12 || hours1 === 0) {
                                hours1 = 12; // Display 12 instead of 0 or 12 for noon/midnight
                            }

                            var formatted_new_event_time = `${hours1.toString().padStart(2, '0')}:${event_time_parts[1]} ${period1}`;

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
                                        <h6 className="winning-numbers">Winning numbers</h6>
                                        <div className='result_live'>
                                            <h4>{e.result}</h4>
                                        </div>
                                        
                                        {/* <p className="normal-text">Draw took place on</p> */}
                                        <b className='event-text'>{event_date.toLocaleDateString('en-IN', options)}</b>
                                        <p className='event-time'>({formatted_event_time} to {formatted_new_event_time})</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const CustomDatePickerInput = ({ value, onClick }) => (
    <div className="custom-datepicker-input" onClick={onClick}>
        <FaCalendarAlt className="calendar-icon" onClick={onClick} /> {/* Calendar icon */}
        <span className="date-value">{value}</span>
    </div>
);


export default AllEventResults;
