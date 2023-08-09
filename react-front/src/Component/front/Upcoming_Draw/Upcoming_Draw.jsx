import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../assets/front/css/upcoming_draw.css';

function Upcoming_Draw(props) {
    const [date, setdate] = useState(new Date());
    const [data, setdata] = useState(
        {
            Upcoming_Draw: [],
            no_of_record: 3,
        }
    );

    const fetchUpcommingEvent = async () => {
        try {
            axios.get(`/api/Result_today`).then(res => {
                setdata({ ...data, Upcoming_Draw: res.data.event });
            });
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        fetchUpcommingEvent();
    }, []);

    useEffect(() => {
        var timer = setInterval(() => setdate(new Date()), 1000)
        return function cleanup() {
            clearInterval(timer)
        }
    });

    const data1 = data.Upcoming_Draw.slice(0, 4);

    var EventActiveStatus = '';
    return (
        <>
            <h5 className='heading mt-5'>Numbers</h5>
            {/* <img src={process.env.PUBLIC_URL + '/image/Vector.svg'} alt="" width={30} height={60} /> */}
            <img className='white_dot_img' src={process.env.PUBLIC_URL + '/image/white-dot-lines.png'} alt="" width={218} height={18} />
            <h2 className="text-center mt-3 underline">Upcoming Draw</h2>
            <div className="container">
                <div className="row">
                    {data1?.map((e, i) => {

                        var event_date = new Date(e.event_date);
                        const increaseTime50 = new Date(e.event_date);
                        const dbtime = new Date(e.event_date);
                        let dbdate = dbtime.toDateString();
                        let EVTime = dbtime.getHours() + ':' + dbtime.getMinutes() + ':' + dbtime.getSeconds();

                        increaseTime50.setTime(increaseTime50.getTime() + (50 * 60 * 1000));

                        if (date.getFullYear() <= increaseTime50.getFullYear() || date.getMonth() <= increaseTime50.getMonth() || date.getDate() < increaseTime50.getDate()) {

                            //    if(date.getMonth()<=increaseTime50.getMonth())
                            //    {

                            // if(date.getDate()<increaseTime50.getDate())
                            // {

                            return (
                                <div className="col-md-4 mt-3 upcoming-event-container" style={{ 'position': 'relative' }} key={i}>
                                    <div className="card text-center zoom " style={{ 'width': '20rem' }}>
                                        <div className='upcoming-draw event-time'><h3>{event_date.toLocaleTimeString()}</h3></div>
                                        <div className="card-body">
                                            <h6 className="card-subtitle mt-3 winning-numbers" >{e.name}</h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="normal-text">Draw took place on</p>
                                            <b className='event-text'>{event_date.toDateString() + ' ' + event_date.toLocaleTimeString()}</b>
                                        </div>
                                    </div>
                                </div>
                            )
                            // }
                            // }

                        }
                        else if (increaseTime50.toDateString() == date.toDateString()) {
                            if (date.toTimeString() < dbtime.toTimeString()) {
                                return (
                                    <div className="col-md-4 mt-3" style={{ 'position': 'relative' }} key={i}>
                                        <div className="card text-center zoom " style={{ 'width': '20rem' }}>
                                            <div className='upcoming-draw event-time'><h3>{event_date.toLocaleTimeString()}</h3></div>
                                            <div className="card-body">
                                                <h6 className="card-subtitle mt-3 winning-numbers" >{e.name}</h6>
                                            </div>
                                            <div className="card-body">
                                                <p className="normal-text">Draw took place on</p>
                                                <b className='event-text'>{event_date.toDateString() + ' ' + event_date.toLocaleTimeString()}</b>
                                            </div>
                                        </div>
                                    </div>

                                )
                            }
                        }



                    })
                    }

                </div>
            </div>
        </>
    );
}

export default Upcoming_Draw;