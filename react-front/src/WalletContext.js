import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletAmount, setWalletAmount] = useState(0);
    const [events, setEvents] = useState();

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => {
            clearInterval(interval); // Clean up the interval on component unmount
        };
    }, []);

    const fetchData = () => {
        // axios
        //     .get('api/fetchWalletBalance')
        //     .then((res) => {
        //         if (res.data.status === 200) {
        //             setEvents(res.data.amount);
        //         } else {
        //             console.log('Events not found');
        //             setEvents(0); // If events are not found, set it to 0
        //         }
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         setEvents(0); // If there's an error, set events to 0
        //     });
    };

    useEffect(() => {
        const storedWalletAmount = localStorage.getItem('wallet');
        if (storedWalletAmount !== null) {
            setWalletAmount(Number(storedWalletAmount));
        } else {
            setWalletAmount(0);
        }

        // If events are empty, set storedWalletAmount to 0
        if (!events) {
            setWalletAmount(0);
        }
    }, [events]);

    return (
        <WalletContext.Provider value={{ walletAmount, setWalletAmount, events }}>
            {children}
        </WalletContext.Provider>
    );
};
