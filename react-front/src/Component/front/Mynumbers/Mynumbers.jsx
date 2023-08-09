import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Mynumbers(props) {
    const [data, setdata] = useState({
        main: [],
        inner: [],
        outer: [],
        event: [],
    });
    const fetchdata = async () => {
        try {
            axios.get(`/api/mynumber/fetch`).then(res => {
                console.log(res);
                setdata(
                    {
                        ...data,
                        main: res.data.main,
                        inner: res.data.inner,
                        outer: res.data.outer,
                        event: res.data.event,
                    }
                )
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <div className="container-fluid">
            <h2 className='text text-center' style={{ 'textDecorationLine': 'underline', 'textDecorationStyle': 'double' }}>Selected numbers</h2>
            <div className="row">
                <div className="col-md-9">
                    <table className="table bordered table-striped  table-hover mt-5">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th scope="col">Number</th>
                                <th scope="col">Prize</th>
                            </tr>
                        </thead>
                        <tbody className="text-center align-middle text-center">
                            {/* Main */}
                            <tr className='text-center'>
                                <td colSpan={2}><h6>Main</h6></td>
                            </tr>
                            {data.main?.map((main, i) =>
                                <tr key={i}>
                                    <td>{main.number}</td>
                                    <td>{main.prize}</td>
                                </tr>
                            )}
                            {/* Main end */}


                            {/* Inner */}
                            <tr className='text-center'>
                                <td colSpan={2}><h6>Inner</h6></td>
                            </tr>
                            {data.inner?.map((inner, i) =>
                                <tr key={i}>
                                    <td>{inner.number}</td>
                                    <td>{inner.price}</td>
                                </tr>
                            )}

                            {/* Inner End */}

                            {/* outer */}

                            <tr className='text-center'>
                                <td colSpan={2}><h6>Outer</h6></td>
                            </tr>
                            {data.outer?.map((outer, i) =>
                                <tr key={i}>
                                    <td>{outer.number}</td>
                                    <td>{outer.price}</td>
                                </tr>
                            )}

                            {/* outer End */}

                        </tbody>
                    </table>
                </div>


                <div className="col-md-3 mt-4 me-auto">
                    <h4 style={{ 'textAlign': 'center', 'textDecorationLine': 'underline', 'textDecorationStyle': 'double' }}>Results</h4>
                    <table className="table bordered table-striped  table-hover mt-5">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th scope="col">Event</th>
                                <th scope="col">Result</th>
                            </tr>
                        </thead>
                        <tbody className="text-center align-middle text-center">
                            {data.event?.map((event, i) => {
                                var event_date = new Date(event.event_date);
                                return (
                                    <tr key={i}>
                                        <td>{event_date.toLocaleString()}</td>
                                        <td>{event.result}</td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Mynumbers;