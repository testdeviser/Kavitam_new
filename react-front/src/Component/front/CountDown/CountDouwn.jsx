import React, { useRef, useEffect, useState } from 'react';
import ReactCountdownClock from 'react-countdown-clock';
import axios from 'axios';



function CountDouwn({ eventHours, eventMinutes, eventSeconds, eventYear, eventMonths, eventDate, ...props }) {
    const [date, setdate] = useState(new Date());
    // const currentTime=useRef(new Date());

    var currenthours = date.getHours();
    var currentminutes = date.getMinutes();
    var currentseconds = date.getSeconds();
    var currntYear = date.getFullYear();
    var currentMonth = date.getMonth();
    var currentDay = date.getDate();

    var currentDates = new Date(currntYear, currentMonth, currentDay, currenthours, currentminutes);
    var dbdate = new Date(eventYear, eventMonths, eventDate, eventHours, eventMinutes, eventSeconds);




    var timeLeft = 0;

    // if(dbdate !='' && dbdate !=null)
    // {                

    var diff = currentDates.getTime() - dbdate.getTime();
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    console.log(hh + ":" + mm + ":" + ss);
    timeLeft = ((50 - mm) * 60);
    console.log(timeLeft);

    // const fetchTotoalOf_all = async () => {
    //     const data = {
    //         event_id: 57,
    //     };

    //     try {
    //         const res = await axios.post('/api/final_result', data);
    //         console.log("print result");
    //         // setdata(res.data.total);
    //         // setresult({ ...result, number: res.data.randomNumber });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // useEffect(() => {
    //     if (timeLeft <= 1560) {
    //         fetchTotoalOf_all();
    //     }
    // }, []);

    //console.log(timeLeft);
    // }


    useEffect(() => {
        var timer = setInterval(() => setdate(new Date()), 1000)
        return function cleanup() {
            clearInterval(timer)
        }
    });

    if (props.EventsStatus) {
        props.countdownStatus('start');
        return (
            <div>
                <ReactCountdownClock seconds={timeLeft}
                    color="#336BFF"
                    alpha={0.9}
                    size={100}
                    onComplete={props.myCallback}
                />
            </div>
        );
    }
    else {

        return (
            <div>
                <ReactCountdownClock seconds={0}
                    color="#336BFF"
                    alpha={0.9}
                    size={100}
                    //  paused={true}                   
                    onComplete={props.myCallback}
                />
            </div>
        );
    }

}
export default CountDouwn;

