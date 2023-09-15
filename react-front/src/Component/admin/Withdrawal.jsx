import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Datatable from 'react-data-table-component';

function Withdrawal(props) {

    const [data, setdata] = useState();
    const [approved, setApprovedData] = useState();
    const [rejected, setRejectedData] = useState();
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const DataPerPage = useRef(5)

    const autoRefreshTimer = useRef(null);

    const fetchWithdrawals = () => {
        try {
            axios.get(`/api/admin/withdrawals/fetch`).then(res => {
                //console.log(res.data.withdrawals);
                setdata(res.data.withdrawals);
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    // Function to start auto-refresh
    const startAutoRefresh = () => {
        autoRefreshTimer.current = setInterval(fetchWithdrawals, 5000); // 5 seconds
    }

    // Function to stop auto-refresh
    const stopAutoRefresh = () => {
        clearInterval(autoRefreshTimer.current);
    }


    const columns = [
        {
            name: "Username",
            selector: (row) => row.user_name,
        },
        // {
        //     name: "Account No.",
        //     selector: (row) => row.account_no
        // },
        {
            name: "Bank Details",
            cell: (row) => (
                <div>
                    <div><strong>Acc.No.:</strong> {row.account_no}</div>
                    <div><strong>Bank Name:</strong> {row.bank_name}</div>
                    <div><strong>Name:</strong> {row.bank_holder_name}</div>
                    <div><strong>IFSC Code:</strong> {row.ifsc_code}</div>
                </div>
            )
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
                    <button className='' onClick={() => handleStatusUpdate(row.id, 2)}>Reject</button>
                </>
            )
        }
    ];

    useEffect(() => {
        // Initial fetch
        fetchWithdrawals();

        // Start auto-refresh when the component mounts
        startAutoRefresh();

        // Clean up the interval when the component unmounts
        return () => stopAutoRefresh();
    }, []);

    const handleStatusUpdate = (paymentId, newStatus) => {
        try {
            axios.post(`/api/admin/withdrawal/update_withdrawals/${paymentId}`, { status: newStatus }).then(res => {
                // Handle successful update, such as showing a success message
                Swal.fire('Payment status updated', '', 'success');
                // Call fetchWithdrawals again to update the data
                fetchWithdrawals();
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="backend_payments" style={{ marginLeft: "40px", margin: "0px auto" }}>
            <Datatable
                title="Withdrawals"
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