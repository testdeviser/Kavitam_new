import React, { useEffect, useState, useRef } from 'react';
import { FaPlusSquare, FaTrashAlt, FaPenSquare, FaTrophy } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../pagination/pagination';
import Datatable from 'react-data-table-component';

function Payments(props) {

    const [data, setdata] = useState();
    const [approved, setApprovedData] = useState();
    const [rejected, setRejectedData] = useState();
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const DataPerPage = useRef(5)

    const autoRefreshTimer = useRef(null);

    const fetchPayments = () => {
        try {
            axios.get(`/api/admin/payments/fetch`).then(res => {
                console.log(res.data.payments);
                setdata(res.data.payments);
                setApprovedData(res.data.approved);
                setRejectedData(res.data.rejected);
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    // Function to start auto-refresh
    const startAutoRefresh = () => {
        autoRefreshTimer.current = setInterval(fetchPayments, 5000); // 5 seconds
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
            name: "Amount",
            selector: (row) => row.amount
        },
        {
            name: "UTR No.",
            selector: (row) => row.refNo
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

    const columns1 = [
        {
            name: "Username",
            selector: (row) => row.username,
        },
        {
            name: "Amount",
            selector: (row) => row.amount
        },
        {
            name: "UTR No.",
            selector: (row) => row.refNo
        },
    ];

    const columns2 = [
        {
            name: "Username",
            selector: (row) => row.username,
        },
        {
            name: "Amount",
            selector: (row) => row.amount
        },
        {
            name: "UTR No.",
            selector: (row) => row.refNo
        },
    ];

    useEffect(() => {
        // Initial fetch
        fetchPayments();

        // Start auto-refresh when the component mounts
        startAutoRefresh();

        // Clean up the interval when the component unmounts
        return () => stopAutoRefresh();
    }, []);
    const lastIndex = currentPage * DataPerPage.current;
    const firstIndex = lastIndex - DataPerPage.current;
    const data1 = data ? data.slice(firstIndex, lastIndex) : [];
    const data2 = approved ? approved.slice(firstIndex, lastIndex) : [];
    const data3 = rejected ? rejected.slice(firstIndex, lastIndex) : [];

    const handleStatusUpdate = (paymentId, newStatus) => {
        try {
            //axios.put(`/api/admin/payments/${paymentId}`, { status: newStatus }).then(res => {
            axios.post(`/api/admin/payments/update_payments/${paymentId}`, { status: newStatus }).then(res => {
                // Handle successful update, such as showing a success message
                Swal.fire('Payment status updated', '', 'success');
                // Call fetchPayments again to update the data
                fetchPayments();
            });
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className="backend_payments" style={{ marginLeft: "40px", margin: "0px auto" }}>

            <Datatable
                title="Pending Payments"
                columns={columns}
                data={data}
                pagination
                fixedHeader
                fixedHeaderScrollHeight='400px'
                //selectableRows
                selectableRowsHighlight
                highlightOnHover
            //actions={<button className='btn btn-sm btn-info'>Export</button>}
            />

            <Datatable
                title="Approved Payments"
                columns={columns1}
                data={approved}
                pagination
                fixedHeader
                fixedHeaderScrollHeight='400px'
                //selectableRows
                selectableRowsHighlight
                highlightOnHover
            //actions={<button className='btn btn-sm btn-info'>Export</button>}
            />

            <Datatable
                title="Rejected Payments"
                columns={columns2}
                data={rejected}
                pagination
                fixedHeader
                fixedHeaderScrollHeight='400px'
                //selectableRows
                selectableRowsHighlight
                highlightOnHover
            //actions={<button className='btn btn-sm btn-info'>Export</button>}
            />
        </div>
    );
}

export default Payments;