import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Datatable from 'react-data-table-component';

function WithdrawalHistory(props) {

    const [data, setdata] = useState();
    const autoRefreshTimer = useRef(null);

    const fetchWithdrawalHistory = () => {
        try {
            axios.get(`/api/admin/withdrawalHistory/fetch`).then(res => {
                setdata(res.data.withdrawalHistory);
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    // Function to start auto-refresh
    const startAutoRefresh = () => {
        autoRefreshTimer.current = setInterval(fetchWithdrawalHistory, 5000); // 5 seconds
    }

    // Function to stop auto-refresh
    const stopAutoRefresh = () => {
        clearInterval(autoRefreshTimer.current);
    }

    const columns = [
        {
            name: "Username",
            selector: (row) => row.username,
        },
        {
            name: "Account No.",
            selector: (row) => row.account_no
        },
        {
            name: "Amount",
            selector: (row) => row.amount
        }
    ];

    useEffect(() => {
        // Initial fetch
        fetchWithdrawalHistory();

        // Start auto-refresh when the component mounts
        startAutoRefresh();

        // Clean up the interval when the component unmounts
        return () => stopAutoRefresh();
    }, []);

    return (
        <div className="backend_payments" style={{ marginLeft: "40px", margin: "0px auto" }}>
            <Datatable
                title="Withdrawal History"
                columns={columns}
                data={data}
                pagination
                fixedHeader
                fixedHeaderScrollHeight='400px'
                selectableRowsHighlight
                highlightOnHover
            />
        </div>
    );
}

export default WithdrawalHistory;