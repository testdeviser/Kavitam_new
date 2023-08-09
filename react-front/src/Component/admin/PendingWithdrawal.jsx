import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Datatable from 'react-data-table-component';

function Withdrawal(props) {

    const [data, setdata] = useState();

    const autoRefreshTimer = useRef(null);

    const pendingWithdrawal = () => {
        try {
            axios.get(`/api/admin/pendingWithdrawal/fetch`).then(res => {
                //console.log(res.data.pendingWithdrawal);
                setdata(res.data.pendingWithdrawal);
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    // Function to start auto-refresh
    const startAutoRefresh = () => {
        autoRefreshTimer.current = setInterval(pendingWithdrawal, 5000); // 5 seconds
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
        },
        {
            name: "Status",
            cell: (row) => (
                <>
                    <button className='' onClick={() => handleStatusUpdate(row.id, 1)}>Approve</button>
                </>
            )
        }
    ];

    useEffect(() => {
        // Initial fetch
        pendingWithdrawal();

        // Start auto-refresh when the component mounts
        startAutoRefresh();

        // Clean up the interval when the component unmounts
        return () => stopAutoRefresh();
    }, []);

    const handleStatusUpdate = (paymentId, newStatus) => {
        try {
            axios.post(`/api/admin/pendingWithdrawal/update_pendingWithdrawal/${paymentId}`, { status: newStatus }).then(res => {
                // Handle successful update, such as showing a success message
                Swal.fire('Payment status updated', '', 'success');
                // Call pendingWithdrawal again to update the data
                pendingWithdrawal();
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="backend_payments" style={{ marginLeft: "40px", margin: "0px auto" }}>
            <Datatable
                title="Pending Withdrawals"
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

export default Withdrawal;