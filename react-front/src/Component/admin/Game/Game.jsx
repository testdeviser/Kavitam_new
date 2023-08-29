

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Datatable from 'react-data-table-component';

function Game(props) {
    const ref = useRef(null);

    const [events, setEvents] = useState();
    const navigate = useNavigate();
    const [mainData, setMainData] = useState([]);
    const [innerData, setInnerData] = useState([]);
    const [outerData, setOuterData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const DataPerPage = useRef(10);

    const [currentTime1, setCurrentTime] = useState([]);
    const [eventsTime, setEventTime] = useState([]);
    const [updatedEventsTime2, setUpdatedEventTime2] = useState([]);
    const [finalNum, setFinalNum] = useState('');

    const [data, setdata] = useState([]);
    const [result, setresult] = useState({
        number: 0,
        forceUpdate: '',
    });

    const [timerEnded, setTimerEnded] = useState(false);


    const fetchData = () => {
        axios.get("api/todayActiveEvents")
            .then((res) => {
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

                    const timeString = difference1;
                    const [minutes, seconds] = timeString.split(":").map(Number);
                    const totalSeconds1 = minutes * 60 + seconds;
                    setUpdatedEventTime2(totalSeconds1);

                    // const originalEventTime = moment(res.data.time, 'HH:mm:ss');
                    // console.log(originalEventTime);
                    // const updatedEventTime = originalEventTime.add(50, 'minutes');
                    // setUpdatedEventTime(updatedEventTime.format('HH:mm:ss'));
                    // const updatedEventTime1 = originalEventTime.add(10, 'minutes');
                    // setUpdatedEventTime1(updatedEventTime1.format('HH:mm:ss'));
                } else {
                    console.log("Events not found");
                }
            })
            .catch((error) => {
                console.error(error);
            });

        //axios.get("api/fetch/finalNumber/" + events + "/" + currentTime1 + "/" + eventsTime).then(res => {
        axios.get("api/fetch/finalNumber/" + events + "/" + eventsTime).then(res => {
            if (res.data.status === 200) {
                //console.log(res.data.event_result_num);
                setFinalNum(res.data.event_result_num.result);
                setresult({ ...result, number: res.data.event_result_num.result });
            }
        }).catch((error) => {
            console.error(error);
        });


        //if (events.length > 0) {
        axios.get("api/admin/Numbers/fetch/" + events)
            .then(res => {
                if (res.data.status === 200) {
                    setMainData(res.data.main);
                    setInnerData(res.data.ander);
                    setOuterData(res.data.bahar);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        //}
    };

    const columns = [
        {
            name: "Number",
            selector: (row) => row.referred_to_userid,
        },
        {
            name: "Prize",
            selector: (row) => row.amount
        },
    ];

    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => {
            clearInterval(interval); // Clean up the interval on component unmount
        };
    }, [events]);

    const deleteMain = async (e, id) => {
        var target = e.currentTarget;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/admin/main/delete/${id}`)
                    .then(res => {
                        console.log(res);
                        if (res.data.status === 200) {
                            Swal.fire(
                                'Removed!',
                                'Your Number has been Removed.',
                                'success'
                            )
                            target.closest('tr').remove();
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const Result_Annoucement = () => {
        // e.preventDefault();
        const data = {
            event: events,
            number: result.number,
            eventsTime: eventsTime,
        }

        console.log(data);
        axios.post(`/api/annouce_result`, data).then(res => {
            if (res.data.status == 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message,
                })
            }

        });
    }

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
        const maxValue = 99; // Define your desired maximum value
        const currentValue = parseFloat(e.target.value);

        //if (currentValue < minValue || currentValue > maxValue) {
        if (currentValue < minValue && currentValue > maxValue) {
            e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
        }
    };


    // const handleInputValidation = (e) => {
    //     const minValue = 0; // Define your desired minimum value
    //     const maxValue = 99; // Define your desired maximum value
    //     const currentValue = parseFloat(e.target.value);

    //     //if (currentValue < minValue || currentValue > maxValue) {
    //     if (currentValue < minValue && currentValue > maxValue) {
    //         e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
    //     }
    // };


    const lastIndex = currentPage * DataPerPage.current;
    const firstIndex = lastIndex - DataPerPage.current;

    const data1 = mainData.slice(firstIndex, lastIndex);
    const data2 = innerData.slice(firstIndex, lastIndex);
    const data3 = outerData.slice(firstIndex, lastIndex);

    return (
        <div style={{ marginLeft: "40px", margin: "0px auto" }}>
            <input type="hidden" name="active_event" value={events} />
            <input type="hidden" name="currentTime" value={currentTime1} />
            <input type="hidden" name="finalNum" value={finalNum} />
            <input
                type="hidden"
                name="active_event_time"
                value={eventsTime}
            />
            <div className="game_backend-timer define_float">
                <div className='result1'>
                    <form className="time_row">
                        <div className="col-auto backend_number-filed">

                            <input
                                type="tel"
                                className="form-control"
                                id="inputPassword2"
                                //value={result.number || ''}
                                // value={(mainData.length > 0 || innerData.length > 0 || outerData.length > 0) && formatTime(time) >= '00:00' ? result.number || '' : ''}
                                value={formatTime(time) >= '00:00' ? result.number || '' : ''}
                                onChange={(e) => {
                                    setFinalNum(e.target.value); // Update the finalNum state
                                    setresult({ ...result, number: e.target.value }); // Update the result state
                                }}
                                onKeyPress={(e) => handleAmountKeyPress(e)}
                                onInput={(e) => handleInputValidation(e)}
                                required
                                placeholder="Enter your Number"
                            />


                            <button type='button' className='btn btn-primary' onClick={(e) => { Result_Annoucement(e) }}>Final Number</button>

                        </div>

                    </form>

                </div>

                <div className="timer_heading-time">
                    <h2>Timer</h2>

                    {time < 0 ? (
                        <button className="figmabtn wallet-btn">00:00</button>
                    ) : (
                        <button className="figmabtn wallet-btn">
                            {formatTime(time)}
                        </button>
                    )}
                </div>
            </div>

            <div className="game_backend-main">
                <div className="game_backend-col">
                    <h3>Main Numbers</h3>
                    <table className="table bordered table-striped  table-hover mt-4">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th scope="col">Number</th>
                                <th scope="col">Prize</th>
                            </tr>
                        </thead>
                        <tbody className="text-center game_backend-scroll align-middle text-center">
                            {data1.map((main, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{main.number}</td>
                                        <td>{main.total_price}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="game_backend-col">
                    <h3>Andar</h3>
                    <table className="table bordered table-striped  table-hover mt-4">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th scope="col">Number</th>
                                <th scope="col">Prize</th>
                            </tr>
                        </thead>
                        <tbody className="text-center game_backend-scroll align-middle text-center">
                            {data2.map((main, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{main.number}</td>
                                        <td>{main.total_price}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="game_backend-col">
                    <h3>Bahar</h3>
                    <table className="table bordered table-striped  table-hover mt-4">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th scope="col">Number</th>
                                <th scope="col">Prize</th>
                            </tr>
                        </thead>
                        <tbody className="text-center game_backend-scroll align-middle text-center">
                            {data3.map((main, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{main.number}</td>
                                        <td>{main.total_price}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Game;
