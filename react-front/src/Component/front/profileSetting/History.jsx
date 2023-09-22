import React, { useEffect, useState } from 'react';
import axios from 'axios';

function History(props) {
    const [eventLoadingStates, setEventLoadingStates] = useState({});

    const [events, setEvents] = useState();
    const [userEvents, setUserEvents] = useState([]);
    const [userEventsWeekly, setUserEventsWeekly] = useState([]);
    const [userEventsMonthly, setUserEventsMonthly] = useState([]);
    const [userMainNumToday, setUserMainNumToday] = useState([]);
    const [userInnerNumToday, setInnerNumToday] = useState([]);
    const [userOuterNumToday, setOuterNumToday] = useState([]);

    const [userMainNumWeekly, setUserMainNumWeekly] = useState([]);
    const [userInnerNumWeekly, setInnerNumWeekly] = useState([]);
    const [userOuterNumWeekly, setOuterNumWeekly] = useState([]);

    const [userMainNumMonthly, setUserMainNumMonthly] = useState([]);
    const [userInnerNumMonthly, setInnerNumMonthly] = useState([]);
    const [userOuterNumMonthly, setOuterNumMonthly] = useState([]);

    const [showMonthlyData, setShowMonthlyData] = useState(false);
    const [showWeeklyData, setShowWeeklyData] = useState(false);
    const [showTodayData, setShowTodayData] = useState(false);

    const [activeButton, setActiveButton] = useState('today');

    useEffect(() => {
        axios.get('api/todayActiveEvents').then((res) => {
            if (res.data.status === 200) {
                setEvents(res.data.event_id);
            } else {
                console.log('Events not found');
            }
        });
    }, []);

    const fetchEventsUserPlayed = () => {
        const user_id = localStorage.getItem('user_id');
        try {
            axios.get('api/fetchEventsUserPlayed').then((res) => {
                //console.log(res.data.events);
                setUserEvents(res.data.events);
                setUserEventsWeekly(res.data.eventsWeekly);
                setUserEventsMonthly(res.data.eventsMonthly);
            }).catch(err => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchEventsUserPlayed();
    }, [events]);

    const handleClick = (eventId) => {
        setEventLoadingStates(prevStates => ({
            ...prevStates,
            [eventId]: true,
        }));

        axios.get('api/getEventData/' + eventId).then((res) => {
            if (res.data.status === 200) {
                setUserMainNumToday(res.data.mainToday);
                setInnerNumToday(res.data.innerToday);
                setOuterNumToday(res.data.outerToday);

                setUserMainNumWeekly(res.data.mainWeekly);
                setInnerNumWeekly(res.data.innerWeekly);
                setOuterNumWeekly(res.data.outerWeekly);

                setUserMainNumMonthly(res.data.mainMonthly);
                setInnerNumMonthly(res.data.innerMonthly);
                setOuterNumMonthly(res.data.outerMonthly);

                setUserEvents(prevUserEvents => {
                    return prevUserEvents.map(event => {
                        if (event.event_id === eventId) {
                            return { ...event, expanded: !event.expanded };
                        } else {
                            return { ...event, expanded: false }; // Close the previously expanded event
                        }
                    });
                });

                setUserEventsMonthly(prevUserEventsMonthly => {
                    return prevUserEventsMonthly.map(event => {
                        if (event.event_idMonthly === eventId) {
                            return { ...event, expanded: !event.expanded };
                        } else {
                            return { ...event, expanded: false }; // Close the previously expanded event
                        }
                    });
                });

                setUserEventsWeekly(prevUserEventsWeekly => {
                    return prevUserEventsWeekly.map(event => {
                        if (event.event_idWeekly === eventId) {
                            return { ...event, expanded: !event.expanded };
                        } else {
                            return { ...event, expanded: false }; // Close the previously expanded event
                        }
                    });
                });
            } else {
                console.log('no numbers');
            }

            // Set loading state to false after fetching data
            setEventLoadingStates(prevStates => ({
                ...prevStates,
                [eventId]: false,
            }));
        }).catch((err) => {
            console.log(err);

            // Set loading state to false after fetching data
            setEventLoadingStates(prevStates => ({
                ...prevStates,
                [eventId]: false,
            }));

        });
    };

    const handleMonthlyClick = () => {
        setActiveButton('monthly');
        setShowMonthlyData(true);
        setShowWeeklyData(false);
        setShowTodayData(false);
        fetchEventsUserPlayed();
    };

    const handleWeeklyClick = () => {
        setActiveButton('weekly');
        setShowMonthlyData(false);
        setShowWeeklyData(true);
        setShowTodayData(false);
        fetchEventsUserPlayed();
    };

    const handleTodayClick = () => {
        setActiveButton('today');
        setShowMonthlyData(false);
        setShowWeeklyData(false);
        setShowTodayData(true);
        fetchEventsUserPlayed();
    };

    return (
        <div className=' col-lg-8 col-md-12 col-sm-12'>
            <div className="history_ct-box define_float">
                <input type="hidden" name="active_event" value={events} />
                <div className="account_pg-flex  define_float">
                    <div className="account_pg-title">
                        <h2>History</h2>
                    </div>

                    <div className="monthly_btn-all">
                        <button className={`btn ${activeButton === 'monthly' ? 'active-btn-data' : ''}`} onClick={handleMonthlyClick}>Monthly</button>
                        <button className={`btn ${activeButton === 'weekly' ? 'active-btn-data' : ''}`} onClick={handleWeeklyClick}>Weekly</button>
                        <button className={`btn ${activeButton === 'today' ? 'active-btn-data' : ''}`} onClick={handleTodayClick}>Today</button>
                    </div>

                    {/* <div className="monthly_btn-all">
                            <button className='btn' onClick={handleMonthlyClick}>Monthly</button>
                            <button className='btn' onClick={handleWeeklyClick}>Weekly</button>
                            <button className='btn active-btn-data' onClick={handleTodayClick}>Today</button>
                        </div> */}
                </div>
                {!showMonthlyData && !showWeeklyData && !showTodayData && (
                    <div className="todayData define_float">
                        {userEvents.map((event, index) => (
                            <div key={index} className="event-info define_float">
                                <div className='event_inner_data define_float'>
                                    <span className="evnet_mobile-name">{event.event_name}</span>
                                    <span className="evnet_mobile-date">{event.event_date}</span>

                                    <p className='event_result-active'>
                                        {event.result && (
                                            <span>{event.result}</span>
                                        )}
                                    </p>

                                    {/* <span className='event_result-active'>{event.result}</span> */}
                                    {/* <span className="mobile_carte_icon">
                                        {event.expanded ? (
                                            <img src={process.env.PUBLIC_URL + '/image/upArrow.svg'} alt="" onClick={() => handleClick(event.event_id)} />
                                        ) : (
                                            <img src={process.env.PUBLIC_URL + '/image/rightArrow.svg'} alt="" onClick={() => handleClick(event.event_id)} />
                                        )}
                                    </span> */}

                                    <span className="mobile_carte_icon">
                                        {eventLoadingStates[event.event_id] ? (
                                            <div className="loader">Loading...</div>
                                        ) : (
                                            <img
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    `/image/${event.expanded ? 'upArrow' : 'rightArrow'}.svg`
                                                }
                                                alt=""
                                                onClick={() => handleClick(event.event_id)}
                                            />
                                        )}
                                    </span>

                                </div>

                                {event.expanded && (
                                    <div key={index} className="row carte_icon-clickshow new_carte_click define_float">
                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Selected numbers</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userMainNumToday?.map((userMainNumToday, i) => (
                                                            <tr key={i}>
                                                                <td style={{ color: userMainNumToday.number === event.result ? '#16A34A' : 'inherit' }}>{userMainNumToday.number}</td>
                                                                <td>{userMainNumToday.prize}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {event.result !== '' && (
                                                    <div className="won-loss">
                                                        {userMainNumToday?.some(userMainNumToday => userMainNumToday.number === event.result) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Andar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userInnerNumToday?.map((userInnerNumToday, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userInnerNumToday.number === event.firstDigit ? '#16A34A' : 'inherit' }}>{userInnerNumToday.number}</td>
                                                                    <td>{userInnerNumToday.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.firstDigit !== '' && (
                                                    <div className="won-loss">
                                                        {userInnerNumToday?.some(userInnerNumToday => userInnerNumToday.number === event.firstDigit) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Bahar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userOuterNumToday?.map((userOuterNumToday, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userOuterNumToday.number === event.scndDigit ? '#16A34A' : 'inherit' }}>{userOuterNumToday.number}</td>
                                                                    <td>{userOuterNumToday.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.scndDigit !== '' && (
                                                    <div className="won-loss">
                                                        {userOuterNumToday?.some(userOuterNumToday => userOuterNumToday.number === event.scndDigit) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                    // <div className="todayData  define_float">
                    //     {userEvents.map((event, index) => (
                    //         <div key={index} className="event-info define_float">
                    //             <div className='event_inner_data define_float'>
                    //                 <span className="evnet_mobile-name">{event.event_name}</span>
                    //                 <span className="evnet_mobile-date">{event.event_date}</span>

                    //                 <p className='event_result-active'>
                    //                     {event.result && (
                    //                         <span>{event.result}</span>
                    //                     )}
                    //                 </p>

                    //                 {/* <span className='event_result-active'>{event.result}</span> */}
                    //                 <span className="mobile_carte_icon">
                    //                     {event.expanded ? (
                    //                         <img src={process.env.PUBLIC_URL + '/image/upArrow.svg'} alt="" onClick={() => handleClick(event.event_id)} />
                    //                     ) : (
                    //                         <img src={process.env.PUBLIC_URL + '/image/rightArrow.svg'} alt="" onClick={() => handleClick(event.event_id)} />
                    //                     )}
                    //                 </span>
                    //             </div>

                    //             {event.expanded && (
                    //                 <div key={index} className="row carte_icon-clickshow new_carte_click define_float">
                    //                     <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                    //                         <div className="game-right-sec-inner">
                    //                             <table>
                    //                                 <thead>
                    //                                     <tr>
                    //                                         <td className="sub-menu" colSpan={2}>Selected numbers</td>
                    //                                     </tr>
                    //                                 </thead>
                    //                                 <tbody>
                    //                                     <tr>
                    //                                         <td>Numbers</td>
                    //                                         <td>Prize</td>
                    //                                     </tr>
                    //                                     {userMainNumMonthly?.map((userMainNumMonthly, i) => (
                    //                                         <tr key={i}>
                    //                                             <td style={{ color: userMainNumMonthly.number === event.resultMonthly ? '#16A34A' : 'inherit' }}>{userMainNumMonthly.number}</td>
                    //                                             <td>{userMainNumMonthly.prize}</td>
                    //                                         </tr>
                    //                                     ))}
                    //                                 </tbody>
                    //                             </table>
                    //                             {event.resultMonthly && (
                    //                                 <div className="won-loss">
                    //                                     {userMainNumMonthly?.some(userMainNumMonthly => userMainNumMonthly.number === event.resultMonthly) ? (
                    //                                         <p className="won-ct">Win</p>
                    //                                     ) : (
                    //                                         <p className="loss-ct">Loss</p>
                    //                                     )}
                    //                                 </div>
                    //                             )}

                    //                         </div>
                    //                     </div>

                    //                     <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                    //                         <div className="game-right-sec-inner">
                    //                             <table>
                    //                                 <thead>
                    //                                     <tr>
                    //                                         <td className="sub-menu" colSpan={2}>Andar</td>
                    //                                     </tr>
                    //                                 </thead>
                    //                                 <tbody>
                    //                                     <tr>
                    //                                         <td>Numbers</td>
                    //                                         <td>Prize</td>
                    //                                     </tr>
                    //                                     {userInnerNumMonthly?.map((userInnerNumMonthly, i) => {
                    //                                         return (
                    //                                             <tr key={i}>
                    //                                                 <td style={{ color: userInnerNumMonthly.number === event.firstDigitMonthly ? '#16A34A' : 'inherit' }}>{userInnerNumMonthly.number}</td>
                    //                                                 <td>{userInnerNumMonthly.price}</td>
                    //                                             </tr>
                    //                                         )
                    //                                     })}
                    //                                 </tbody>
                    //                             </table>
                    //                             {event.firstDigitMonthly && (
                    //                                 <div className="won-loss">
                    //                                     {userInnerNumMonthly?.some(userInnerNumMonthly => userInnerNumMonthly.number === event.firstDigitMonthly) ? (
                    //                                         <p className="won-ct">Win</p>
                    //                                     ) : (
                    //                                         <p className="loss-ct">Loss</p>
                    //                                     )}
                    //                                 </div>
                    //                             )}
                    //                         </div>
                    //                     </div>

                    //                     <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                    //                         <div className="game-right-sec-inner">
                    //                             <table>
                    //                                 <thead>
                    //                                     <tr>
                    //                                         <td className="sub-menu" colSpan={2}>Bahar</td>
                    //                                     </tr>
                    //                                 </thead>
                    //                                 <tbody>
                    //                                     <tr>
                    //                                         <td>Numbers</td>
                    //                                         <td>Prize</td>
                    //                                     </tr>
                    //                                     {userOuterNumMonthly?.map((userOuterNumMonthly, i) => {
                    //                                         return (
                    //                                             <tr key={i}>
                    //                                                 <td style={{ color: userOuterNumMonthly.number === event.scndDigitMonthly ? '#16A34A' : 'inherit' }}>{userOuterNumMonthly.number}</td>
                    //                                                 <td>{userOuterNumMonthly.price}</td>
                    //                                             </tr>
                    //                                         )
                    //                                     })}
                    //                                 </tbody>
                    //                             </table>
                    //                             {event.scndDigitMonthly && (
                    //                                 <div className="won-loss">
                    //                                     {userOuterNumMonthly?.some(userOuterNumMonthly => userOuterNumMonthly.number === event.scndDigitMonthly) ? (
                    //                                         <p className="won-ct">Win</p>
                    //                                     ) : (
                    //                                         <p className="loss-ct">Loss</p>
                    //                                     )}
                    //                                 </div>
                    //                             )}

                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             )}

                    //         </div>
                    //     ))}



                    // </div>
                )}

                {showMonthlyData && userEventsMonthly.length > 0 && (
                    <div className="monthlyData define_float">
                        {userEventsMonthly.map((event, index) => (
                            <div key={index} className="event-info define_float">
                                <div className='event_inner_data define_float'>
                                    <span className="evnet_mobile-name">{event.event_nameMonthly}</span>
                                    <span className="evnet_mobile-date">{event.event_dateMonthly}</span>

                                    <p className='event_result-active'>
                                        {event.resultMonthly && (
                                            <span>{event.resultMonthly}</span>
                                        )}
                                    </p>

                                    {/* <span className='event_result-active'>{event.resultMonthly}</span> */}
                                    {/* <span className="mobile_carte_icon">
                                        {event.expanded ? (
                                            <img src={process.env.PUBLIC_URL + '/image/upArrow.svg'} alt="" onClick={() => handleClick(event.event_idMonthly)} />
                                        ) : (
                                            <img src={process.env.PUBLIC_URL + '/image/rightArrow.svg'} alt="" onClick={() => handleClick(event.event_idMonthly)} />
                                        )}
                                    </span> */}

                                    <span className="mobile_carte_icon">
                                        {eventLoadingStates[event.event_idMonthly] ? (
                                            <div className="loader">Loading...</div>
                                        ) : (
                                            <img
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    `/image/${event.expanded ? 'upArrow' : 'rightArrow'}.svg`
                                                }
                                                alt=""
                                                onClick={() => handleClick(event.event_idMonthly)}
                                            />
                                        )}
                                    </span>

                                </div>

                                {event.expanded && (
                                    <div key={index} className="row carte_icon-clickshow new_carte_click define_float">
                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Selected numbers</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userMainNumMonthly?.map((userMainNumMonthly, i) => (
                                                            <tr key={i}>
                                                                <td style={{ color: userMainNumMonthly.number === event.resultMonthly ? '#16A34A' : 'inherit' }}>{userMainNumMonthly.number}</td>
                                                                <td>{userMainNumMonthly.prize}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {event.resultMonthly !== '' && (
                                                    <div className="won-loss">
                                                        {userMainNumMonthly?.some(userMainNumMonthly => userMainNumMonthly.number === event.resultMonthly) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Andar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userInnerNumMonthly?.map((userInnerNumMonthly, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userInnerNumMonthly.number === event.firstDigitMonthly ? '#16A34A' : 'inherit' }}>{userInnerNumMonthly.number}</td>
                                                                    <td>{userInnerNumMonthly.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.firstDigitMonthly !== '' && (
                                                    <div className="won-loss">
                                                        {userInnerNumMonthly?.some(userInnerNumMonthly => userInnerNumMonthly.number === event.firstDigitMonthly) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Bahar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userOuterNumMonthly?.map((userOuterNumMonthly, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userOuterNumMonthly.number === event.scndDigitMonthly ? '#16A34A' : 'inherit' }}>{userOuterNumMonthly.number}</td>
                                                                    <td>{userOuterNumMonthly.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.scndDigitMonthly !== '' && (
                                                    <div className="won-loss">
                                                        {userOuterNumMonthly?.some(userOuterNumMonthly => userOuterNumMonthly.number === event.scndDigitMonthly) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))}



                    </div>
                )}

                {showWeeklyData && userEventsWeekly.length > 0 && (
                    <div className="weeklyData define_float">
                        {userEventsWeekly.map((event, index) => (
                            <div key={index} className="event-info define_float">
                                <div className='event_inner_data define_float'>
                                    <span className="evnet_mobile-name">{event.event_nameWeekly}</span>
                                    <span className="evnet_mobile-date">{event.event_dateWeekly}</span>

                                    <p className='event_result-active'>
                                        {event.resultWeekly && (
                                            <span>{event.resultWeekly}</span>
                                        )}
                                    </p>

                                    {/* <span className='event_result-active'>{event.resultWeekly}</span> */}
                                    {/* <span className="mobile_carte_icon">
                                        {event.expanded ? (
                                            <img src={process.env.PUBLIC_URL + '/image/upArrow.svg'} alt="" onClick={() => handleClick(event.event_idWeekly)} />
                                        ) : (
                                            <img src={process.env.PUBLIC_URL + '/image/rightArrow.svg'} alt="" onClick={() => handleClick(event.event_idWeekly)} />
                                        )}
                                    </span> */}

                                    <span className="mobile_carte_icon">
                                        {eventLoadingStates[event.event_idWeekly] ? (
                                            <div className="loader">Loading...</div>
                                        ) : (
                                            <img
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    `/image/${event.expanded ? 'upArrow' : 'rightArrow'}.svg`
                                                }
                                                alt=""
                                                onClick={() => handleClick(event.event_idWeekly)}
                                            />
                                        )}
                                    </span>

                                </div>

                                {event.expanded && (
                                    <div key={index} className="row carte_icon-clickshow new_carte_click define_float">
                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Selected numbers</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userMainNumWeekly?.map((userMainNumWeekly, i) => (
                                                            <tr key={i}>
                                                                <td style={{ color: userMainNumWeekly.number === event.resultWeekly ? '#16A34A' : 'inherit' }}>{userMainNumWeekly.number}</td>
                                                                <td>{userMainNumWeekly.prize}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {event.resultWeekly !== '' && (
                                                    <div className="won-loss">
                                                        {userMainNumWeekly?.some(userMainNumWeekly => userMainNumWeekly.number === event.resultWeekly) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Andar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userInnerNumWeekly?.map((userInnerNumWeekly, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userInnerNumWeekly.number === event.firstDigitWeekly ? '#16A34A' : 'inherit' }}>{userInnerNumWeekly.number}</td>
                                                                    <td>{userInnerNumWeekly.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.firstDigitWeekly !== '' && (
                                                    <div className="won-loss">
                                                        {userInnerNumWeekly?.some(userInnerNumWeekly => userInnerNumWeekly.number === event.firstDigitWeekly) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Bahar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userOuterNumWeekly?.map((userOuterNumWeekly, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userOuterNumWeekly.number === event.scndDigitWeekly ? '#16A34A' : 'inherit' }}>{userOuterNumWeekly.number}</td>
                                                                    <td>{userOuterNumWeekly.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.scndDigitWeekly !== '' && (
                                                    <div className="won-loss">
                                                        {userOuterNumWeekly?.some(userOuterNumWeekly => userOuterNumWeekly.number === event.scndDigitWeekly) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        ))}


                    </div>
                )}

                {showTodayData && (
                    <div className="todayData define_float">
                        {userEvents.map((event, index) => (
                            <div key={index} className="event-info define_float">
                                <div className='event_inner_data define_float'>
                                    <span className="evnet_mobile-name">{event.event_name}</span>
                                    <span className="evnet_mobile-date">{event.event_date}</span>

                                    <p className='event_result-active'>
                                        {event.result && (
                                            <span>{event.result}</span>
                                        )}
                                    </p>

                                    {/* <span className='event_result-active'>{event.result}</span> */}
                                    {/* <span className="mobile_carte_icon">
                                        {event.expanded ? (
                                            <img src={process.env.PUBLIC_URL + '/image/upArrow.svg'} alt="" onClick={() => handleClick(event.event_id)} />
                                        ) : (
                                            <img src={process.env.PUBLIC_URL + '/image/rightArrow.svg'} alt="" onClick={() => handleClick(event.event_id)} />
                                        )}
                                    </span> */}

                                    <span className="mobile_carte_icon">
                                        {eventLoadingStates[event.event_id] ? (
                                            <div className="loader">Loading...</div>
                                        ) : (
                                            <img
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    `/image/${event.expanded ? 'upArrow' : 'rightArrow'}.svg`
                                                }
                                                alt=""
                                                onClick={() => handleClick(event.event_id)}
                                            />
                                        )}
                                    </span>

                                </div>

                                {event.expanded && (
                                    <div key={index} className="row carte_icon-clickshow new_carte_click define_float">
                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Selected numbers</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userMainNumToday?.map((userMainNumToday, i) => (
                                                            <tr key={i}>
                                                                <td style={{ color: userMainNumToday.number === event.result ? '#16A34A' : 'inherit' }}>{userMainNumToday.number}</td>
                                                                <td>{userMainNumToday.prize}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {event.result !== '' && (
                                                    <div className="won-loss">
                                                        {userMainNumToday?.some(userMainNumToday => userMainNumToday.number === event.result) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Andar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userInnerNumToday?.map((userInnerNumToday, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userInnerNumToday.number === event.firstDigit ? '#16A34A' : 'inherit' }}>{userInnerNumToday.number}</td>
                                                                    <td>{userInnerNumToday.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.firstDigit !== '' && (
                                                    <div className="won-loss">
                                                        {userInnerNumToday?.some(userInnerNumToday => userInnerNumToday.number === event.firstDigit) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4 game-right-sec numbrs history_numbers-table pd-0">
                                            <div className="game-right-sec-inner">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td className="sub-menu" colSpan={2}>Bahar</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Numbers</td>
                                                            <td>Prize</td>
                                                        </tr>
                                                        {userOuterNumToday?.map((userOuterNumToday, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ color: userOuterNumToday.number === event.scndDigit ? '#16A34A' : 'inherit' }}>{userOuterNumToday.number}</td>
                                                                    <td>{userOuterNumToday.price}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {event.scndDigit !== '' && (
                                                    <div className="won-loss">
                                                        {userOuterNumToday?.some(userOuterNumToday => userOuterNumToday.number === event.scndDigit) ? (
                                                            <p className="won-ct">Win</p>
                                                        ) : (
                                                            <p className="loss-ct">Loss</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        ))}




                    </div>
                )}

                {/* {userEvents.map((event, index) => (
                event.expanded && (
                    <div key={index} className="row carte_icon-clickshow">
                        <div className="col-md-4 game-right-sec numbrs">
                            <div className="game-right-sec-inner">
                                <table>
                                    <thead>
                                        <tr>
                                            <td className="sub-menu" colSpan={2}>Selected numbers</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Numbers</td>
                                            <td>Prize</td>
                                        </tr>
                                        {userMainNumToday?.map((userMainNumToday, i) => (
                                            <tr key={i}>
                                                <td style={{ backgroundColor: userMainNumToday.number === event.result ? 'green' : 'inherit' }}>{userMainNumToday.number}</td>
                                                <td>{userMainNumToday.prize}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {event.result && (
                                    <div className="won-loss">
                                        {userMainNumToday?.some(userMainNumToday => userMainNumToday.number === event.result) ? (
                                            <p>Won</p>
                                        ) : (
                                            <p>Loss</p>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="col-md-4 game-right-sec numbrs">
                            <div className="game-right-sec-inner">
                                <table>
                                    <thead>
                                        <tr>
                                            <td className="sub-menu" colspan={2}>Andar</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Numbers</td>
                                            <td>Prize</td>
                                        </tr>
                                        {userInnerNumToday?.map((userInnerNumToday, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{ backgroundColor: userInnerNumToday.number === event.firstDigit ? 'green' : 'inherit' }}>{userInnerNumToday.number}</td>
                                                    <td>{userInnerNumToday.price}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {event.result && (
                                    <div className="test">
                                        {userInnerNumToday?.some(userInnerNumToday => userInnerNumToday.number === event.firstDigit) ? (
                                            <p>Won</p>
                                        ) : (
                                            <p>Loss</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-4 game-right-sec numbrs">
                            <div className="game-right-sec-inner">
                                <table>
                                    <thead>
                                        <tr>
                                            <td className="sub-menu" colspan={2}>Bahar</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Numbers</td>
                                            <td>Prize</td>
                                        </tr>
                                        {userOuterNumToday?.map((userOuterNumToday, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{ backgroundColor: userOuterNumToday.number === event.scndDigit ? 'green' : 'inherit' }}>{userOuterNumToday.number}</td>
                                                    <td>{userOuterNumToday.price}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {event.result && (
                                    <div className="test">
                                        {userOuterNumToday?.some(userOuterNumToday => userOuterNumToday.number === event.scndDigit) ? (
                                            <p>Won</p>
                                        ) : (
                                            <p>Loss</p>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                )
            ))} */}
            </div>
        </div>
    );
}

export default History;